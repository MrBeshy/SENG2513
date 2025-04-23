import "./AddTask.css"
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const AddTask = () => {
    const { id } = useParams(); // Get the project ID from the URL
    const Navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'to-do'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const linkRef = useRef(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const projectRes = await fetch(`/api/project/${id}`);
                if(!projectRes.ok) {
                    throw new Error(`HTTP error! Status: ${projectRes.status}`);
                }
                const projectData = await projectRes.json();
                setProject(projectData);
            } catch (error) {
                setMessage(`Error: ${error.message}`);
            }
        };

        fetchProject();
    }, [id]);

    const handleChange = (e) => {
        const { name , value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
            if (submitSuccess && linkRef.current) {
                setTimeout(() => {
                    linkRef.current.click();
                }, 1000); // Delay for 1 second so user can see success message
            }
        }, [submitSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch(`/api/project/${id}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Task created successfully!');
                setFormData({
                    title: '',
                    description: '',
                    priority: 'medium',
                    status: 'to-do'
                });
                setSubmitSuccess(true);
            } else {
                setMessage(`Error: ${data.message || 'Something went wrong'}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCancel = () => {
        Navigate(-1);
    };

    return(
        <>
            <div className="addTask-page">
                <h2 className="page-title">Add Task: </h2>
                {project && <h3>For Project: {project.name}</h3>}
                
                {message && <div className={message.includes('Error') ? 'error' : 'success'}>{message}</div>}
                <form onSubmit={handleSubmit}>
                    <input type="text" classname="title" placeholder="task title" id="title" name="title" value={formData.title} onChange={handleChange} required></input>
                    <textarea classname="description" placeholder="task description" id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
                    <select classname="priority" id="priority" name="priority" value={formData.priority} onChange={handleChange} required>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <select classname="status" id="status" name="status" value={formData.status} onChange={handleChange} required>
                        <option value="to-do">To-do</option>
                        <option value="in-progress">In-progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button type="submit" id="save-task" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button id="cancel" onClick={handleCancel}>Cancel</button>

                    <Link to={`/project/${id}`} ref={linkRef} style={{ display: 'none' }}> Navigate </Link>
                </form>
            </div>
        </>
    );
}

export default AddTask;