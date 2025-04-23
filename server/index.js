// server/index.js

import express from "express";
import fetchMoonPhase from './api/json/moonPhase.js';
import company from "./api/json/company.json" with {type: "json"}; // Importing JSON data from a file
const app = express();
import cors from "cors"; // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const CORS = cors();
app.use(CORS);
app.use(express.json());
const PORT = 3001;

import User from './models/user.js';
// added project
import Project from "./models/project.js";
import Task from "./models/task.js";
import { syncModels } from "./models/index.js";

syncModels();

app.get("/api/company", (req, res) => {
  return res.json(company);
});

//added /api/project
app.get("/api/project", async (req, res) => {
    const project = await Project.findAll();
  return res.json(project);
});

app.post('/api/project', async (req, res) => {
  console.log('Api Code:  ',req.body);
  try {
    const { name, description, dueDate } = req.body;

    if (!name || !dueDate) {
      return res.status(400).json({ message: 'Name and due date are required'});
    }

    const dateOnly = dueDate.split('T')[0];
    const adjustedDate = new Date(`${dateOnly}T12:00:00Z`);

    const newProject = await Project.create({
      name,
      description,
      dueDate: adjustedDate
    });

    res.status(201).json({
      message: 'Project created successfully',
      project: newProject
    });

  } catch (error) {

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Validation error',
        errors:error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }

    console.error('Error creating project:', error);
    res.status(500).json({message: 'An error occurred while creating the project'});
  }
});

app.get("/api/project/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    return res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'An error occurred while fetching the project' });
  }
});

app.get("/api/project/:id/tasks", async (req, res) => {
  try {
    const projectId = req.params.id;
    const tasks = await Task.findAll({
      where: { projectId: projectId },
      order: [
        ['priority', 'DESC']  // This will sort by priority (high to low)
      ]
    });

    tasks.sort((a, b) => {
      const priorityOrder = {
        'high': 3,
        'medium': 2,
        'low': 1
      };
      
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    return res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'An error occurred while fetching tasks' });
  }
});

app.post('/api/project/:id/tasks', async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, description, priority, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = await Task.create({
      title,
      description,
      priority: priority || 'medium',
      status: status || 'to-do',
      projectId
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });

  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({message: 'An error occurred while creating the task'});
  }
});


app.get("/api/user", async (req, res) => {
  // Find all users
    const users = await User.findAll();
  return res.json(users);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// New endpoint to fetch moon phase data
/*
app.get("/api/moon-phase", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const data = await fetchMoonPhase();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch moon phase data' });
  }
});*/

app.patch("/api/project/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, dueDate } = req.body;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (name !== undefined && name.trim() === '') {
      return res.status(400).json({ message: 'Project name cannot be empty' });
    }
    
    if (dueDate !== undefined && !isValidDate(dueDate)) {
      return res.status(400).json({ message: 'Invalid due date' });
    }
    
    // Helper function
    function isValidDate(dateString) {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    }

    // Update fields (only if provided)
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (dueDate !== undefined) {
      const dateOnly = dueDate.split('T')[0];
      project.dueDate = new Date(`${dateOnly}T12:00:00Z`);
    }

    await project.save();

    return res.json(project);
    
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'An error occurred while updating the project' });
  }
});

app.delete('/api/project/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.destroy();

    return res.status(204).send();  // Send 204 No Content on success

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'An error occurred while deleting the project' });
  }
});

app.get("/api/project/:id/tasks/:taskId", async (req, res) => {
  try {
    const { id, taskId } = req.params;
    
    const task = await Task.findOne({
      where: { 
        taskId: taskId,
        projectId: id 
      }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    return res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'An error occurred while fetching the task' });
  }
});

// Also add these endpoints for updating and deleting tasks
app.patch("/api/project/:id/tasks/:taskId", async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const { title, description, priority, status } = req.body;

    const task = await Task.findOne({
      where: { 
        taskId: taskId,
        projectId: id 
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    await task.save();
    return res.json(task);
    
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'An error occurred while updating the task' });
  }
});

app.delete("/api/project/:id/tasks/:taskId", async (req, res) => {
  try {
    const { id, taskId } = req.params;
    
    const task = await Task.findOne({
      where: { 
        taskId: taskId,
        projectId: id 
      }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await task.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'An error occurred while deleting the task' });
  }
});