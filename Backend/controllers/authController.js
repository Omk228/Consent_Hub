import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. REGISTER USER
export const register = async (req, res) => {
  // --- YE LOGS ADD KIYE HAIN CHECK KARNE KE LIYE ---
  console.log("Incoming Request Body:", req.body); 

  // Check agar body empty hai
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ 
      message: "Bhai, server ko data nahi mila! Postman check karo." 
    });
  }

  const { name, email, password, role } = req.body;
  console.log("Received name:", name); // NEW LOG

  // Basic validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Sari fields (name, email, password, role) bharna zaroori hai!" });
  }

  try {
    console.log("Checking for existing user with email:", email);
    const [existing] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log("Existing user found:", email);
      return res.status(400).json({ message: "Email already exists!" });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed. Inserting new user into database...");

    const [result] = await pool.execute( // Capture result to get inserted ID
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    console.log("User inserted successfully. Insert ID:", result.insertId);
    const userId = result.insertId;
    const token = jwt.sign(
      { id: userId, role: role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const userResponseData = { id: userId, name, email, role }; // NEW VARIABLE FOR LOGGING
    console.log("Sending user data in response:", userResponseData); // NEW LOG

    res.status(201).json({
      message: "User registered successfully! 🚀",
      token,
      user: userResponseData // Use the new variable here
    });
  } catch (error) {
    console.error("SQL Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 2. LOGIN USER
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email aur password dono chahiye bhai!" });
  }

  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: "User not found!" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};