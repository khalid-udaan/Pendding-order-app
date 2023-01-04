'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    shopify_order_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    shopify_product_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    shopify_product_title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shopify_variant_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    shopify_variant_title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shopify_variant_sku: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shopify_quantity: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};