const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export const revalidate = 0;

export async function POST(req) {
  const data = await req.json();
  // console.log(data);

  const { name, point, date } = data;

  let allUsers = await prisma.user.findMany();

  let nameFilter = allUsers.filter(user => user.name === name);

  // console.log(nameFilter[0]);

  try {

    const week = checkWeekDay(nameFilter[0].date);
    // console.log(week);

    if (week) {
      await prisma.user.update({
        where: {
          id: nameFilter[0].id
        },
        data: {
          name: name,
          point: point,
          date: date
        },
      });

      return Response.json({ success: true, week: week });
    }
  } catch (error) {

  }

  allUsers = await prisma.user.findMany();
  nameFilter = allUsers.filter(user => user.name === name);

  if (nameFilter.length > 0) {
    await prisma.user.update({
      where: {
        id: nameFilter[0].id
      },
      data: {
        name: name,
        point: point + nameFilter[0].point,
        date: date
      },
    })
  }
  else {
    await prisma.user.create({
      data: {
        name: name,
        point: point,
        date: date
      },
    })
  }

  return Response.json({ success: true });
}

const checkWeekDay = (date) => {
  const dt = new Date();
  const dtAgo = date.split("T")[0];
  // console.log(dtAgo);

  return new Date(dtAgo)
    .setDate(new Date(dtAgo).getDate() + 7) <= dt
}

