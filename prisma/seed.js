const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Create Superadmin first
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin@123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'SUPERADMIN'
        }
    });
    console.log('Superadmin created with ID:', admin.id);

    // Clear existing pets to avoid duplicates and ensure clean state
    await prisma.pet.deleteMany({});
    console.log('Existing pets deleted.');

    const pets = [
        {
            name: 'Buddy',
            breed: 'Golden Retriever',
            age: "3 years",
            size: 'Large',
            gender: 'Male',
            color: 'Golden',
            vaccinated: true,
            neutered: true,
            type: 'Dog',
            description: 'Friendly and energetic Golden Retriever looking for a loving home. Loves to play fetch and swim.',
            image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'AVAILABLE',
            ownerId: admin.id
        },
        {
            name: 'Luna',
            breed: 'Siamese Cat',
            age: "2 years",
            size: 'Small',
            gender: 'Female',
            color: 'Cream/Brown',
            vaccinated: true,
            neutered: true,
            type: 'Cat',
            description: 'Beautiful Siamese cat with blue eyes. Very vocal and affectionate.',
            image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'AVAILABLE',
            ownerId: admin.id
        },
        {
            name: 'Max',
            breed: 'German Shepherd',
            age: "4 years",
            size: 'Large',
            gender: 'Male',
            color: 'Black/Tan',
            vaccinated: true,
            neutered: false,
            type: 'Dog',
            description: 'Loyal and protective German Shepherd. Great with kids and other dogs.',
            image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'AVAILABLE',
            ownerId: admin.id
        },
        {
            name: 'Bella',
            breed: 'French Bulldog',
            age: "1 year",
            size: 'Small',
            gender: 'Female',
            color: 'Fawn',
            vaccinated: true,
            neutered: true,
            type: 'Dog',
            description: 'Adorable French Bulldog puppy. playful and full of energy.',
            image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'AVAILABLE',
            ownerId: admin.id
        },
        {
            name: 'Charlie',
            breed: 'Labrador Retriever',
            age: "5 years",
            size: 'Large',
            gender: 'Male',
            color: 'Chocolate',
            vaccinated: true,
            neutered: true,
            type: 'Dog',
            description: 'Gentle giant. Loves long walks and belly rubs.',
            image: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'AVAILABLE',
            ownerId: admin.id
        },
        {
            name: 'Lucy',
            breed: 'Persian Cat',
            age: "3 years",
            size: 'Medium',
            gender: 'Female',
            color: 'White',
            vaccinated: true,
            neutered: true,
            type: 'Cat',
            description: 'Fluffy Persian cat. Requires daily grooming but worth it for the cuddles.',
            image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'AVAILABLE',
            ownerId: admin.id
        }
    ]

    for (const pet of pets) {
        await prisma.pet.create({
            data: pet,
        })
    }

    // Seed Products
    await prisma.product.deleteMany({}); // Clear existing products
    const products = [
        {
            name: "Premium Dog Food",
            category: "Food",
            price: 49.99,
            description: "High-quality, grain-free dog food for all breeds. Rich in protein and essential nutrients.",
            imageUrl: "https://images.unsplash.com/photo-1589924691195-41432c84c161?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            inStock: true,
        },
        {
            name: "Cozy Cat Bed",
            category: "Bedding",
            price: 34.50,
            description: "Ultra-soft and comfortable bed for your feline friend. Machine washable cover.",
            imageUrl: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            inStock: true,
        },
        {
            name: "Interactive Dog Toy",
            category: "Toys",
            price: 15.99,
            description: "Durable toy perfect for chewers. Keeps your dog entertained for hours.",
            imageUrl: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            inStock: true,
        },
        {
            name: "Cat Scratching Post",
            category: "Furniture",
            price: 45.00,
            description: "Sturdy scratching post with sisal rope. Protects your furniture from scratches.",
            imageUrl: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            inStock: true,
        },
        {
            name: "Pet Grooming Kit",
            category: "Grooming",
            price: 29.99,
            description: "Complete set of grooming tools including brush, nail clipper, and shampoo.",
            imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            inStock: false,
        },
        {
            name: "Automatic Feeder",
            category: "Accessories",
            price: 89.99,
            description: "Programmable feeder to ensure your pet is fed on time, every time.",
            imageUrl: "https://images.unsplash.com/photo-1585846416120-3a7354ed7d65?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            inStock: true,
        }
    ];

    for (const product of products) {
        await prisma.product.create({ data: product });
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
