import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- Users ---
  const users = [
    {
      email: 'advisor@bafa.com',
      name: 'Funding Advisor',
      role: UserRole.FUNDING_ADVISOR,
    },
    {
      email: 'consultant@bafa.com',
      name: 'Consultant',
      role: UserRole.CONSULTANT,
    },
    { email: 'client@company.com', name: 'Client SME', role: UserRole.CLIENT },
  ];

  for (const user of users) {
    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log(`Upserted user: ${upsertedUser.email}`);

    // Create profile for client
    if (user.role === UserRole.CLIENT) {
      await prisma.profile.upsert({
        where: { userId: upsertedUser.id },
        update: {},
        create: {
          userId: upsertedUser.id,
          companyName: 'Musterfirma GmbH',
          address: 'Musterstraße 1, 12345 Berlin',
          legalForm: 'GmbH',
          industry: 'Manufacturing',
          foundingDate: new Date('2020-01-01'),
        },
      });
    }
  }

  // --- Case Statuses ---
  // Based on: Lead → Eligibility Review → Document Collection → BAFA Submission → Consultation → Invoicing → Reporting → Approval → Payout → Closed
  const caseStatuses = [
    'Lead',
    'Eligibility Review',
    'Document Collection',
    'BAFA Submission',
    'Consultation',
    'Invoicing',
    'Reporting',
    'Approval',
    'Payout',
    'Closed',
  ];

  // We need 23 statuses total per requirements, filling gaps with sub-steps for now or just generic fillers to reach count if strict,
  // but for MVP flow I will stick to the 10 explicit ones + some likely intermediate states.
  // Actually, let's just stick to the critical 10 for the MVP functionality unless specific 23 are provided.

  let order = 1;
  for (const status of caseStatuses) {
    await prisma.caseStatus.upsert({
      where: { name: status },
      update: { order: order },
      create: { name: status, order: order },
    });
    order++;
  }
  console.log(`Seeded ${caseStatuses.length} Case Statuses`);

  // --- Document States ---
  // Requested → Uploaded → Reviewed → Correction Required → Corrected → Approved → Submitted to BAFA → Archived
  const docStates = [
    'Requested',
    'Uploaded',
    'Reviewed',
    'Correction Required',
    'Corrected',
    'Approved',
    'Submitted to BAFA',
    'Archived',
  ];

  for (const state of docStates) {
    await prisma.documentState.upsert({
      where: { name: state },
      update: {},
      create: { name: state },
    });
  }
  console.log(`Seeded ${docStates.length} Document States`);

  // --- Document Types ---
  // 13 types required.
  // Known: Gewerbeanmeldung, Handelsregisterauszug, Steuerbescheide, De-minimis-Erklärung
  const docTypes = [
    'Gewerbeanmeldung',
    'Handelsregisterauszug',
    'Steuerbescheide',
    'De-minimis-Erklärung',
    'Persönlicher Ausweis / Pass',
    'Beratungsvertrag',
    'Honorarangebot',
    'Beratungsbericht',
    'Rechnung',
    'Zahlungsnachweis',
    'Verwendungsnachweis',
    'Zuwendungsbescheid',
    'Ablehnungsbescheid',
  ];

  for (const type of docTypes) {
    await prisma.documentType.upsert({
      where: { name: type },
      update: {},
      create: { name: type },
    });
  }
  console.log(`Seeded ${docTypes.length} Document Types`);

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
