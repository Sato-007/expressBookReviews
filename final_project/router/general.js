const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if(isValid(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }

  return res.status(404).json({message: "Unable to register user. Please provide username and password"});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn],null,4));
  } else {
    return res.status(403).json({message: "Could not find book"});
  }
  
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let filterdBooks = [];

  for(let isbn in books) {
    if(books[isbn].author.toLowerCase() === author.toLowerCase()) {
        filterdBooks.push(books[isbn]);
    }
  }

  if(filterdBooks.length > 0) {
    res.send(JSON.stringify(filterdBooks,null,4));
  } else {
    return res.status(403).json({message: "Could not find author"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let filterdBooks = [];

  for(let isbn in books) {
    if(books[isbn].title.toLowerCase() === title.toLowerCase()) {
        filterdBooks.push(books[isbn]);
    }
  }

  if(filterdBooks.length > 0) {
    res.send(JSON.stringify(filterdBooks,null,4));
  } else {
    return res.status(403).json({message: "Could not find author"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  let reviewBook;

  if (books[isbn]) {
      reviewBook = {
        "title" : books[isbn].title,
        "reviews" : books[isbn].reviews
      };
      res.send(JSON.stringify(reviewBook,null,4));
  } else {
    return res.status(403).json({message: "Could not find book"});
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
