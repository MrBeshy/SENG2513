import sequelize from '../config/database.js';
// make sure to import all table js files & create them pretty please
import User from './user.js';
import Project from './project.js';
import Task from './task.js';

const syncModels = async () => {
    try {
      await sequelize.sync({ alter: true }); // Use { force: true } to drop tables
      console.log('All models were synchronized successfully.');
    } catch (error) {
      console.error('Error synchronizing models:', error);
    }

    // Generate 10 projects
    const project = [];
    for (let i = 1; i <= 10; i++) {
        project.push({
            name: `Project ${i}`,
            description: `This is a description for project ${i}. It contains details about what this project entails.`,
            dueDate: new Date(Date.now() + (i * 7 * 24 * 60 * 60 * 1000)), // Due date i weeks from now
        });
    }

    // Insert projects into the table
    Project.bulkCreate(project)
        .then(() => {
            console.log('Projects inserted successfully.');
        })
        .catch((error) => {
            console.error('Error inserting projects:', error);
        });

    // Generate 10 users
    const users = [];
    for (let i = 1; i <= 10; i++) {
        users.push({
            username: `User ${i}`,
            email: `user${i}@example.com`,
            // Add other properties as needed
        });
    }

    // Insert users into the table
    User.bulkCreate(users)
        .then(() => {
            console.log('Users inserted successfully.');
        })
        .catch((error) => {
            console.error('Error inserting users:', error);
        });
        
  };

  export {
    sequelize, Project, syncModels
  };
  