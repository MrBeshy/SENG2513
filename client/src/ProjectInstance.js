//import "./ProjectInstance.css";
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const ProjectInstance = () => {
    const { id } = useParams(); // Get the project ID from the URL
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedDueDate, setEditedDueDate] = useState("");

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
            console.log("Fetched project data:", data);
            setProject(data);
            setEditedName(data.name);
            setEditedDescription(data.description);
            setEditedDueDate(data.dueDate);
            setLoading(false);
        })
        .catch((error) => {
            setError(error.message);
            setLoading(false);
        });
    }, [id]); // Re-run when ID changes

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        // Reset edited fields back to original values
        setEditedName(project.name);
        setEditedDescription(project.description);
        setEditedDueDate(project.dueDate);
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        const updatedProject = {
            name: editedName,
            description: editedDescription,
            dueDate: editedDueDate

        };

        fetch(`/api/project/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedProject)
        })
            .then((res) => {
                if (!res.ok) {
                    res.text().then((text) => console.error('Error Response:', text));
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setProject(data);
                setIsEditing(false);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>Project not found</div>;

    return(
        <>
            <div className="project-details">
                <h2>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                        />
                    ) : (
                        `Project: ${project.name}`
                    )}
                </h2>

                <div className="project-info">
                    <p>
                        <strong>Description:</strong>{" "}
                        {isEditing ? (
                            <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                    ) : (
                        project.description
                    )}    
                    </p>
                    <p>
                        <strong>Due Date:</strong>{" "}
                        {isEditing ? (
                            <input
                                type="date"
                                value={editedDueDate.slice(0,10)}
                                onChange={(e) => setEditedDueDate(e.target.value)}
                            />
                        ) : (
                            new Date(project.dueDate).toLocaleDateString()
                        )}
                    </p>
                </div>

                {isEditing ? (
                    <div>
                        <button onClick={handleSaveClick}>Save</button>
                        <button onClick={handleCancelClick}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <button onClick={handleEditClick}>Edit</button>
                    </div>
                )}
                
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