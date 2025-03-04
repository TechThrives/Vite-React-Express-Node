import express from 'express';
import { getAllBooks, getBookById, addBook, updateRating, getStatistics } from '../controllers/bookController.js';

const router = express.Router();

router.get("/", getAllBooks);
router.get("/stats", getStatistics);
router.get("/:id", getBookById);
router.post("/", addBook);
router.patch("/:id/rating", updateRating);

export default router;
