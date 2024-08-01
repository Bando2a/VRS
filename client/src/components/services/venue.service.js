import axios from "axios";

const url = "http://localhost:8800";

// Get All Books
export async function getVenues() {
  try {
    return await axios.get(`${url}/venues`);
  } catch (err) {
    throw err;
  }
}

// Get Single Book
export async function getVenue(id) {
  try {
    return await axios.get(`${url}/venues/${id}`);
  } catch (err) {
    throw err;
  }
}

export async function getReservationsSum() {
  try {
    return await axios.get(`${url}/reservations-sum`);
  } catch (err) {
    throw err;
  }
}

export async function bookVenue(body) {
  try {
    return await axios.post(`${url}/reserve`, body);
  } catch (error) {
    throw err;
  }
}

export async function getReviews(id) {
  try {
    return await axios.get(`${url}/venues/${id}/reviews`);
  } catch (err) {
    throw err;
  }
}

// Add New Book
export async function addUser(user) {
  try {
    return await axios.post(`${url}/register`, user);
  } catch (err) {
    throw err;
  }
}

export async function loginUser(user) {
  try {
    return await axios.post(`${url}/login`, user);
  } catch (err) {
    throw err;
  }
}

// Delete Book
export async function deleteBook(id) {
  try {
    return await axios.delete(`${url}/${id}`);
  } catch (err) {
    throw err;
  }
}
