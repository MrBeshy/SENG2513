import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const Task = sequelize.define('task', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  priority: DataTypes.ENUM('low','medium','high'),
  status: DataTypes.ENUM('to-do', 'in-progress', 'completed')
});

Task.prototype.toJSON = function() {
  const values = { ...this.get() };
  return values;
};

export default Task;
export{ Task };