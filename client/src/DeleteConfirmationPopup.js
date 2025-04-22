// DeleteConfirmationPopup.jsx
import React from 'react';
import './DeleteConfirmationPopup.css';  // You'll add custom styles here

const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm, projectName }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h3>Are you sure you want to delete the project? <strong>{projectName}</strong></h3>
        <div className="popup-actions">
          <button className="confirm-button" onClick={onConfirm}>Yes, Delete</button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;
