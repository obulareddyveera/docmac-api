const { prisma } = require("../prisma/client.js");

async function getPersonsBySelector(selector, value) {
  const query = {};
  query[selector] = value;
  const resp = await prisma.person.findMany({
    where: query,
  });
  console.log("---== getPersonsByEmail ", selector, value, resp);
  return resp;
}
async function registerClinic(payload) {
  console.log("--== registerClinic ", payload);
  const record = await prisma.person.create({
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

  const clinicDetails = await prisma.clinic.findMany({
    include: {
      group: true,
      Service: true,
    },
    where: {
      personId: record.id,
    },
  });
  const personDetails = await prisma.person.findMany({
    include: {
      Roles: true,
    },
    where: {
      id: record.id,
    },
  });
  return {
    clinic: clinicDetails,
    person: personDetails,
  };
}

module.exports = {
  getPersonsBySelector,
  registerClinic,
};
