const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    // ... you will write your Prisma Client queries here
    const allUsers = await prisma.user.findMany();
    console.log(allUsers);
}

export function GET() {
    // console.log(pregunta);
    // return Response.json({pregunta: pregunta});
    main()
        .then(async () => {
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
        return Response.json({pregunta: "pregunta"});
}