const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- Users ---
  const users = [
    {
      email: 'advisor@bafa.com',
      name: 'Funding Advisor',
      role: 'FUNDING_ADVISOR',
    },
    { email: 'consultant@bafa.com', name: 'Consultant', role: 'CONSULTANT' },
    { email: 'client@company.com', name: 'Client SME', role: 'CLIENT' },
  ];

  for (const user of users) {
    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log(`Upserted user: ${upsertedUser.email}`);

    // Create profile for client
    if (user.role === 'CLIENT') {
      const profile = await prisma.profile.upsert({
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
      console.log(`Upserted profile for user: ${upsertedUser.email}`);
    }
  }

  // --- Case Statuses ---
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
