const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const users = [
  {
    email: 'advisor@bafa.com',
    password: 'password123',
    role: 'FUNDING_ADVISOR',
  },
  { email: 'consultant@bafa.com', password: 'password123', role: 'CONSULTANT' },
  { email: 'client@company.com', password: 'password123', role: 'CLIENT' },
];

async function syncUsers() {
  console.log('Syncing users to Supabase Auth...');

  for (const user of users) {
    // Check if user exists
    const { data: existingUser, error: findError } =
      await supabase.auth.admin.listUsers();

    const alreadyExists = existingUser.users.find(
      (u) => u.email === user.email,
    );

    if (alreadyExists) {
      console.log(`User ${user.email} already exists.`);
      // Optional: Update password if needed
      continue;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { role: user.role },
    });

    if (error) {
      console.error(`Failed to create user ${user.email}:`, error.message);
    } else {
      console.log(`Created user ${user.email} with ID ${data.user.id}`);
    }
  }
}

syncUsers();
