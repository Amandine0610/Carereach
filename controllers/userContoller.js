const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../models/db");

exports.getUserProfile = async (req, res) => {
  const userId = req.user.id; // Decoded from JWT
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [userId]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Database error", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Database error", error });
  }
};

exports.logout = (req, res) => {
  // For stateless JWT, simply instruct the client to delete the token
  res.status(200).json({ message: "Logout successful" });
};
