import pool from '../config/db.js';

// 1. Owner ko email se search karna
export const searchOwner = async (req, res) => {
  const { email } = req.query;

  // Validation: Agar email nahi bheja toh error de do
  if (!email) {
    return res.status(400).json({ message: "Bhai, search karne ke liye email toh dalo!" });
  }

  try {
    const [owners] = await pool.execute(
      'SELECT id, name, email FROM users WHERE email = ? AND role = "OWNER"',
      [email]
    );

    if (owners.length === 0) {
      return res.status(404).json({ message: "Bhai, is email ka koi owner nahi mila!" });
    }

    res.json(owners[0]); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Owner ke records list karna
export const getOwnerPublicRecords = async (req, res) => {
  const { ownerId } = req.params;

  if (!ownerId) {
    return res.status(400).json({ message: "Owner ID zaroori hai!" });
  }

  try {
    const [records] = await pool.execute(
      'SELECT id, record_name, category FROM records WHERE owner_id = ?',
      [ownerId]
    );

    // Agar owner ke koi records nahi hain toh empty array jayega, crash nahi hoga
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};