//import "./TaskInstance.css";
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const TaskInstance = () => {
    const { id, taskId } = useParams(); // Get both project ID and task ID from URL
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form state for editing
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedPriority, setEditedPriority] = useState("");
    const [editedStatus, setEditedStatus] = useState("");

    useEffect(() => {
        const fetchTaskAndProject = async () => {
            try {
                console.log(`Fetching project with ID: ${id} and task with ID: ${taskId}`);
                
                // Fetch project first
                const projectRes = await fetch(`/api/project/${id}`);
                if(!projectRes.ok) {
                    throw new Error(`HTTP error! Status: ${projectRes.status}`);
                }
                const projectData = await projectRes.json();
                setProject(projectData);
                
                // Fetch specific task
                const taskRes = await fetch(`/api/project/${id}/tasks/${taskId}`);
                if(!taskRes.ok) {
                    throw new Error(`HTTP error! Status: ${taskRes.status}`);
                }
                const taskData = await taskRes.json();
                setTask(taskData);
                
                // Set form data for editing
                setEditedTitle(taskData.title);
                setEditedDescription(taskData.description || "");
                setEditedPriority(taskData.priority);
                setEditedStatus(taskData.status);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTaskAndProject();
    }, [id, taskId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        // Reset form fields
        setEditedTitle(task.title);
        setEditedDescription(task.description || "");
        setEditedPriority(task.priority);
        setEditedStatus(task.status);
        setIsEditing(false);
    };

    const handleSaveClick = async () => {
        try {
            const updatedTask = {
                title: editedTitle,
                description: editedDescription,
                priority: editedPriority,
                status: editedStatus
            };

            const response = await fetch(`/api/project/${id}/tasks/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedTask)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setTask(data);
            setIsEditing(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteClick = async () => {
        if (window.confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
            try {
                const response = await fetch(`/api/project/${id}/tasks/${taskId}`, {
                    method: "DELETE"
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Navigate back to project after successful deletion
                navigate(`/project/${id}`);
            } catch (error) {
                setError(error.message);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!task || !project) return <div>Task or Project not found</div>;

    return (
        <div className="task-details">
            <h2>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        required
                    />
                ) : (
                    `Task: ${task.title}`
                )}
            </h2>

            <p><strong>Project:</strong> {project.name}</p>

            <div className="task-info">
                <p>
                    <strong>Description:</strong>{" "}
                    {isEditing ? (
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                    ) : (
                        task.description || "No description provided"
                    )}
                </p>
                <p>
                    <strong>Priority:</strong>{" "}
                    {isEditing ? (
                        <select
                            value={editedPriority}
                            onChange={(e) => setEditedPriority(e.target.value)}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    ) : (
                        <span className={`priority priority-${task.priority}`}>
                            {task.priority}
                        </span>
                    )}
                </p>
                <p>
                    <strong>Status:</strong>{" "}
                    {isEditing ? (
                        <select
                            value={editedStatus}
                            onChange={(e) => setEditedStatus(e.target.value)}
                        >
                            <option value="to-do">To-do</option>
                            <option value="in-progress">In-progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    ) : (
                        task.status
                    )}
                </p>
            </div>

            {isEditing ? (
                <div className="edit-buttons">
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                </div>
            ) : (
                <div className="action-buttons">
                    <button onClick={handleEditClick}>Edit</button>
                    <button onClick={handleDeleteClick} className="delete-button">Delete</button>
                </div>
            )}

            <button>
                <Link to={`/project/${id}`} className="back-link">Back to Project</Link>
            </button>
        </div>
    );
};

export default TaskInstance;