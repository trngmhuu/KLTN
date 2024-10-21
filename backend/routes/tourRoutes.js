import express from "express";
import { createTour, updateTour, deleteTour, getAllTours, getSingleTour } from "../controllers/tourController.js";

const router = express.Router()

// Create new tour
router.post("/", createTour);

// Update new tour
router.put("/:id", updateTour);

// Delete tour
router.delete("/:id", deleteTour);

// Get single tour
router.get("/:id", getSingleTour);

// Get all tours
router.get("/", getAllTours)
export default router;