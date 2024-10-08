const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.send.status(404).json({ message : "Error loging in" })
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
        data: password
    },'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken, username
    }

    return res.status(200).json({ message: "User successfully logged in" });

  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const { rating, review } = req.body;

  if (books[isbn]) {
    // Add the new review to the book's reviews object
    const reviewId = Object.keys(books[isbn].reviews).length + 1;
    let userName = req.session.authorization['username'];
    books[isbn].reviews[reviewId] = {
        reviewer: userName,
        rating: rating,
        review: review
    };
    res.json({ message: "Review added successfully" });

  } else {
    res.status(403).json({ message: "Could not find book" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//Delete the reviews
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    let userName = req.session.authorization['username'];

    if(books[isbn]) {
        for(let num in books[isbn].reviews) {
            if(books[isbn].reviews[num].reviewer === userName) {
                delete books[isbn].reviews[num];
            }
        }
        res.json({ message: "Review deleted successfully" });
    } else {
        res.status(403).json({ message: "Could not find book" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
