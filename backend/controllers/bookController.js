import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/books.json");

const readBooks = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

export const getAllBooks = (req, res) => {
  try {
    let books = readBooks();
    const { genre, minRating } = req.query;

    if (genre) books = books.filter((book) => book.genre === genre);
    if (minRating)
      books = books.filter((book) => book.rating >= parseFloat(minRating));

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

export const getBookById = (req, res) => {
  try {
    const books = readBooks();
    const book = books.find((b) => b.id === req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error });
  }
};

export const addBook = (req, res) => {
  try {
    const books = readBooks();
    const newBook = { id: String(books.length + 1), ...req.body };

    books.push(newBook);
    fs.writeFileSync(filePath, JSON.stringify(books, null, 2));

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error });
  }
};

export const updateRating = (req, res) => {
  try {
    const books = readBooks();
    const bookIndex = books.findIndex((b) => b.id === req.params.id);

    if (bookIndex === -1)
      return res.status(404).json({ message: "Book not found" });

    books[bookIndex].rating = req.body.rating;
    fs.writeFileSync(filePath, JSON.stringify(books, null, 2));

    res.status(200).json(books[bookIndex]);
  } catch (error) {
    res.status(500).json({ message: "Error updating rating", error });
  }
};

export const getStatistics = (req, res) => {
  try {
    const books = readBooks();
    const genres = {};

    books.forEach((book) => {
      if (!genres[book.genre]) {
        genres[book.genre] = {
          totalRating: 0,
          count: 0,
          oldest: book.publicationYear,
          newest: book.publicationYear,
        };
      }

      genres[book.genre].totalRating += book.rating;
      genres[book.genre].count += 1;
      genres[book.genre].oldest = Math.min(
        genres[book.genre].oldest,
        book.publicationYear
      );
      genres[book.genre].newest = Math.max(
        genres[book.genre].newest,
        book.publicationYear
      );
    });

    const stats = Object.keys(genres).map((genre) => ({
      genre,
      averageRating: (genres[genre].totalRating / genres[genre].count).toFixed(
        2
      ),
      oldestBook: genres[genre].oldest,
      newestBook: genres[genre].newest,
    }));

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics", error });
  }
};
