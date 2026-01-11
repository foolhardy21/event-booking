'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("events", {
      id: {
        type: Sequelize.DataTypes.UUIDV4(),
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: Sequelize.DataTypes.ENUM("concert", "standup", "play", "movie", "exhibition"),
        allowNull: false,
      },
      event_date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      total_tickets: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      available_tickets: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      organizer_id: {
        type: Sequelize.DataTypes.UUIDV4,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
    })
    await queryInterface.addConstraint("events", {
      fields: ["organizer_id"],
      type: "foreign key",
      name: "fk_organizer_id",
      references: {
        table: "users",
        field: "id",
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("events")
  }
};
