import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { CustomerRepository } from './repositories/customer-repository.js';
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function main() {
    console.log('Seeding database with roles and users...');
    // 1. Seed Roles
    const roles = [
        { name: 'Relationship Manager', code: 'RM' },
        { name: 'Branch Manager', code: 'BRANCH_MANAGER' },
        { name: 'Administrator', code: 'ADMIN' }
    ];
    const dbRoles = {};
    for (const r of roles) {
        dbRoles[r.code] = await prisma.role.upsert({
            where: { code: r.code },
            update: { name: r.name },
            create: r
        });
    }
    console.log(`Seeded ${Object.keys(dbRoles).length} security roles.`);
    // 2. Seed Users with hashed passwords
    const defaultPassword = 'password123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);
    const users = [
        { username: 'priya', name: 'Priya Das', roleCodes: ['RM'] },
        { username: 'anil', name: 'Anil Verma', roleCodes: ['RM'] },
        { username: 'sunita', name: 'Sunita Sharma', roleCodes: ['BRANCH_MANAGER'] },
        { username: 'admin', name: 'Bank Administrator', roleCodes: ['ADMIN'] }
    ];
    for (const u of users) {
        const existingUser = await prisma.user.findUnique({
            where: { username: u.username }
        });
        if (existingUser) {
            // Delete existing roles links to prevent conflict on re-runs
            await prisma.userRole.deleteMany({
                where: { userId: existingUser.id }
            });
            // Update user password and name
            await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    name: u.name,
                    passwordHash,
                    roles: {
                        create: u.roleCodes.map(code => ({
                            roleId: dbRoles[code].id
                        }))
                    }
                }
            });
            console.log(`Updated user: ${u.username}`);
        }
        else {
            await prisma.user.create({
                data: {
                    username: u.username,
                    name: u.name,
                    passwordHash,
                    roles: {
                        create: u.roleCodes.map(code => ({
                            roleId: dbRoles[code].id
                        }))
                    }
                }
            });
            console.log(`Created user: ${u.username}`);
        }
    }
    // 3. Seed Customers from customers_demo.json
    const customersPath = path.join(__dirname, '../../demo-data/customers_demo.json');
    if (fs.existsSync(customersPath)) {
        const rawData = fs.readFileSync(customersPath, 'utf-8');
        const demoCustomers = JSON.parse(rawData);
        console.log(`Ingesting ${demoCustomers.length} demo customers to PostgreSQL database...`);
        const customerRepo = new CustomerRepository();
        for (const c of demoCustomers) {
            // Re-map the RM username to DB user ID
            const targetRmUsername = c.rmId === 'rm_priya' ? 'priya' : 'anil';
            const dbUser = await prisma.user.findUnique({ where: { username: targetRmUsername } });
            const targetRmId = dbUser ? dbUser.id : c.rmId;
            await customerRepo.upsertImportRecord({
                id: c.id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                occupation: c.occupation,
                incomeRange: c.incomeRange,
                riskCategory: c.riskCategory,
                segment: c.segment,
                status: c.status,
                rmId: targetRmId,
                branchCode: c.branchCode,
                preferredContact: c.preferredContact,
                preferredLanguage: c.preferredLanguage,
                addresses: c.addresses,
                accounts: c.accounts,
                productHoldings: c.productHoldings,
                interactions: c.interactions
            });
        }
        console.log(`Ingested ${demoCustomers.length} customers successfully.`);
    }
    else {
        console.log('customers_demo.json not found, skipping customer ingestion.');
    }
    console.log('Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map