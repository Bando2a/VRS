import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Stats = () => {
  const [stats, setStats] = useState({ venueCount: 0, reservationCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:8800/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Number of Venues</h5>
              <p className="card-text display-4">{stats.venueCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Number of Reservations</h5>
              <p className="card-text display-4">{stats.reservationCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
