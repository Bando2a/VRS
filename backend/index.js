import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

app.use(express.json());
app.use(cors());

app.get("/venues", (req, res) => {
  const q = `SELECT 
    venues.venue_id,
    venues.venue_name, 
    venues.description, 
    venues.capacity,
    venues.amount_per_day,
    locations.city, 
    locations.state, 
    locations.country, 
    venue_types.type_name, 
    venue_types.type_desc,
    GROUP_CONCAT(DISTINCT venue_images.image_url) AS images,
    AVG(reviews.rating) AS average_rating,
    COUNT(reviews.review_id) AS review_count
FROM venues
JOIN locations ON venues.location_id = locations.location_id
JOIN venue_types ON venues.type_id = venue_types.type_id
LEFT JOIN venue_images ON venues.venue_id = venue_images.venue_id
LEFT JOIN reviews ON venues.venue_id = reviews.venue_id
GROUP BY venues.venue_id, locations.city, locations.state, locations.country, venue_types.type_name, venue_types.type_desc;`;
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    const formattedResults = data.map((venue) => ({
      ...venue,
      images: venue.images ? venue.images.split(",") : [],
    }));
    return res.json(formattedResults);
  });
});

app.get("/venues/:id", (req, res) => {
  const venueId = req.params.id;
  const q = `SELECT 
      venues.venue_id,
      venues.venue_name, 
      venues.description, 
      venues.capacity, 
      venues.amount_per_day,
      locations.city, 
      locations.state, 
      locations.country, 
      venue_types.type_name, 
      venue_types.type_desc,
      GROUP_CONCAT(DISTINCT venue_images.image_url) AS images
    FROM venues
    JOIN locations ON venues.location_id = locations.location_id
    LEFT JOIN venue_types ON venues.type_id = venue_types.type_id
    JOIN venue_images ON venues.venue_id = venue_images.venue_id
    WHERE venues.venue_id = ?
    GROUP BY venues.venue_id;`;

  db.query(q, [venueId], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0)
      return res.status(404).json({ message: "Venue not found" });
    const venue = data[0];
    venue.images = venue.images ? venue.images.split(",") : [];
    return res.json(venue);
  });
});

app.get("/venues/:id/reviews", (req, res) => {
  const venueId = req.params.id;
  const q = `SELECT 
    reviews.review_id,
    reviews.user_id,
    users.username,
    reviews.rating,
    reviews.comment,
    reviews.created_at
  FROM reviews
  JOIN users ON reviews.user_id = users.user_id
  WHERE reviews.venue_id = ?;`;

  db.query(q, [venueId], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0)
      return res.status(404).json({ message: "Venue not found" });
    return res.json(data);
  });
});

app.post("/register", async (req, res) => {
  const { username, password, email, first_name, last_name } = req.body;

  // Check if all fields are provided
  if (!username || !password || !email || !first_name || !last_name) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    // Insert the new user into the database
    const q = `INSERT INTO Users (username, password_hash, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)`;
    db.query(
      q,
      [username, password, email, first_name, last_name],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ message: "Username or email already exists" });
          }
          return res.status(500).json(err);
        }

        return res
          .status(201)
          .json({ message: "User registered successfully" });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

app.post("/login", (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const q = `SELECT * FROM Users WHERE username = ? OR email = ?`;
  db.query(q, [identifier, identifier], async (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res
        .status(401)
        .json({ message: "Invalid username/email or password" });
    }

    const user = result[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = password === user.password_hash;

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid username/email or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_admin: user.is_admin,
      },
    });
  });
});

app.post("/reserve", (req, res) => {
  const { user_id, venue_id, start_date, end_date } = req.body;

  const q = `
      INSERT INTO reservations (user_id, venue_id, start_date, end_date, status)
      VALUES (?, ?, ?,  ?, 'pending')
    `;

  db.query(q, [user_id, venue_id, start_date, end_date], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Reservation failed", error: err });
    }

    return res.status(201).json({
      message: "Reservation successful",
      reservationId: result.insertId,
    });
  });
});

app.get("/reservations-sum", (req, res) => {
  const q = `
      SELECT 
        reservation_id,
        venue_id,
        start_date,
        end_date
      FROM reservations;
    `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

app.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userQuery = "SELECT * FROM Users WHERE user_id = ?";
    const reservationsQuery = `
        SELECT 
          r.*, 
          v.venue_name, 
          v.description, 
          l.city, 
          l.state, 
          l.country
        FROM reservations r
        JOIN venues v ON r.venue_id = v.venue_id
        JOIN locations l ON v.location_id = l.location_id
        WHERE r.user_id = ?;
      `;

    const [userResults] = await db.promise().query(userQuery, [userId]);
    const [reservationResults] = await db
      .promise()
      .query(reservationsQuery, [userId]);

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = userResults[0];
    const userReservations = reservationResults;

    return res.json({ userProfile, userReservations });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

app.delete("/reservations/:reservationId", (req, res) => {
  const reservationId = req.params.reservationId;

  const q = `DELETE FROM reservations WHERE reservation_id = ?`;

  db.query(q, [reservationId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting reservation", error: err });
    }

    return res
      .status(200)
      .json({ message: "Reservation deleted successfully" });
  });
});

app.put("/profile/:userId", (req, res) => {
  const userId = req.params.userId;
  const { first_name, last_name, email } = req.body;

  const q = `UPDATE Users SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?`;

  db.query(q, [first_name, last_name, email, userId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating profile", error: err });
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  });
});

app.get("/users", (req, res) => {
  const q = `SELECT * FROM Users`;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

app.get("/reservations", (req, res) => {
  const q = `
      SELECT 
        reservations.reservation_id,
        reservations.user_id,
        reservations.venue_id,
        reservations.start_date,
        reservations.end_date,
        reservations.status,
        users.username,
        venues.venue_name,
        locations.city,
        locations.state,
        locations.country
      FROM reservations
      JOIN users ON reservations.user_id = users.user_id
      JOIN venues ON reservations.venue_id = venues.venue_id
      JOIN locations ON venues.location_id = locations.location_id;
    `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

app.delete("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const q = `DELETE FROM Users WHERE user_id = ?`;

  db.query(q, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ message: "User deleted successfully" });
  });
});

app.delete("/reservations/:reservationId", (req, res) => {
  const reservationId = req.params.reservationId;
  const q = `DELETE FROM reservations WHERE reservation_id = ?`;

  db.query(q, [reservationId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json({ message: "Reservation deleted successfully" });
  });
});

app.get("/stats", async (req, res) => {
  const venueCountQuery = `SELECT COUNT(*) AS venue_count FROM venues`;
  const reservationCountQuery = `SELECT COUNT(*) AS reservation_count FROM reservations`;

  try {
    const [venueCountResult] = await db.promise().query(venueCountQuery);
    const [reservationCountResult] = await db
      .promise()
      .query(reservationCountQuery);

    const stats = {
      venueCount: venueCountResult[0].venue_count,
      reservationCount: reservationCountResult[0].reservation_count,
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.listen(8800, () => {
  console.log("listening on 8800");
});
