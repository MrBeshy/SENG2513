// Projects.jsx

import "./Projects.css";
import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import AddProject from "./AddProject";
import { useEffect, useState } from "react";
import DeleteConfirmationPopup from "./DeleteConfirmationPopup";

const Projects = () => {

    const [project, setproject] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    useEffect(() => {

        fetch(`/api/project`)
        .then((res) => {
            console.log("Response status:", res.status);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            setproject(data); // Ensure data is an array
            setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }, []);

    

    // Function to open the delete confirmation popup
    const handleDelete = (id) => {
        setProjectToDelete(id);
        setIsPopupOpen(true); // Open the custom popup for confirmation
    };

    // Function to confirm the delete action
    const handleDeleteConfirm = () => {
        if (!projectToDelete) return;

        console.log(`Sending DELETE request for project with id: ${projectToDelete}`);

        fetch(`/api/project/${projectToDelete}`, {
            method: "DELETE",
        })
            .then((res) => {
                console.log("DELETE response status:", res.status);
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                // Update UI locally by filtering out the deleted project
                setproject((prevProjects) =>
                    prevProjects.filter((proj) => proj.id !== projectToDelete)
                );
                setIsPopupOpen(false); // Close the popup after confirming delete
            })
            .catch((error) => {
                console.error("Delete failed:", error);
            });
    };


    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        <>
            <div className="projects-page">
                <h2 className="page-title">Projects: </h2>

                <button id="add-project"><Link to="/AddProject" className="add-project">Add Project</Link></button>
                <Routes><Route path="/AddProject" element={<AddProject />}/></Routes>

                <div className="projects-container">
                    {Array.isArray(project) && project.length > 0 ? (
                        project.map((data) => (
                            <p className="project-instance" key={data.id}><Link to={`/project/${data.id}`} className="project-name">{data.name}</Link>
                            <div className="project-functions">
                                {/* <button className="edit-project"> <img src="edit-line.png" alt="edit"></img> </button> */}
                                <button className="delete-project" onClick={() => handleDelete(data.id)}> <img src="close-line.png" alt="delete"></img> </button></div>
                            </p>
                    ))) : (
                        <p>No projects found.</p>
                    )}
                </div>
            </div>

            <DeleteConfirmationPopup
                isOpen={isPopupOpen}
                onClose={handlePopupClose}
                onConfirm={handleDeleteConfirm}
                projectName={projectToDelete?.name}
            
            />



        </>
    );
}


  

export default Projects;
// project for now will be just an empty link