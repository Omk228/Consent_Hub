import pool from '../config/db.js';

export const getAuditLogs = async (req, res) => {
  const owner_id = req.user.id; // Logged-in user ki ID
  try {
    // FIXED: WHERE clause add kiya + Columns ko Dashboard icons se match karne ke liye rename kiya
    const [logs] = await pool.execute(`
      SELECT 
        al.id, 
        al.action AS type, 
        al.details AS description, 
        al.timestamp AS time,
        u.name as user_name 
      FROM audit_logs al
      JOIN users u ON al.user_id = u.id 
      WHERE al.user_id = ?
      ORDER BY al.timestamp DESC
    `, [owner_id]);
    
    res.json(logs);
  } catch (error) {
    console.error("❌ Audit Fetch Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};