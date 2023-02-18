const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
    const {username, password} = req.body;
    
    if (isValid(username)) {
        const user = {
            username,
            password
        }
        users.push(user);
        return res.status(201).send("User created");
    }
    
    return res.status(400).send("Invalid username");

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here with
    
    
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(books[isbn]);
    }
    else {
        return res.status(404).send("Book not found");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  
  const author = req.params.author;
    let booksByAuthor = [];
    for (let book in books) {
        if (books[book].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push(books[book]);
        }
    }
    
    if (booksByAuthor.length > 0) {
        return res.send(booksByAuthor);
    }
    
    return res.status(404).send("Book not found");
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    const title = req.params.title.replace(/_/g, " ");
    let booksByTitle = [];
    for (let book in books) {
        if (books[book].title.toLowerCase() === title.toLowerCase()) {
            booksByTitle.push(books[book]);
        }
    }
    
    if (booksByTitle.length > 0) {
        return res.send(booksByTitle);
    }
    
    return res.status(404).send("Book not found");
  

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(books[isbn].reviews);
    }
  return res.status(404).send("Book not found");

});

module.exports.general = public_users;


const DEFAULT_URL = 'http://localhost:5000';
const getBooks = async (baseUrl = DEFAULT_URL) => {
    
    try {
        const response = await axios.get(`${baseUrl}/`);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
};

// Add the code for getting the book details based on ISBN
const getBookByISBN = async (isbn, baseUrl = DEFAULT_URL) => {
    try {
        const response = await axios.get(`${baseUrl}/isbn/${isbn}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}


// Add the code for getting the book details based on Author
const getBookByAuthor = async (author, baseUrl = DEFAULT_URL) => {
    try {
        const response = await axios.get(`${baseUrl}/author/${author}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

// Add the code for getting the book details based on Title
const getBookByTitle = async (title, baseUrl = DEFAULT_URL) => {
    try {
        const response = await axios.get(`${baseUrl}/title/${title}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}
