const { PrismaClient } = require('@prisma/client')
require('dotenv').config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "&application_name=$ docs_simplecrud_node-prisma",
    },
  },
})

module.exports = {
  prisma
}
