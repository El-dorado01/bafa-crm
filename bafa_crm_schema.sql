/*
  # BAFA CRM MVP Database Schema

  ## Overview
  Creates the complete database schema for a BAFA-funded consulting project management platform.
  This schema enforces strict role-based access control and audit-proof document tracking.

  ## Tables Created

  ### 1. Core Tables
  - `profiles` - Extended user profiles with role assignments
  - `projects` - BAFA consulting projects/cases
  - `project_participants` - Many-to-many relationship between users and projects

  ### 2. Reference Tables (Lookup/Enum)
  - `case_statuses` - 23 predefined BAFA case statuses in order
  - `document_types` - 13 BAFA-relevant document types with source attribution
  - `document_states` - 8 uniform document lifecycle states

  ### 3. Operational Tables
  - `documents` - Document instances with type, state, and version tracking
  - `communications` - Project-based messages between participants

  ## Role Definitions
  - `client` - Can upload documents, view own projects
  - `consultant` - Can report status, issue invoices, manage consulting content
  - `funding_advisor` - Full control: change statuses, approve documents, submit to BAFA

  ## Security
  - RLS enabled on all tables
  - Policies enforce role-based permissions per BAFA compliance requirements
  - Funding advisors are the only role with status change permissions
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (Extended User Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('client', 'consultant', 'funding_advisor')),
  company_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Funding advisors can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'funding_advisor'
    )
  );

-- =====================================================
-- CASE STATUSES (Reference Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS case_statuses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  status_order int UNIQUE NOT NULL,
  status_name text UNIQUE NOT NULL,
  status_category text NOT NULL CHECK (status_category IN ('active', 'revision', 'end')),
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE case_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view case statuses"
  ON case_statuses FOR SELECT
  TO authenticated
  USING (true);

-- Insert the 23 BAFA case statuses
INSERT INTO case_statuses (status_order, status_name, status_category, description) VALUES
  (1, 'Lead / inquiry received', 'active', 'Initial contact from potential client'),
  (2, 'Funding eligibility under review', 'active', 'Reviewing if project qualifies for BAFA funding'),
  (3, 'Not eligible for funding – closed', 'end', 'Project does not qualify for BAFA funding'),
  (4, 'Documents requested', 'active', 'Required documents have been requested from client'),
  (5, 'Documents incomplete', 'revision', 'Submitted documents are incomplete or incorrect'),
  (6, 'Documents complete', 'active', 'All required documents received and verified'),
  (7, 'Master data application submitted to BAFA', 'active', 'Initial application submitted to BAFA'),
  (8, 'Letter of intent received – consultation approved', 'active', 'BAFA letter of intent received, consultation may begin'),
  (9, 'Consultant contract sent', 'active', 'Contract sent to client for signature'),
  (10, 'Consultant contract fully signed', 'active', 'Contract signed by all parties'),
  (11, 'Consultation in progress', 'active', 'Active consulting phase (max 6 months)'),
  (12, 'Consultation completed', 'active', 'Consulting work finished'),
  (13, 'Invoice issued', 'active', 'Invoice sent to client'),
  (14, 'Proof of payment received', 'active', 'Client payment confirmation received'),
  (15, 'Final report in preparation', 'active', 'Final report being prepared'),
  (16, 'Final report signed', 'active', 'Final report signed by all parties'),
  (17, 'Proof of use in preparation', 'active', 'Proof of use documentation being prepared'),
  (18, 'Proof of use submitted', 'active', 'Proof of use submitted to BAFA'),
  (19, 'BAFA inquiry / follow-up question', 'revision', 'BAFA has questions requiring response'),
  (20, 'Approved / funding decision received', 'active', 'Final BAFA approval received'),
  (21, 'Payout completed', 'active', 'Funding payment received'),
  (22, 'Case closed (archived)', 'end', 'Project completed and archived')
ON CONFLICT (status_order) DO NOTHING;

-- =====================================================
-- DOCUMENT TYPES (Reference Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS document_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_name text UNIQUE NOT NULL,
  source_role text NOT NULL CHECK (source_role IN ('client', 'consultant', 'funding_advisor')),
  description text,
  is_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view document types"
  ON document_types FOR SELECT
  TO authenticated
  USING (true);

-- Insert the 13 BAFA document types
INSERT INTO document_types (type_name, source_role, description, is_required) VALUES
  -- From client
  ('Power of attorney', 'client', 'Legal authorization document', true),
  ('SME declaration', 'client', 'Small and medium enterprise declaration', true),
  ('De-minimis declaration', 'client', 'EU state aid declaration', false),
  ('Proof of payment', 'client', 'Bank statement with statement number', true),
  ('Signed final report (client)', 'client', 'Client-signed version of final report', true),
  ('Signed proof of use (client)', 'client', 'Client-signed proof of use document', true),
  
  -- From consultant
  ('Consultant contract', 'consultant', 'Contract including attachments', true),
  ('Consulting contents', 'consultant', '5-6 bullet points per consulting day', true),
  ('Invoice', 'consultant', 'Consultant invoice for services', true),
  ('Signed final report (consultant)', 'consultant', 'Consultant-signed final report', true),
  
  -- From funding advisor
  ('Master data application', 'funding_advisor', 'Initial BAFA application', true),
  ('Final report', 'funding_advisor', 'Official final report for BAFA', true),
  ('Proof of use', 'funding_advisor', 'Official proof of use for BAFA', true)
ON CONFLICT (type_name) DO NOTHING;

-- =====================================================
-- DOCUMENT STATES (Reference Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS document_states (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_order int UNIQUE NOT NULL,
  state_name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE document_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view document states"
  ON document_states FOR SELECT
  TO authenticated
  USING (true);

-- Insert the 8 uniform document states
INSERT INTO document_states (state_order, state_name, description) VALUES
  (1, 'Requested', 'Document has been requested'),
  (2, 'Uploaded / received', 'Document has been uploaded or received'),
  (3, 'Formally reviewed', 'Document has been formally reviewed'),
  (4, 'Correction required', 'Document needs corrections'),
  (5, 'Corrected version received', 'Corrected document has been received'),
  (6, 'Approved', 'Document has been approved'),
  (7, 'Submitted to BAFA', 'Document has been submitted to BAFA'),
  (8, 'Final archived', 'Document has been archived')
ON CONFLICT (state_order) DO NOTHING;

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_number text UNIQUE NOT NULL,
  client_id uuid REFERENCES profiles(id) ON DELETE RESTRICT,
  consultant_id uuid REFERENCES profiles(id) ON DELETE RESTRICT,
  funding_advisor_id uuid REFERENCES profiles(id) ON DELETE RESTRICT,
  current_status_id uuid REFERENCES case_statuses(id) ON DELETE RESTRICT,
  
  -- Project details
  project_name text NOT NULL,
  company_name text NOT NULL,
  consultation_days int,
  consultation_start_date date,
  consultation_end_date date,
  
  -- Financial
  total_cost_euros decimal(10,2),
  funding_amount_euros decimal(10,2),
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  archived boolean DEFAULT false
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view projects they participate in"
  ON projects FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid() 
    OR consultant_id = auth.uid() 
    OR funding_advisor_id = auth.uid()
  );

CREATE POLICY "Funding advisors can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'funding_advisor'
    )
  );

CREATE POLICY "Funding advisors can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'funding_advisor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'funding_advisor'
    )
  );

-- =====================================================
-- PROJECT PARTICIPANTS (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS project_participants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('client', 'consultant', 'funding_advisor')),
  added_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE project_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants in their projects"
  ON project_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id
      AND (p.client_id = auth.uid() OR p.consultant_id = auth.uid() OR p.funding_advisor_id = auth.uid())
    )
  );

CREATE POLICY "Funding advisors can manage participants"
  ON project_participants FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'funding_advisor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'funding_advisor'
    )
  );

-- =====================================================
-- DOCUMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  document_type_id uuid REFERENCES document_types(id) ON DELETE RESTRICT,
  current_state_id uuid REFERENCES document_states(id) ON DELETE RESTRICT,
  
  -- Document details
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size_bytes bigint,
  mime_type text,
  
  -- Version control
  version_number int DEFAULT 1,
  is_latest_version boolean DEFAULT true,
  replaced_by_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  
  -- Tracking
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Metadata
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents in their projects"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id
      AND (p.client_id = auth.uid() OR p.consultant_id = auth.uid() OR p.funding_advisor_id = auth.uid())
    )
  );

CREATE POLICY "Users can upload documents to their projects"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id
      AND (p.client_id = auth.uid() OR p.consultant_id = auth.uid() OR p.funding_advisor_id = auth.uid())
    )
  );

CREATE POLICY "Funding advisors can update any document"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'funding_advisor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'funding_advisor'
    )
  );

-- =====================================================
-- COMMUNICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS communications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Message content
  subject text,
  message text NOT NULL,
  is_internal_note boolean DEFAULT false,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view communications in their projects"
  ON communications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id
      AND (p.client_id = auth.uid() OR p.consultant_id = auth.uid() OR p.funding_advisor_id = auth.uid())
    )
  );

CREATE POLICY "Users can create communications in their projects"
  ON communications FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id
      AND (p.client_id = auth.uid() OR p.consultant_id = auth.uid() OR p.funding_advisor_id = auth.uid())
    )
  );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_consultant_id ON projects(consultant_id);
CREATE INDEX IF NOT EXISTS idx_projects_funding_advisor_id ON projects(funding_advisor_id);
CREATE INDEX IF NOT EXISTS idx_projects_current_status_id ON projects(current_status_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type_id ON documents(document_type_id);
CREATE INDEX IF NOT EXISTS idx_communications_project_id ON communications(project_id);
CREATE INDEX IF NOT EXISTS idx_project_participants_project_id ON project_participants(project_id);
CREATE INDEX IF NOT EXISTS idx_project_participants_user_id ON project_participants(user_id);