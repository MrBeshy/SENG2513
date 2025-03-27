import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const User = sequelize.define('project', {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  dueDate: DataTypes.DATE,
});

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password; // Don't expose password
  return values;
};

export default Project;
export{ Project };