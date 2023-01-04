'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shopify_order_id: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      shopify_product_id: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      shopify_product_title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      shopify_variant_id: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      shopify_variant_title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      shopify_variant_sku: {
        type:Sequelize.STRING,
        allowNull: true
      },
      shopify_quantity: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};