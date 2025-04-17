//import "./ProjectInstance.css";
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const ProjectInstance = () => {
    const { id } = useParams(); // Get the project ID from the URL
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the specific project by ID
        fetch(`/api/project/${id}`)
        .then((res) => {
            console.log("Response status:", res.status);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            setProject(data);
            setLoading(false);
        })
        .catch((error) => {
            setError(error.message);
            setLoading(false);
        });
    }, [id]); // Re-run when ID changes

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>Project not found</div>;

    return(
        <>
            <div className="project-details">
                <h2>Project: {project.name}</h2>
                <div className="project-info">
                    <p><strong>Description:</strong> {project.description}</p>
                    <p><strong>Due Date:</strong> {new Date(project.dueDate).toLocaleDateString()}</p>
                </div>
                
                <h3>Tasks:</h3>
                {/* You can add tasks display here once you implement that feature */}
                <div className="tasks-container">
                    <p>No tasks found for this project.</p>
                </div>
                
                <Link to="/" className="back-link">Back to Projects</Link>
            </div>
        </>
    );
}

export default ProjectInstance;