import { ethers } from "ethers";
import cors from "cors";
import dotenv  from "dotenv";
import express from 'express';
import { events } from './eventListener.js'
dotenv.config()


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

