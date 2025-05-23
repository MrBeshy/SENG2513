import "./ProjectInstance.css";
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DeleteTask from "./DeleteTask"; // adjust path if needed




const ProjectInstance = () => {
    const { id } = useParams(); // Get the project ID from the URL
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [tasks, setTasks] = useState([]);
    const [editedDescription, setEditedDescription] = useState("");
    const [editedDueDate, setEditedDueDate] = useState("");

    const [isNameValid, setIsNameValid] = useState(true);
    const [isDateValid, setIsDateValid] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
const [taskToDelete, setTaskToDelete] = useState(null);


    useEffect(() => {
        // Fetch the specific project by ID
        const fetchProjectAndTask = async () => {
            try {

                // Fetch project
                const projectRes = await fetch(`/api/project/${id}`);
                if(!projectRes.ok) {
                    throw new Error(`HTTP error! Status: ${projectRes.status}`);
                }
                const projectData = await projectRes.json();
                setProject(projectData);
                setEditedName(projectData.name);
                setEditedDescription(projectData.description);
                setEditedDueDate(projectData.dueDate);
                setLoading(false);

                // Fetch task for specific project
                 const tasksRes = await fetch(`/api/project/${id}/tasks`);
                 if(!tasksRes.ok) {
                    throw new Error(`HTTP error fetching tasks! Status: ${tasksRes.status}`);
                 }
                 const tasksData = await tasksRes.json();
                 setTasks(tasksData);

                 setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProjectAndTask();
    },[id]); // Re-runs when the ID changes

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
        // make sure that date and name are valid
        if (editedName.trim() === '') {
            setIsNameValid(false);
            return;
        }
        
        if (!editedDueDate) {
            setIsDateValid(false);
            return;
        }
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

    // Add this function to your component, right after handleSaveClick or with the other handler functions
    const handleDeleteTask = (taskId) => {
        setTaskToDelete(taskId);
        setShowDeleteModal(true);
      };
      
      const confirmDeleteTask = () => {
        fetch(`/api/project/${id}/tasks/${taskToDelete}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
            }
            setTasks(tasks.filter(task => task.taskId !== taskToDelete));
            setShowDeleteModal(false);
            setTaskToDelete(null);
          })
          .catch((error) => {
            setError(`Failed to delete task: ${error.message}`);
            setShowDeleteModal(false);
          });
      };
      

    const sortByPriority = (tasks) => {
        const priorityOrder = {
          'high': 3,
          'medium': 2,
          'low': 1
        };
        
        return [...tasks].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      };
      
      

    const todoTasks = sortByPriority(tasks.filter(task => task.status === 'to-do'));
    const inProgressTasks = sortByPriority(tasks.filter(task => task.status === 'in-progress'));
    const completedTasks = sortByPriority(tasks.filter(task => task.status === 'completed'));

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>Project not found</div>;

    const renderTask = (task) => (
        <div className="task-item" key={task.id}>
            <h4><Link to={`/project/${id}/${task.taskId}`} className="task-title">{task.title}</Link></h4>
            {/* <p>{task.description}</p> */}
            <span className={`priority priority-${task.priority}`}>
                {task.priority}
            </span>
            <button 
                className="delete-task"
                onClick={(e) => {
                    e.preventDefault(); // Prevent navigation if button is inside a link
                    handleDeleteTask(task.taskId);
                }}
            >
                Delete
            </button>
        </div>
    );

    return(
        <>
            <div className="project-details-page">
                <h2>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => {
                                setEditedName(e.target.value);
                                setIsNameValid(e.target.value.trim() !== '');
                            }}
                            className={!isNameValid ? "invalid-input" : ""}
                            required
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
                                onChange={(e) => {
                                    setEditedDueDate(e.target.value);
                                    setIsDateValid(e.target.value !== '');
                                }}
                                className={!isDateValid ? "invalid-input" : ""}
                                required
                            />
                            
                        ) : (
                            project.dueDate.slice(0, 10)
                        )}
                    </p>
                </div>

                {isEditing ? (
                    <div>
                        <button onClick={handleSaveClick} disabled={!isNameValid || !isDateValid || editedName.trim() === '' || !editedDueDate}>Save</button>
                        <button onClick={handleCancelClick} className="cancel">Cancel</button>
                    </div>
                ) : (
                    <div>
                        <button onClick={handleEditClick}>Edit</button>
                    </div>
                )}
                
                <h3>Tasks:</h3>
                {/* You can add tasks display here once you implement that feature */}
                <div className="tasks-container">
                        <>
                            <div className="task-column">
                                <div className="button-and-h4">
                                    <h4>To Do</h4>
                                    <button className="add-task-btn"><Link to={`/project/${id}/add-task`}>Add Task</Link></button>
                                </div>
                                
                                <div className="incomplete-tasks">
                                    {todoTasks.length > 0 ? (
                                        todoTasks.map(task => renderTask(task))
                                    ) : (
                                        <p>No tasks to do</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="task-column">
                                <h4>In Progress</h4>
                                <div className="inprogress-tasks">
                                    {inProgressTasks.length > 0 ? (
                                        inProgressTasks.map(task => renderTask(task))
                                    ) : (
                                        <p>No tasks in progress</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="task-column">
                                <h4>Completed</h4>
                                <div className="complete-tasks">
                                    {completedTasks.length > 0 ? (
                                        completedTasks.map(task => renderTask(task))
                                    ) : (
                                        <p>No completed tasks</p>
                                    )}
                                </div>
                            </div>
                        </>
                </div>
                
                <button><Link to="/" className="back-link">Back to Projects</Link></button>
            </div>

            <DeleteTask
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={confirmDeleteTask}
/>

        </>
    );

    
}

export default ProjectInstance;