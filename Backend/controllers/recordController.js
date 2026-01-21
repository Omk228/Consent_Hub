import pool from '../config/db.js';

export const addRecord = async (req, res) => {
  const { record_name, category, content } = req.body;
  const owner_id = req.user.id; // Token se extract kiya gaya ID

  try {
    const [result] = await pool.execute(
      'INSERT INTO records (owner_id, record_name, category, content) VALUES (?, ?, ?, ?)',
      [owner_id, record_name, category || 'General', JSON.stringify(content)]
    );
    res.status(201).json({ message: "Record added successfully! ✅", id: result.insertId });
  } catch (error) {
    console.error("Record Add Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getMyRecords = async (req, res) => {
  const owner_id = req.user.id;
  try {
    const [rows] = await pool.execute(
      'SELECT id, record_name as name, category, content, created_at as created, created_at as lastAccessed, 0 as activeConsents FROM records WHERE owner_id = ?',
      [owner_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { record_name, category, content } = req.body;
  const owner_id = req.user.id;

  try {
    const [result] = await pool.execute(
      'UPDATE records SET record_name = ?, category = ?, content = ? WHERE id = ? AND owner_id = ?',
      [record_name, category || 'General', JSON.stringify(content), id, owner_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found or unauthorized" });
    }
    res.status(200).json({ message: "Record updated successfully! ✅" });
  } catch (error) {
    console.error("Record Update Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteRecord = async (req, res) => {
  const { id } = req.params;
  const owner_id = req.user.id;

  try {
    const [result] = await pool.execute(
      'DELETE FROM records WHERE id = ? AND owner_id = ?',
      [id, owner_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found or unauthorized" });
    }
    res.status(200).json({ message: "Record deleted successfully! ✅" });
  } catch (error) {
    console.error("Record Delete Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
