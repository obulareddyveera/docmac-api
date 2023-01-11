const { prisma } = require("../prisma/client.js");

module.exports = {
  getPersonByEmailPwd: (email, password) => {
    return prisma.person.findFirst({
      include: {
        Privs: true,
      },
      where: {
        email: email,
        password: password,
      },
    });
  },
  getPersonByMobilePwd: (mobileNumber, password) => {
    return prisma.person.findFirst({
      include: {
        Privs: true,
      },
      where: {
        mobile: mobileNumber,
        password: password,
      },
    });
  },
  getClinicById: (id) => {
    return prisma.clinic.findMany({
      include: {
        group: true,
        Service: true,
      },
      where: {
        id: id,
      },
    });
  },
  getPersonById: (id) => {
    return prisma.person.findMany({
      include: {
        Privs: true,
        clinic: true,
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
    return prisma.clinic.create({
      data: {
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
          create: payload.clinicServices,
        },
        Person: {
          create: {
            email: payload.primaryContactEmail,
            name: payload.primaryContactName,
            mobile: payload.primaryContactMobile,
            password: payload.primaryContactPassword,
            Privs: {
              create: payload.personRoles,
            },
          }
        }
      },
    });
    // return prisma.person.create({
    //   data: {
    //     email: payload.primaryContactEmail,
    //     name: payload.primaryContactName,
    //     mobile: payload.primaryContactMobile,
    //     password: payload.primaryContactPassword,
    //     clinic: {
    //       create: {
    //         name: payload.clinicName,
    //         address: payload.clinicAddress,
    //         mobile: payload.primaryContactMobile,
    //         group: {
    //           create: {
    //             name: payload.clinicName,
    //             email: payload.primaryContactEmail,
    //             mobile: payload.primaryContactMobile,
    //           },
    //         },
    //         Service: {
    //           create: payload.clinicServices,
    //         },
    //       },
    //     },
    //     Privs: {
    //       create: payload.personRoles,
    //     },
    //   },
    // });
  },
  checkRefreshToken: (email, token) => {
    try {
      const decoded = jwt.verify(token, process.env.refreshSecret);
      return decoded.email === email;
    } catch (error) {
      return false;
    }
  },
};
