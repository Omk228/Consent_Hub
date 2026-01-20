import pool from '../config/db.js';

export const getAuditLogs = async (req, res) => {
  try {
    // Audit logs fetch karenge aur user ka naam bhi join karenge transparency ke liye
    const [logs] = await pool.execute(`
      SELECT audit_logs.*, users.name as user_name 
      FROM audit_logs 
      JOIN users ON audit_logs.user_id = users.id 
      ORDER BY timestamp DESC
    `);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};