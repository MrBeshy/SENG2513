import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const Project = sequelize.define('project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Required
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Make it optional
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Project.prototype.toJSON = function() {
  const values = { ...this.get() };
  return values;
};

export default Project;
export{ Project };