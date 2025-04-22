import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const priorityValues = {
  'high': 3,
  'medium': 2,
  'low': 1
};

const Task = sequelize.define('task', {
  taskId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('to-do', 'in-progress', 'completed'),
    defaultValue: 'to-do'
  },
  priorityOrder: {
    type: DataTypes.VIRTUAL,
    get() {
      return priorityValues[this.priority] || 0;
    }
  }
});

Task.prototype.toJSON = function() {
  const values = { ...this.get() };
  return values;
};

export default Task;
export{ Task };