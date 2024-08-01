import React, { useEffect, useState } from "react";
import { getReservationsSum, getVenues } from "../services/venue.service";
import Venue from "./Venue";
import { Spinner } from "react-bootstrap";
import moment from "moment";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

function Home() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [date, setDate] = useState([]);
  const [reservedVenues, setReservedVenues] = useState([]);
  const [removeVenues, setRemoveVenues] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const filterByDate = (value, dateString) => {
    setDate(dateString);
    if (dateString[0] !== "") {
      reservedVenues.forEach((venue) => {
        if (
          moment(venue.start_date.split("T")[0]).isBetween(
            dateString[0],
            dateString[1],
            undefined,
            "[]"
          ) ||
          moment(venue.end_date.split("T")[0]).isBetween(
            dateString[0],
            dateString[1],
            undefined,
            "[]"
          )
        ) {
          setRemoveVenues((prev) => [...prev, venue.venue_id]);
        }
      });
    } else {
      setRemoveVenues([]);
    }
  };

  useEffect(() => {
    getVenues()
      .then((res) => {
        setVenues(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err);
      });
    getReservationsSum().then((res) => setReservedVenues(res.data));
  }, []);

  const filteredVenues = venues.filter(
    (venue) =>
      !removeVenues.includes(venue.venue_id) &&
      (venue.venue_name.toLowerCase().includes(searchKey.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchKey.toLowerCase()) ||
        venue.state.toLowerCase().includes(searchKey.toLowerCase()) ||
        venue.country.toLowerCase().includes(searchKey.toLowerCase()))
  );

  return (
    <div className="container">
      <div className="row mt-5 justify-content-center">
        <div className="col-md-4">
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            placeholder={["Start Time", "End Time"]}
            onChange={filterByDate}
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
      </div>

      <div className="row justify-content-center mt-5 mb-3">
        {loading ? (
          <Spinner animation="border" variant="secondary" role="status" />
        ) : error ? (
          <h1>Error</h1>
        ) : (
          filteredVenues.map((venue) => (
            <div key={venue.venue_id} className="col-md-9 mt-3">
              <Venue venue={venue} date={date} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
