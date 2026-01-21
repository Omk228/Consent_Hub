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
  // Owner ID jo Auth Middleware ne Token se nikaali hai
  const owner_id = req.user.id;
  console.log("Fetching pending requests for Owner ID:", owner_id);

  try {
    const [rows] = await pool.execute(`
      SELECT 
        c.id,
        u.name AS requester, 
        'N/A' AS requesterDoctor, 
        c.status,
        c.purpose,
        JSON_ARRAY(r.category) AS dataTypes, 
        c.created_at AS requestedDate,
        DATE_ADD(c.created_at, INTERVAL 6 MONTH) AS expiresDate
      FROM consents c
      JOIN users u ON c.consumer_id = u.id 
      JOIN records r ON c.record_id = r.id 
      WHERE c.owner_id = ?
    `, [owner_id]);

    const formattedRows = rows.map(row => ({
      ...row,
      dataTypes: JSON.parse(row.dataTypes) // JSON string ko array mein parse karo
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error("Fetch Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 3. Approve/Reject Logic + Audit Logging
export const updateRequestStatus = async (req, res) => {
  const { requestId, status } = req.body;
  const owner_id = req.user.id; // Token se extract kiya gaya ID
  console.log(`Updating Consent ${requestId} to status: ${status} by Owner ID: ${owner_id}`);

  try {
    // A. Status update karna
    await pool.execute(
      'UPDATE consents SET status = ? WHERE id = ? AND owner_id = ?',
      [status, requestId, owner_id]
    );

    // B. Audit Log entry (Assignment requirement)
    await pool.execute(
      'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
      [owner_id, `CONSENT_${status}`, `Consent ID ${requestId} was updated to ${status}`]
    );

    res.json({ message: `Request ${status} and logged successfully!` });
  } catch (error) {
    console.error("Update Status Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};