const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/books");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  }
  return res.status(404).json({ message: "No books found by this author" });
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(
    (book) => book.title === title
  );
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  }
  return res.status(404).json({ message: "No books found with this title" });
});

// Get book review
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "No reviews found for this book" });
});

module.exports.general = public_users;
