'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("event_attendees", {
      id: {
        type: Sequelize.DataTypes.UUIDV4(),
        primaryKey: true,
      },
      customer_id: {
        type: Sequelize.DataTypes.UUIDV4(),
        allowNull: false,
      },
      event_id: {
        type: Sequelize.DataTypes.UUIDV4(),
        allowNull: false,
      },
      tickets_booked: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.addConstraint("event_attendees", {
      type: "foreign key",
      fields: ["customer_id"],
      name: "fk_customer_id",
      references: {
        table: "users",
        field: "id",
      }
    })
    await queryInterface.addConstraint("event_attendees", {
      type: "foreign key",
      fields: ["event_id"],
      name: "fk_event_id",
      references: {
        table: "events",
        field: "id",
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("event_attendees");
  }
};
