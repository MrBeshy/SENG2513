// Companies.jsx

import React from "react";
import { useEffect, useState } from "react";

const Companies = () => {

  const [sample, setSample] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  useEffect(() => {
    fetch(`/api/company`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSample(data);
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
            <h1>Companies</h1>
        </div>
        <div>
        {sample.map((data) => (
            <p key={data.id}>{data.name}</p>
        ))}
        </div>
    </>
  );
}

export default Companies;
