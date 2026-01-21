import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

export const getAuditLogs = async (req, res) => {
  console.log("--- Audit Controller: Start ---");
  
  try {
    let owner_id;

    // 1. Pehle normal tarike se ID check karo
    if (req.user && req.user.id) {
      owner_id = req.user.id;
    } else {
      // 2. BACKUP: Agar req.user lost ho gaya, toh manually token verify karo
      console.log("⚠️ Controller: req.user lost, attempting manual token extraction...");
      const authHeader = req.header('Authorization');
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        owner_id = decoded.user ? decoded.user.id : decoded.id;
      }
    }

    if (!owner_id) {
      console.error("❌ Auth Error: Could not determine User ID.");
      return res.status(401).json({ error: "Authentication failed. Please login again." });
    }

    console.log(`Backend: Fetching audit logs for owner_id: ${owner_id}`);

    // Screenshot ke exact columns (action, details, timestamp)
    const [logs] = await pool.execute(`
      SELECT 
        id, 
        action AS actionType, 
        details AS description, 
        timestamp,
        'System' AS entity,
        'Verified Owner' AS user,
        '127.0.0.1' AS ipAddress,
        'Security' AS dataType
      FROM audit_logs 
      WHERE user_id = ? 
      ORDER BY timestamp DESC
    `, [owner_id]);
    
    console.log(`Backend: Successfully fetched ${logs.length} logs.`);
    res.json(logs);

  } catch (error) {
    console.error("❌ Audit Controller Error:", error.message);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
};