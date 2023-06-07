require('dotenv').config();
const express = require("express");
const { events } = require("./eventListener.js");
const cors = require("cors");

const app = express();
const port = process.env.API_PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.options("*", cors());

// server listening
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// eventsMATIC();
