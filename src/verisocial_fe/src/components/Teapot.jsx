import { useEffect, useState } from "react";
import api from "../api";

// For testing API Status
const TeapotComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeapot = async () => {
      try {
        const response = await api.teapotService.getStatus();
        setData(response);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTeapot();
  }, []);

  return (
    <div>
      <h2>Teapot API Response</h2>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
};

export default TeapotComponent;
