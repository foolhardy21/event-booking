'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert("events", [
      {
        id: "e7b2a6d4-3c9f-4e1a-8f5b-2d9c6a4e1b78",
        name: "Biswa Genius",
        description: "A standup comedy show by Indian comic Biswa Kalyan Rath.",
        category: "standup",
        event_date: new Date("2026-02-10"),
        total_tickets: 150,
        available_tickets: 150,
        organizer_id: "9f2c1c8e-6d7a-4f4b-9f7e-1b7d5e6a2c91",
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("events", {
      name: ["Biswa Genius"],
    })
  }
};
