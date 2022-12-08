const { prisma } = require("../prisma/client.js");

module.exports = {
  getClinicByPersonId: (id) => {
    return prisma.clinic.findMany({
      include: {
        group: true,
        Service: true,
      },
      where: {
        personId: id,
      },
    });
  },
  getPersonById: (id) => {
    return prisma.person.findMany({
      include: {
        Roles: true,
      },
      where: {
        id: id,
      },
    });
  },
  getPersonsBySelector: (selector, value) => {
    const query = {};
    query[selector] = value[selector];
    return prisma.person.findMany({
      where: query,
    });
  },
  registerClinic: (payload) => {
    return prisma.person.create({
      data: {
        email: payload.primaryContactEmail,
        name: payload.primaryContactName,
        mobile: payload.primaryContactMobile,
        clinic: {
          create: {
            name: payload.clinicName,
            address: payload.clinicAddress,
            mobile: payload.primaryContactMobile,
            group: {
              create: {
                name: payload.clinicName,
                email: payload.primaryContactEmail,
                mobile: payload.primaryContactMobile,
              },
            },
            Service: {
              create: payload.linicServices,
            },
          },
        },
        Roles: {
          create: payload.personRoles,
        },
      },
    });
  },
};
