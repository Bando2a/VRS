import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { bookVenue, getVenue } from "../services/venue.service";
import { Spinner } from "react-bootstrap";
import moment from "moment";

function Booking() {
  const { venueid } = useParams();
  const [venue, setVenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const navigate = useNavigate();

  const location = useLocation();
  const { date } = location.state || [0, 0];

  useEffect(() => {
    getVenue(venueid)
      .then((res) => {
        setVenue(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err);
      });
  }, []);

  const totalDays =
    Math.abs(
      moment
        .duration(
          moment(date[1], "YYYY-MM-DD").diff(moment(date[0], "YYYY-MM-DD"))
        )
        .asDays()
    ) + 1;

  const user = JSON.parse(localStorage.getItem("user"));

  const [body, setBody] = useState({
    user_id: user.user.user_id,
    venue_id: venueid,
    start_date: date[0].split(" ")[0],
    end_date: date[1].split(" ")[0],
  });
  const handleBookVenue = () => {
    bookVenue(body).then(() => {
      alert("Booked!");
      navigate("/home");
    });
  };

  return (
    <div>
      {loading ? (
        <Spinner animation="border" variant="secondary" role="status" />
      ) : error ? (
        <h1>Error</h1>
      ) : (
        <div className="m-5">
          <div className="row justify-content-center mt-5 shadow">
            <div className="col-md-6">
              <h1>{venue.venue_name}</h1>
              <img
                src={venue.images[0]}
                className="w-100 rounded"
                height="400px"
              />
            </div>

            <div className="col-md-6">
              <div>
                <h1>Details</h1>
                <hr />
                <b>
                  <p>Name: {user.user.username || ""}</p>
                  <p>From Date: {date[0] || "---"}</p>
                  <p>To Date: {date[1] || "---"}</p>
                  <p>Capacity: {venue.capacity} per.</p>
                </b>
              </div>

              <div>
                <h1>Amount</h1>
                <hr />
                <b>
                  <p>Total Days: {totalDays || 0}</p>
                  <p>Price Per Day: {venue.amount_per_day}</p>
                  <p>Total Amount: {venue.amount_per_day * totalDays || 0}</p>
                </b>
              </div>

              <div>
                <button
                  style={{ float: "right" }}
                  className="btn btn-dark w-25 mb-2"
                  onClick={handleBookVenue}
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;
