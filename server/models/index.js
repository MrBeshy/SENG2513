import sequelize from '../config/database.js';
// make sure to import all table js files & create them pretty please
import User from './user.js';
import Project from './project.js';
import Task from './task.js';

Project.hasMany(Task);
Task.belongsTo(Project);

const syncModels = async () => {
    try {
      await sequelize.sync({ alter: true }); // Use { force: true } to drop tables
      console.log('All models were synchronized successfully.');
    } catch (error) {
      console.error('Error synchronizing models:', error);
    }
    
    /*
    // Generate 10 projects
    const project = [];
    for (let i = 1; i <= 10; i++) {
        project.push({
            name: `Project ${i}`,
            description: `This is a description for project ${i}. It contains details about what this project entails.`,
            dueDate: new Date(Date.now() + (i * 7 * 24 * 60 * 60 * 1000)), // Due date i weeks from now
        });
    }*/

    /*
     // Insert projects into the table
     try {
        await Project.bulkCreate(project);
        console.log('Projects inserted successfully.');
        
        // Now create tasks for each project
        await createTasksForProjects();
    } catch (error) {
        console.error('Error inserting projects:', error);
    }

    // Insert projects into the table
    Project.bulkCreate(project)
        .then(() => {
            console.log('Projects inserted successfully.');
        })
        .catch((error) => {
            console.error('Error inserting projects:', error);
        });
    */

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

  /*
  async function createTasksForProjects() {
    try {
        // Get all projects
        const projects = await Project.findAll();
        
        // Create tasks for each project
        for (const project of projects) {
            const tasks = [];
            /*
            // Create 2 "to-do" tasks
            for (let i = 1; i <= 2; i++) {
                tasks.push({
                    title: `Todo Task ${i} for ${project.name}`,
                    description: `This is a task that needs to be done for ${project.name}`,
                    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                    status: 'to-do',
                    projectId: project.id
                });
            }
            
            // Create 2 "in-progress" tasks
            for (let i = 1; i <= 2; i++) {
                tasks.push({
                    title: `In Progress Task ${i} for ${project.name}`,
                    description: `This task is currently being worked on for ${project.name}`,
                    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                    status: 'in-progress',
                    projectId: project.id
                });
            }
            
            // Create 1 "completed" task
            tasks.push({
                title: `Completed Task for ${project.name}`,
                description: `This task has been completed for ${project.name}`,
                priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                status: 'completed',
                projectId: project.id
            });
            
            // Bulk create the tasks
            await Task.bulkCreate(tasks);
            console.log(`Created 5 tasks for project: ${project.name}`);
        }
        
        console.log('All tasks created successfully!');
    } catch (error) {
        console.error('Error creating tasks:', error);
    }
}*/

  export {
    sequelize, Project, Task, syncModels
  };
  