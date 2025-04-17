// server/index.js
import express from "express";
import fetchMoonPhase from './api/moon-api.js';
import company from "./api/json/company.json" with {type: "json"}; // Importing JSON data from a file
const app = express();
import cors from "cors"; // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const CORS = cors();
app.use(CORS);
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

app.get("/api/user", async (req, res) => {
  // Find all users
    const users = await User.findAll();
  return res.json(users);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// New endpoint to fetch moon phase data
app.get("/api/moon-phase", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const data = await fetchMoonPhase(lat || '51.4768', lon || '-0.0004');
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch moon phase data' });
  }
});

