import pool from '../config/db.js';

// 1. Consumer Request Bhejne ka logic
export const requestConsent = async (req, res) => {
  console.log("--- Controller Start: requestConsent ---"); //
  
  // User ID jo Auth Middleware ne Token se nikaali hai
  const consumer_id = req.user.id; //
  const { owner_id, record_id, purpose } = req.body; //

  console.log("Data to Insert:", { consumer_id, owner_id, record_id, purpose }); //

  // Validation: Check karein ki zaroori IDs aa rahi hain ya nahi
  if (!owner_id || !record_id) {
    console.log("Validation Failed: owner_id or record_id missing"); //
    return res.status(400).json({ message: "Owner ID ya Record ID missing hai!" }); //
  }

  try {
    console.log("Executing SQL Insert..."); //
    
    // Status ko manually 'PENDING' set kar rahe hain
    const [result] = await pool.execute(
      'INSERT INTO consents (consumer_id, owner_id, record_id, purpose, status) VALUES (?, ?, ?, ?, ?)',
      [consumer_id, owner_id, record_id, purpose || 'General Access', 'PENDING']
    ); //
    
    console.log("✅ Database Success! Entry ID:", result.insertId); //
    res.status(201).json({ 
      message: "Request sent successfully! 🚀", 
      requestId: result.insertId 
    }); //

  } catch (error) {
    // Agar Table name galat hai ya Column missing hai, toh yahan error dikhega
    console.error("❌ SQL ERROR IN CONTROLLER:", error.message); //
    res.status(500).json({ error: "Database error: " + error.message }); //
  }
};

// 2. Owner requests fetch karega
export const getPendingRequests = async (req, res) => {
  const { ownerId } = req.params; //
  console.log("Fetching pending requests for Owner ID:", ownerId); //
  
  try {
    const [rows] = await pool.execute(`
      SELECT consents.*, users.name as consumer_name, records.record_name 
      FROM consents 
      JOIN users ON consents.consumer_id = users.id 
      JOIN records ON consents.record_id = records.id 
      WHERE consents.owner_id = ? AND consents.status = 'PENDING'
    `, [ownerId]); //
    res.json(rows); //
  } catch (error) {
    console.error("Fetch Error:", error.message); //
    res.status(500).json({ error: error.message }); //
  }
};

// 3. Approve/Reject Logic + Audit Logging
export const updateRequestStatus = async (req, res) => {
  const { consentId, status, ownerId } = req.body; //
  console.log(`Updating Consent ${consentId} to status: ${status}`); //
  
  try {
    // A. Status update karna
    await pool.execute(
      'UPDATE consents SET status = ? WHERE id = ?',
      [status, consentId]
    ); //

    // B. Audit Log entry (Assignment requirement)
    await pool.execute(
      'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
      [ownerId, `CONSENT_${status}`, `Consent ID ${consentId} was updated to ${status}`]
    ); //

    res.json({ message: `Request ${status} and logged successfully!` }); //
  } catch (error) {
    console.error("Update Status Error:", error.message); //
    res.status(500).json({ error: error.message }); //
  }
};