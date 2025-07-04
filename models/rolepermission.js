'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RolePermission.init({
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles', // Refers to the Role model
        key: 'id'
      }
    },
    permissionId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'permissions', // Refers to the Permission model
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'RolePermission',
  });
  return RolePermission;
};