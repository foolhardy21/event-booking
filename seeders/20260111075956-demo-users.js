'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert("users", [
      {
        id: "9f2c1c8e-6d7a-4f4b-9f7e-1b7d5e6a2c91",
        first_name: "Vinay",
        email: "vinay.kumar@gmail.com",
        role: "customer"
      },
      {
        id: "c4a8f3d2-1e59-4b6a-9c21-8e7f4a0d6b35",
        first_name: "Smriti",
        last_name: "Kumar",
        email: "smriti@gmail.com",
        role: "organizer",
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      email: ["vinay.kumar@gmail.com", "smriti@gmail.com"],
    })
  }
};
