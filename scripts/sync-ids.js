const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function syncIds() {
  console.log('Syncing Supabase Auth IDs to Prisma User table...');

  try {
    const {
      data: { users: authUsers },
      error,
    } = await supabase.auth.admin.listUsers();

    if (error) throw error;

    for (const authUser of authUsers) {
      console.log(`Checking user: ${authUser.email} (${authUser.id})`);

      const dbUser = await prisma.user.findUnique({
        where: { email: authUser.email },
      });

      if (dbUser) {
        if (dbUser.id === authUser.id) {
          console.log(`  IDs already match for ${authUser.email}`);
        } else {
          console.log(
            `  ID mismatch for ${authUser.email}. DB: ${dbUser.id}, Auth: ${authUser.id}. Correcting...`,
          );

          // To change the ID (primary key), we must delete and recreate
          // In a real prod app this is dangerous due to cascades, but here it's necessary for the seed to work.
          // Alternatively, we can just update all related records first.

          await prisma.$transaction([
            // Delete potential existing record with the NEW ID just in case
            prisma.user.deleteMany({ where: { id: authUser.id } }),

            // Create user with the correct ID
            prisma.user.upsert({
              where: { email: authUser.email },
              update: { id: authUser.id }, // This might not work in some Prisma versions for PK
              create: {
                id: authUser.id,
                email: authUser.email,
                name: dbUser.name,
                role: dbUser.role,
              },
            }),
          ]);

          console.log(`  Updated ${authUser.email} to ID ${authUser.id}`);
        }
      } else {
        console.log(`  User ${authUser.email} not in DB. Creating...`);
        await prisma.user.create({
          data: {
            id: authUser.id,
            email: authUser.email,
            role: authUser.user_metadata?.role || 'CLIENT',
            name: authUser.email.split('@')[0],
          },
        });
      }
    }

    console.log('Sync complete.');
  } catch (err) {
    console.error('Sync failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

syncIds();
