import React, { useEffect, useState } from "react";
import {
  Spinner,
  Table,
  Card,
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Tabs,
  Tab,
} from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";

function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProfile, setEditProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await axios.get(
          `http://localhost:8800/profile/${userId}`
        );
        setProfile(response.data.userProfile);
        setReservations(response.data.userReservations);
        if (response.data.userProfile.is_admin) {
          fetchAllUsers();
          fetchAllReservations();
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(true);
      }
    }
    fetchProfileData();
  }, [userId]);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8800/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchAllReservations = async () => {
    try {
      const response = await axios.get("http://localhost:8800/reservations");
      setAllReservations(response.data);
    } catch (err) {
      console.error("Error fetching reservations", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8800/users/${userId}`);
      setUsers(users.filter((user) => user.user_id !== userId));
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:8800/reservations/${reservationId}`);
      setAllReservations(
        allReservations.filter((res) => res.reservation_id !== reservationId)
      );
      setReservations(
        reservations.filter((res) => res.reservation_id !== reservationId)
      );
    } catch (err) {
      console.error("Error deleting reservation", err);
    }
  };

  const handleEditProfile = async () => {
    try {
      await axios.put(`http://localhost:8800/profile/${userId}`, editProfile);
      setProfile({ ...profile, ...editProfile });
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  const handleShowEditModal = () => {
    setEditProfile({
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
    });
    setShowEditModal(true);
  };

  if (loading)
    return <Spinner animation="border" variant="secondary" role="status" />;
  if (error) return <h1>Error loading profile data</h1>;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header as="h2">Profile Information</Card.Header>
            <Card.Body>
              {profile && (
                <div>
                  <p>
                    <strong>Username:</strong> {profile.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {profile.email}
                  </p>
                  <p>
                    <strong>First Name:</strong> {profile.first_name}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {profile.last_name}
                  </p>
                  <p>
                    <strong>Admin:</strong> {profile.is_admin ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Joined:</strong>{" "}
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                  <Button variant="primary" onClick={handleShowEditModal}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {profile.is_admin ? (
            <Tabs defaultActiveKey="reservations" id="profile-tabs">
              <Tab eventKey="reservations" title="Reservations">
                <Card>
                  <Card.Header as="h2">Reservations</Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Reservation ID</th>
                          <th>Venue Name</th>
                          <th>Location</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map((reservation) => (
                          <tr key={reservation.reservation_id}>
                            <td>{reservation.reservation_id}</td>
                            <td>{reservation.venue_name}</td>
                            <td>{`${reservation.city}, ${reservation.state}, ${reservation.country}`}</td>
                            <td>
                              {new Date(
                                reservation.start_date
                              ).toLocaleDateString()}
                            </td>
                            <td>
                              {new Date(
                                reservation.end_date
                              ).toLocaleDateString()}
                            </td>
                            <td>{reservation.status}</td>
                            <td>
                              <Button
                                variant="danger"
                                onClick={() =>
                                  handleDeleteReservation(
                                    reservation.reservation_id
                                  )
                                }
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="users" title="Users">
                <Card>
                  <Card.Header as="h2">Users</Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Admin</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.is_admin ? "Yes" : "No"}</td>
                            <td>
                              <Button
                                variant="danger"
                                onClick={() => handleDeleteUser(user.user_id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="allReservations" title="All Reservations">
                <Card>
                  <Card.Header as="h2">All Reservations</Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Reservation ID</th>
                          <th>Venue Name</th>
                          <th>Location</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allReservations.map((reservation) => (
                          <tr key={reservation.reservation_id}>
                            <td>{reservation.reservation_id}</td>
                            <td>{reservation.venue_name}</td>
                            <td>{`${reservation.city}, ${reservation.state}, ${reservation.country}`}</td>
                            <td>
                              {new Date(
                                reservation.start_date
                              ).toLocaleDateString()}
                            </td>
                            <td>
                              {new Date(
                                reservation.end_date
                              ).toLocaleDateString()}
                            </td>
                            <td>{reservation.status}</td>
                            <td>
                              <Button
                                variant="danger"
                                onClick={() =>
                                  handleDeleteReservation(
                                    reservation.reservation_id
                                  )
                                }
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          ) : (
            <Card>
              <Card.Header as="h2">Reservations</Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Reservation ID</th>
                      <th>Venue Name</th>
                      <th>Location</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation.reservation_id}>
                        <td>{reservation.reservation_id}</td>
                        <td>{reservation.venue_name}</td>
                        <td>{`${reservation.city}, ${reservation.state}, ${reservation.country}`}</td>
                        <td>
                          {new Date(
                            reservation.start_date
                          ).toLocaleDateString()}
                        </td>
                        <td>
                          {new Date(reservation.end_date).toLocaleDateString()}
                        </td>
                        <td>{reservation.status}</td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() =>
                              handleDeleteReservation(
                                reservation.reservation_id
                              )
                            }
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={editProfile.first_name}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    first_name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={editProfile.last_name}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    last_name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={editProfile.email}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditProfile}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Profile;
