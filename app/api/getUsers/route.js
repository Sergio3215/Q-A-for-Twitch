const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    // ... you will write your Prisma Client queries here
    const allUsers = await prisma.user.findMany();
    return allUsers;
}

export async function GET(Request) {
    let users = [];
    await main()
        .then(async (data) => {
            users = data;
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
        return Response.json({users: users});
}