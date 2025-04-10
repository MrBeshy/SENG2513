// Users.jsx

import React from "react";
import { useEffect, useState } from "react";

const Users = () => {

  const [user, setuser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  useEffect(() => {
    
    fetch(`/api/user`)
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
          setuser(data); // Ensure data is an array
          setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
        <div style={{
            display: "flex",
            justifyContent: "center"
        }}>
            <h1>Users</h1>
        </div>
        <div>
          {Array.isArray(user) && user.length > 0 ? (
            user.map((data) => (
                <p key={data.id}>{data.username}</p>
            ))
          ) : (
            <p>No users found or data is not in expected format.</p>
          )}
        </div>
    </>
  );
}

export default Users;