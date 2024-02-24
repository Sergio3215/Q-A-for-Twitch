const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export default async function handler(req, res) {

    console.log(req)
    await prisma.user.create({
        data: {
            name: 'Rich',
            point:1,
            date: new Date.now()
        },
    })

    const allUsers = await prisma.user.findMany({
        include: {
            posts: true,
        },
    })
    console.dir(allUsers, { depth: null })
}