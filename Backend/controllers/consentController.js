import pool from '../config/db.js';

// 1. Owner requests fetch karega
export const getPendingRequests = async (req, res) => {
  const { ownerId } = req.params;
  try {
    const [rows] = await pool.execute(`
      SELECT consents.*, users.name as consumer_name, records.record_name 
      FROM consents 
      JOIN users ON consents.consumer_id = users.id 
      JOIN records ON consents.record_id = records.id 
      WHERE consents.owner_id = ? AND consents.status = 'PENDING'
    `, [ownerId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Approve/Reject Logic + Audit Logging
export const updateRequestStatus = async (req, res) => {
  const { consentId, status, ownerId } = req.body; // status: 'APPROVED' or 'DENIED'
  
  try {
    // A. Status update karo
    await pool.execute(
      'UPDATE consents SET status = ? WHERE id = ?',
      [status, consentId]
    );

    // B. Audit Log entry (Assignment Requirement)
    const logDetails = `Action: ${status} | Consent ID: ${consentId}`;
    await pool.execute(
      'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
      [ownerId, `CONSENT_${status}`, logDetails]
    );

    res.json({ message: `Request ${status} and logged successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};