const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => user.username !== username)
  
  
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  
  return users.some(user => user.username === username && user.password === password)
  
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
    const {username, password} = req.body;
    if (authenticatedUser(username, password)) {
        const user = {username};
        const accessToken = jwt.sign(user,'fingerprint_customer', { expiresIn: 60 * 60 } );
        req.session.authorization = {
          accessToken
        }
        req.session.user = user;
        return res.status(200).send({message: "User logged in", accessToken});
    }
    
    return res.status(400).send("Invalid username or password");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // Hint: You have to give a review as a request query & it must get posted with the username (stored in the session) posted. 
  // If the same user posts a different review on the same ISBN, it should modify the existing review. 
  // If another user logs in and posts a review on the same ISBN, it will get added as a different review under the same ISBN.
   
    const isbn = req.params.isbn;
    const {review} = req.body
    const username = req.session.user.username;
    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        
        return res.status(200).send({message: "Review added", book: books[isbn]});
    }
    else {
        return res.status(404).send("Book not found");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Hint: Filter & delete the reviews based on the session username,
  // so that a user can delete only his/her reviews and not other users’.
  
    const isbn = req.params.isbn;
    const username = req.session.user.username;
    if (books[isbn]) {
        delete books[isbn].reviews[username];
        
        return res.status(200).send({message: "Review deleted", book: books[isbn]});
    }
    else {
        return res.status(404).send("Book not found");
    }
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
