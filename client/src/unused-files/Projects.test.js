import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Projects from '../Projects';
import AddProject from '../AddProject'; // Import AddProject if necessary
import { MemoryRouter, Route, Routes } from 'react-router-dom'; // Import Route and Routes
import userEvent from '@testing-library/user-event';

// Mock fetch
beforeEach(() => {
  const mockProjects = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Project ${i + 1}`,
  }));

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProjects), // Simulate returning 10 default projects
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

// Test for Projects title
test('renders the Projects title', async () => {
  render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>
  );

  const titleElement = await screen.findByText(/Projects:/i);
  expect(titleElement).toBeInTheDocument();
});

// Test for Add Project button
test('renders the Add Project button', async () => {
  render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>
  );

  const addButton = await screen.findByRole('button', { name: /add project/i });
  expect(addButton).toBeInTheDocument();
});

// Test for rendering 10 default projects
test('renders 10 default projects on load', async () => {
  render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>
  );

  // Check if all 10 projects are rendered
  for (let i = 0; i < 10; i++) {
    expect(await screen.findByText(`Project ${i + 1}`)).toBeInTheDocument();
  }
});

// Test for opening the modal when the Add Project button is clicked
test('opens the modal, submits form, and displays new project on home screen', async () => {
    const mockProjects = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Project ${i + 1}`,
    }));
  
    let currentProjects = [...mockProjects];
  
    global.fetch = jest.fn((url, options) => {
      if (!options || options.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(currentProjects),
        });
      }
  
      if (options.method === 'POST') {
        const newProject = {
          id: currentProjects.length + 1,
          ...JSON.parse(options.body),
        };
        currentProjects.push(newProject);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(newProject),
        });
      }
    });
  
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/AddProject" element={<AddProject />} />
        </Routes>
      </MemoryRouter>
    );
  
    const addButton = await screen.findByRole('link', { name: /add project/i });
    userEvent.click(addButton);
  
    await screen.findByText(/Add Project/i);
  
    userEvent.type(screen.getByPlaceholderText(/project name/i), 'My New Project');
    userEvent.type(screen.getByPlaceholderText(/project description/i), 'A test description');
    userEvent.type(screen.getByPlaceholderText(/mm\/dd\/yyyy/i), '2025-05-01');
  
    userEvent.click(screen.getByRole('button', { name: /save/i }));
  
    await waitFor(() => {
        expect(screen.getByText(/Project created successfully/i)).toBeInTheDocument();
      });
      
      // Manually re-render the Projects component to simulate a redirect
      render(
        <MemoryRouter>
          <Projects />
        </MemoryRouter>
      );
      
      // Now look for the new project
      const newProject = await screen.findByText(/My New Project/i);
      expect(newProject).toBeInTheDocument();
  });

// Test for deleting a project
test('deletes a project when delete button is clicked', async () => {
  // Setup mock data
  const mockProjects = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    name: `Project ${i + 1}`,
  }));

  let currentProjects = [...mockProjects];

  // Mock fetch for both GET and DELETE requests
  global.fetch = jest.fn((url, options) => {
    // GET request to fetch projects
    if (!options || options.method === 'GET') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(currentProjects),
      });
    }
    
    // DELETE request
    if (options && options.method === 'DELETE') {
      const projectId = Number(url.split('/').pop());
      currentProjects = currentProjects.filter(project => project.id !== projectId);
      return Promise.resolve({
        ok: true,
        status: 204,
        json: () => Promise.resolve({}),
      });
    }
  });

  // Render the component
  render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>
  );

  // Wait for projects to load
  await waitFor(() => {
    expect(screen.getByText('Project 1')).toBeInTheDocument();
  });
  
  // Find all delete buttons (close-line.png images)
  const deleteButtons = screen.getAllByAltText('delete');
  
  // Click the delete button for the first project
  userEvent.click(deleteButtons[0]);
  
  // Confirm the delete popup appears
  const confirmButton = await screen.findByRole('button', { name: /yes, delete/i });
  expect(confirmButton).toBeInTheDocument();
  
  // Click the confirm delete button
  userEvent.click(confirmButton);
  
  // Verify the project is no longer in the list
  await waitFor(() => {
    expect(screen.queryByText('Project 1')).not.toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
    expect(screen.getByText('Project 3')).toBeInTheDocument();
  });
  
  // Verify the DELETE request was called with the correct URL
  expect(global.fetch).toHaveBeenCalledWith('/api/project/1', expect.objectContaining({
    method: 'DELETE'
  }));
});