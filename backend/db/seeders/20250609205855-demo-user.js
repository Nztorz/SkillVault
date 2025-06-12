'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = { tableName: "Users"};
if(process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options.tableName, [
      {
        email: "demo@user.io",
        username: "DemoUser",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        email: "demo1@user.io",
        username: "DemoUser1",
        hashedPassword: bcrypt.hashSync("password1")
      },
      {
        email: "demo2@user.io",
        username: "DemoUser2",
        hashedPassword: bcrypt.hashSync("password2")
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ["DemoUser", "DemoUser1", "DemoUser2"] }
    }, {});
  }
};
