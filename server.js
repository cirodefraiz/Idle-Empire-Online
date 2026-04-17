const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./db.sqlite");

// création table
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT,
  gold INTEGER DEFAULT 0,
  gems INTEGER DEFAULT 0
)
`);

// register
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password],
    function (err) {
      if (err) return res.status(400).send("User exists");
      res.send({ id: this.lastID });
    }
  );
});

// login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, user) => {
      if (!user) return res.status(401).send("Invalid");

      res.send(user);
    }
  );
});

// save game
app.post("/save", (req, res) => {
  const { id, gold, gems } = req.body;

  db.run(
    "UPDATE users SET gold=?, gems=? WHERE id=?",
    [gold, gems, id]
  );

  res.send("saved");
});

app.listen(3000, () => console.log("Server running"));