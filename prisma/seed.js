const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const pets = [
        {
            name: 'Buddy',
            breed: 'Golden Retriever',
            age: 3,
            size: 'Large',
            description: 'Friendly and energetic Golden Retriever looking for a loving home. Loves to play fetch and swim.',
            image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'Available'
        },
        {
            name: 'Luna',
            breed: 'Siamese Cat',
            age: 2,
            size: 'Small',
            description: 'Beautiful Siamese cat with blue eyes. Very vocal and affectionate.',
            image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'Available'
        },
        {
            name: 'Max',
            breed: 'German Shepherd',
            age: 4,
            size: 'Large',
            description: 'Loyal and protective German Shepherd. Great with kids and other dogs.',
            image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'Available'
        },
        {
            name: 'Bella',
            breed: 'French Bulldog',
            age: 1,
            size: 'Small',
            description: 'Adorable French Bulldog puppy. playful and full of energy.',
            image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'Available'
        },
        {
            name: 'Charlie',
            breed: 'Labrador Retriever',
            age: 5,
            size: 'Large',
            description: 'Gentle giant. Loves long walks and belly rubs.',
            image: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'Available'
        },
        {
            name: 'Lucy',
            breed: 'Persian Cat',
            age: 3,
            size: 'Medium',
            description: 'Fluffy Persian cat. Requires daily grooming but worth it for the cuddles.',
            image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'Available'
        }
    ]

    for (const pet of pets) {
        await prisma.pet.create({
            data: pet,
        })
    }

    console.log('Seed data inserted successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
