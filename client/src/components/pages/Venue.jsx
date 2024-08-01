import React, { useEffect, useState } from "react";
import { Button, Modal, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getReviews } from "../services/venue.service";

function Venue({ venue, date }) {
  const [show, setShow] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReviews(venue.venue_id)
      .then((res) => setReviews(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="row shadow mt-2 rounded py-2 px-2">
      <div className="col-md-4 ">
        <img
          src={venue.images[0]}
          className="rounded w-100 mt-2 pointer"
          height="250px"
          onClick={handleShow}
        />
      </div>
      <div className="col-md-7 ">
        <p className="fs-3">{venue.venue_name}</p>
        <p>Desc : {venue.description}</p>
        <p>Type : {venue.type_name}</p>
        <p>
          Location : {venue.city}, {venue.state}, {venue.country}
        </p>
        <p>Rating : {venue.average_rating}</p>

        <div style={{ float: "right" }}>
          {date.length !== 0 &&
            date[1].split(" ")[0] &&
            date[0].split(" ")[0] && (
              <Link to={`/book/${venue.venue_id}`} state={{ date: date }}>
                <button className="btn btn-secondary m-2">Book</button>
              </Link>
            )}

          <button className="btn btn-dark" onClick={handleShow}>
            View Details
          </button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{venue.venue_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel data-bs-theme="dark" className="mb-4">
            {venue.images.map((url, index) => {
              return (
                <Carousel.Item key={index}>
                  <img
                    src={url}
                    className="d-block w-100 rounded"
                    height="400px"
                  />
                </Carousel.Item>
              );
            })}
          </Carousel>
          <p>{venue.description}</p>
          <hr />
          {reviews.map((review) => {
            return (
              <div className="card my-2" key={review.id}>
                <div className="card-header">{review.username}</div>
                <div className="card-body">
                  <blockquote className="blockquote mb-0">
                    <p>{review.comment}</p>
                    <footer className="blockquote-footer">
                      {review.rating}
                      <cite title="Source Title"> stars</cite>
                    </footer>
                  </blockquote>
                </div>
              </div>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Venue;
