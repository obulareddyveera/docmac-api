const { prisma } = require("../prisma/client.js");

module.exports = {
  getPersonByEmailPwd: (email, password) => {
    console.log('/login ', email, password)
    return prisma.person.findFirstOrThrow({
      include: {
        Roles: true,
      },
      where: {
        email: email,
        password: password,
      },
    });
  },
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
        password: payload.primaryContactPassword,
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
              create: payload.clinicServices,
            },
          },
        },
        Roles: {
          create: payload.personRoles,
        },
      },
    });
  },
  checkRefreshToken: (email, token) => {
    try {
      const decoded = jwt.verify(token, process.env.refreshSecret);
      return decoded.email === email;
    } catch (error) {
      return false;
    }
  },
  isAuthenticated: (req, res, next) => {
    try {
      let token = req.get("authorization");
      if (!token) {
        return res.status(404).json({
          success: false,
          msg: "Token not found",
        });
      }
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.accessSecret);
      req.email = decoded.email;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, msg: error.message });
    }
  },
};
