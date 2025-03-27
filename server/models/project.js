import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const User = sequelize.define('project', {
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  birthday: DataTypes.DATE,
});

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password; // Don't expose password
  return values;
};

export default Project;
export{ Project };