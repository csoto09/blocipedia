'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {msg: "An account with that email already exists. Please use another email address."},
      validate: {
        isEmail: { msg: 'must be a valid email' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "0"
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Wiki, {
      foreignKey: 'userId',
      as: 'wikis'
    })
    User.hasMany(models.Collaborator, {
      foreignKey: 'userId',
      as: 'collaborators'
    })
  };

  User.prototype.isCollaborator = function(userId) { 
    return this.collaborators.find((collaborator) => { return collaborator.userId == userId})
  }
  User.prototype.isPremium = function() {
    return this.role === 1
  }
  User.prototype.isAdmin = function() {
    return this.role === 2
  }
  return User;
};