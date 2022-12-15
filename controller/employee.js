const { prisma } = require("../prisma/client.js");

module.exports = {
  getAllEmployee: () => {
    return prisma.person.findMany({
      include: {
        Privs: true,
        ProfileSnap: true,
        PaymentDetails: true,
      },
    });
  },
  getEmployeeById: (personId) => {
    return prisma.person.findUnique({
      include: {
        Privs: true,
        ProfileSnap: true,
        PaymentDetails: true,
      },
      where: {
        id: parseInt(personId),
      },
    });
  },
  applyRules: async (payload) => {
    const conditions = [];
    payload.forEach((entity) => {
      const opt = {};
      opt[entity.columnName] = entity.value;
      conditions.push(opt);
    });

    return await prisma.Person.findMany({
      where: {
        OR: conditions,
      },
      select: {
        email: true,
        mobile: true,
      },
    });
  },
  createEmployee: (payload) => {
    console.log("/login ", payload);
    return prisma.person.create({
      data: {
        email: payload.email,
        name: payload.name,
        mobile: payload.mobile,
        password: payload.password,
        type: payload.type,
        isActive: payload.isActive,
        Privs: {
          create: payload.Privs,
        },
        PaymentDetails: {
          create: payload.PaymentDetails,
        },
        ProfileSnap: {
          create: payload.ProfileSnap,
        },
      },
    });
  },
  updateEmployee: async (personId, payload) => {
    console.log("Controller ::: updateEmployee ", payload);
    return await prisma.person.update({
      data: {
        email: payload.email,
        name: payload.name,
        mobile: payload.mobile,
        Privs: {
          deleteMany: [{ personId: parseInt(personId) }],
          create: payload.Privs,
        },
        ProfileSnap: {
          deleteMany: [{ personId: parseInt(personId) }],
          create: payload.ProfileSnap,
        },
        PaymentDetails: {
          deleteMany: [{ personId: parseInt(personId) }],
          create: payload.PaymentDetails,
        },
      },
      where: {
        id: parseInt(personId),
      },
    });
  },
  deleteEmployee: async (personId) => {
    return await prisma.person.update({
      data: {
        isActive: false,
      },
      where: {
        id: parseInt(personId),
      },
    });
  },
};
