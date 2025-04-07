import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const Project = sequelize.define('project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  dueDate: DataTypes.DATE,
});

Project.prototype.toJSON = function() {
  const values = { ...this.get() };
  return values;
};

export default Project;
export{ Project };