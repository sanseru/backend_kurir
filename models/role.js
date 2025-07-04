'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Role dapat memiliki banyak Permission melalui RolePermission
      Role.belongsToMany(models.Permission, {
        through: 'RolePermission',
        foreignKey: 'roleId',
        otherKey: 'permissionId',
      });

      // Role dapat dimiliki oleh banyak User melalui UserRole
      Role.belongsToMany(models.User, {
        through: 'UserRole',
        foreignKey: 'roleId',
        otherKey: 'userId'
      });
    }
  }
  Role.init({
    name: DataTypes.STRING,
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Role',
    timestamps: true,
  });

  // Define associations
  Role.associate = (models) => {
    Role.belongsToMany(models.Permission, {
      through: 'RolePermission', // Specify the join table
      foreignKey: 'roleId', // Foreign key in the join table
      otherKey: 'permissionId', // Other key in the join table
    });
  };


  return Role;
};