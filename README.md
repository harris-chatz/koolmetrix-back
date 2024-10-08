# **Node.js Backend with SQLite3 Documentation**
byHarrisChatz
## **Overview**
This guide covers setting up a Node.js backend with CRUD (Create, Read, Update, Delete) operations connected to an SQLite3 database. SQLite3 is a lightweight, serverless, self-contained SQL database engine. We will build RESTful API endpoints that interact with the database using Express.js and the SQLite3 package.

## **Table of Contents**
1. [Environment Setup](#environment-setup)
2. [Project Structure](#project-structure)
3. [Dependencies](#dependencies)
4. [Database Setup](#database-setup)
5. [Express Server Setup](#express-server-setup)
6. [CRUD Operations](#crud-operations)
   - [Create](#create)
   - [Read](#read)
   - [Update](#update)
   - [Delete](#delete)
7. [Error Handling](#error-handling)
8. [Testing the API](#testing-the-api)
9. [Best Practices](#best-practices)
10. [Conclusion](#conclusion)

---

## **1. Environment Setup**

### **1.1. Install Node.js**
If you haven't installed Node.js yet, download it from [Node.js Official Website](https://nodejs.org/). Make sure to install a version that supports ES6+ features.

### **1.2. Create Project Directory**
Create a directory for your project and initialize a Node.js project:

```bash
mkdir node-sqlite3-crud
cd node-sqlite3-crud
npm init -y
```

This creates a `package.json` file to manage your project dependencies.

---

## **2. Project Structure**

The following is the recommended project structure:

```
node-sqlite3-crud/
│
├── database/
│   └── database.db       # SQLite3 database file
│
├── routes/
│   └── users.js          # Users route file
│
├── controllers/
│   └── userController.js # Users controller file
│
├── models/
│   └── userModel.js      # Users model file
│
├── app.js                # Main application file
├── package.json          # Node.js package file
└── README.md             # Project documentation
```

This structure helps in organizing the code logically by separating concerns: routes, controllers, and models.

---

## **3. Dependencies**

### **3.1. Install Dependencies**
Install the necessary packages:

```bash
npm install express sqlite3
```

- **`express`**: A web framework for Node.js.
- **`sqlite3`**: SQLite3 database binding for Node.js.

### **3.2. Optional Development Dependencies**
You may also want to install `nodemon` for automatic server restarts during development:

```bash
npm install --save-dev nodemon
```

Add a `start` script in your `package.json` for development:

```json
"scripts": {
  "start": "nodemon app.js"
}
```

---

## **4. Database Setup**

### **4.1. Initialize SQLite3 Database**
Inside the `database` folder, create a SQLite3 database file. You can do this programmatically or use an SQLite client.

```javascript
// models/userModel.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/database.db');

// Create Users table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age INTEGER NOT NULL
    )
  `);
});

module.exports = db;
```

This script creates a `users` table with columns `id`, `name`, `email`, and `age` if the table does not already exist.

---

## **5. Express Server Setup**

### **5.1. Create the Main Application File**

Create `app.js` as the entry point for the application:

```javascript
const express = require('express');
const app = express();
const userRoutes = require('./routes/users');

// Middleware
app.use(express.json());  // Parse incoming JSON data

// Routes
app.use('/api/users', userRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### **5.2. Enable CORS (Optional)**
If your frontend will be hosted on a different domain, enable CORS:

```bash
npm install cors
```

Then, update `app.js`:

```javascript
const cors = require('cors');
app.use(cors());  // Enable CORS
```

---

## **6. CRUD Operations**

### **6.1. Create Routes**
In the `routes/` folder, create `users.js` to define routes for handling CRUD operations.

```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CRUD routes
router.get('/', userController.getAllUsers);  // Read all users
router.get('/:id', userController.getUserById);  // Read a single user
router.post('/', userController.createUser);  // Create a new user
router.put('/:id', userController.updateUser);  // Update a user
router.delete('/:id', userController.deleteUser);  // Delete a user

module.exports = router;
```

### **6.2. Create Controller Functions**
In the `controllers/` folder, create `userController.js` to handle the logic for each CRUD operation:

```javascript
const db = require('../models/userModel');

// Get all users
exports.getAllUsers = (req, res) => {
  const sql = 'SELECT * FROM users';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
};

// Get user by ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user: row });
  });
};

// Create a new user
exports.createUser = (req, res) => {
  const { name, email, age } = req.body;
  const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
  db.run(sql, [name, email, age], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
};

// Update a user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?';
  db.run(sql, [name, email, age, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User updated successfully' });
  });
};

// Delete a user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.run(sql, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  });
};
```

Each method corresponds to a specific CRUD operation, performing SQL queries on the SQLite3 database.

---

## **7. Error Handling**

### **7.1. Global Error Handling**
You can set up a global error handler to catch any unhandled errors in your application:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
```

This middleware catches errors and sends a generic message to the client.

### **7.2. Input Validation**
For better error handling, validate incoming data (e.g., using a package like `express-validator`):

```bash
npm install express-validator
```

Integrate it into your controller methods to validate data before performing any database operations.

---

## **8. Testing the API**

### **8.1. Postman**
Use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test the API endpoints. Set up requests for:
- `POST /api/users` to create a user.
- `GET /api/users`