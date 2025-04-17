import "./AddProject.css";
import React from "react";
import Projects from "./Projects";
import { Link, Routes, Route } from "react-router-dom";
import { useState } from "react";

const AddProject = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dueDate: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        console.log(formData);
        try {
            const response = await fetch('/api/project', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json',
                },
                // stringify?
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if(response.ok) {
                setMessage('User created successfully!');
                setFormData({name: '', description: '', dueDate: ''});
            } else {
                setMessage(`Error: ${data.message || 'Something went wrong'}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <>
            <div className="add-project-page">
                <h2 className="page-title">Add Project: </h2>
                {message && <div className={message.includes('Error') ? 'error' : 'success'}>{message}</div>}
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="project name" id="name" name="name" value={formData.name} onChange={handleChange} required></input>
                    <input type="text" placeholder="project description" id="description" name="description" value={formData.description} onChange={handleChange}></input>
                    <input type="date" placeholder="mm/dd/yyyy" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} required></input>
                    <button type="submit" id="save-project" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button id="cancel"><Link to="/Projects">Cancel</Link></button>
                <Routes><Route path="/Projects" element={<Projects />}/></Routes>
                </form>
            </div>
        </>
    );
}

export default AddProject;