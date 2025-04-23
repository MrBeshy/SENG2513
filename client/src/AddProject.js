import "./AddProject.css";
import React from "react";
import Projects from "./Projects";
import { Link, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const AddProject = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dueDate: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const linkRef = useRef(null);

    const handleChange = (e) => {
        const { name, value} = e.target;
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
                setMessage('Project created successfully!');
                setFormData({name: '', description: '', dueDate: ''});
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

    return(
        <>
            <div className="add-project-page">
                <h2 className="page-title">Add Project: </h2>
                {message && <div className={message.includes('Error') ? 'error' : 'success'}>{message}</div>}
                <form onSubmit={handleSubmit} className="form">
                    <input type="text" placeholder="project name" id="name" name="name" value={formData.name} onChange={handleChange} required></input>
                    <textarea placeholder="project description" id="description" name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>
                    <input type="date" placeholder="mm/dd/yyyy" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} required></input>
                    <button type="submit" id="save-project" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button id="cancel"><Link to="/Projects" className="cancel">Cancel</Link></button>

                    <Link to="/Projects" ref={linkRef} style={{ display: 'none' }}>Navigate</Link>

                <Routes><Route path="/Projects" element={<Projects />}/></Routes>
                </form>
            </div>
        </>
    );
}

export default AddProject;