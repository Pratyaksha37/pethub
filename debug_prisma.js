const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const pets = await prisma.pet.findMany({
            include: { owner: { select: { name: true, email: true } } }
        });
        console.log('Successfully fetched pets:', pets.length);
    } catch (e) {
        console.error('Error fetching pets:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
