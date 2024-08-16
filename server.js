const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(express.json());

const shippingData = {}; // Object to store all tracking data

// Endpoint to generate a tracking number
app.post("/generate-tracking", (req, res) => {
  const trackingNumber = "TRK" + Math.floor(Math.random() * 1000000);
  const { origin, destination, privacy } = req.body;

  // Validate input
  if (!origin || !destination) {
    return res
      .status(400)
      .json({ error: "Origin and destination are required." });
  }

  // Store the tracking information
  shippingData[trackingNumber] = {
    origin,
    destination,
    status: "In Transit",
    privacy,
  };

  res.json({ trackingNumber });
});

// Endpoint to track a package
app.get("/track-package", (req, res) => {
  const { number, privacy } = req.query;
  const details = shippingData[number];

  if (details) {
    if (details.privacy === privacy) {
      res.json({
        trackingNumber: number,
        origin: details.origin,
        destination: details.destination,
        status: details.status,
      });
    } else {
      res.status(403).json({ error: "Privacy setting does not match." });
    }
  } else {
    res.status(404).json({ error: "Tracking number not found." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
