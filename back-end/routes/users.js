const express = require("express");
const router = express.Router();
const User = require("../models/user")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Get books in a specific user's collection
router.post("/books", authenticateToken, async (req, res) => {
    try {
        const books = await User.find();
        var userWithCollection = books.find(book => book.username === req.body.username)
        res.json(userWithCollection)
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Patch a book to a specific user's collection
router.patch("/", authenticateToken, async (req, res) => {
    try {
        const books = await User.find();
        var userData = books.filter(book => book.username === req.body.username)
        var collection = userData.find(book => book.bookCollection);
        var obj = {
            bookId: setIdBook(collection),
            bookTitle: req.body.bookTitle,
            reading: req.body.reading
        }
        collection.bookCollection.push(obj);
        const newBookCollection = await collection.save();
        res.status(201).json(newBookCollection);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Patch the "reading" value on a book in a user's collection
router.patch("/reading", authenticateToken, async (req, res) => {
    try {
        const books = await User.find();
        var userData = books.filter(book => book.username === req.body.username)
        var collection = userData.find(book => book.bookCollection);
        collection.bookCollection.forEach(async function (value, i) {
            if (value.bookId == req.body.bookId) {
                collection.bookCollection[i].reading = req.body.reading;
            }
          });
            collection.markModified('bookCollection');
            const newBookCollection = await collection.save();
            res.status(201).json(newBookCollection);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Create a new user
router.post("/", async (req, res) => {
    const books = await User.find();
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const users = [];
        const user = new User({
            userId: setIdUser(books.length),
            username: req.body.username,
            password: hashedPassword,
            bookCollection: req.body.bookCollection
        })
        userIsUnique = false;
        if (books.length > 0) {
            for (let book of books) {
                if (book.username == user.username) {
                    userIsUnique = false;
                    break;
                }
                userIsUnique = true;
            }
            if (userIsUnique) {
                users.push(user);
                for (i in users) {
                    const newUser = await users[i].save();
                }
                res.status(201).json(newUser);
            }
        }
        else if (books.length == 0) {
            users.push(user);
            for (i in users) {
                const newUser = await users[i].save();
            }
            res.status(201).json(newUser);
        }
       
      
    } catch {
        res.status(500)
    }
})

// Remove a book from a users collection
router.patch("/remove", authenticateToken, async (req, res) => {
    try {
        const books = await User.find();
        var userData = books.filter(book => book.username === req.body.username)
        var collection = userData.find(book => book.bookCollection);
        for (let book of collection.bookCollection) {
            if (book.bookId == req.body.bookId) {
                const index = collection.bookCollection.findIndex(r => r.bookId === req.body.bookId);
                if (index > -1) { 
                    collection.bookCollection.splice(index, 1);
                    break;
                }
            }
        }
        collection.markModified('bookCollection');
        const newBookCollection = await collection.save();
        res.status(201).json(newBookCollection);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Post a login request
router.post("/login", async (req, res) => {
    for await (const user of db.collection('users').find()) {
        try {
            if (user.username == req.body.username) {
                if (await bcrypt.compare(req.body.password, user.password)) {
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                    return res.json({ accessToken: accessToken })
                } else {
                    return res.status(500).send("Login denied")
                }
            }
        }
        catch {
            console.log("User not found");
            return res.status(400).send("User was not found");
        }
    }
})

// Verify that the JWT token is correct
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

function setIdUser(length) {
    var id = 0;   
    if (length == 1) {
        return 1;
    }
    else if (length > 1) {
        return length;
    }
    else {
        return 0;
    }
}

function setIdBook(collection) {
    var id = 0;   
    if (collection.bookCollection.length == 1) {
        return 1;
    }
    else if (collection.bookCollection.length > 1) {
        id = checkIdIsAvailable(collection);
        return id;
    }
    else {
        return 0;
    }
}

function checkIdIsAvailable(collection) {
    var idInCollection = [];
    for (let book of collection.bookCollection) {
        if (book.bookId >= 0) {
            idInCollection.push(book.bookId)
        }
        else if (book.bookId = -1) {
            break;
        }
    }
    idInCollection.sort(function(a, b) {return a - b;});
    var id = idInCollection.pop() + 1;
    return id;
}



module.exports = router;