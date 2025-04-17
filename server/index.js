// server/index.js

import express from "express";

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

    const newProject = await Project.create({
      name,
      description,
      dueDate
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
    res.status(500).json({message: 'An error occurred while creating the user'});
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
    const data = await fetchMoonPhase(lat || '51.4768', lon || '-0.0004');
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch moon phase data' });
  }
});*/

