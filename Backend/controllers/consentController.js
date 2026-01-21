import pool from '../config/db.js';



// 1. Consumer Request Bhejne ka logic (Sahi tha, unchanged)

export const requestConsent = async (req, res) => {

  const consumer_id = req.user.id; 

  const { owner_id, record_id, purpose } = req.body; 



  if (!owner_id || !record_id) {

    return res.status(400).json({ message: "Owner ID ya Record ID missing hai!" });

  }



  try {

    const [result] = await pool.execute(

      'INSERT INTO consents (consumer_id, owner_id, record_id, status, purpose, created_at) VALUES (?, ?, ?, ?, ?, NOW())',

      [consumer_id, owner_id, record_id, 'PENDING', purpose || 'General Access Request']

    );

    

    res.status(201).json({ 

      message: "Request sent successfully! 🚀", 

      requestId: result.insertId 

    });



  } catch (error) {

    console.error("❌ SQL ERROR:", error.message);

    res.status(500).json({ error: "Database error: " + error.message });

  }

};



// 2. Owner requests fetch karega (Sahi tha, unchanged)

export const getPendingRequests = async (req, res) => {

  const owner_id = req.user.id; 



  try {

    const [rows] = await pool.execute(`

      SELECT 

        c.id, 

        u.name AS requester, 

        c.status,

        c.purpose,

        r.record_name,

        r.category AS dataTypes, 

        c.created_at AS requestedDate

      FROM consents c

      JOIN users u ON c.consumer_id = u.id 

      JOIN records r ON c.record_id = r.id 

      WHERE c.owner_id = ? AND c.status = 'PENDING' 

      ORDER BY c.created_at DESC

    `, [owner_id]);



    const formattedRows = rows.map(row => ({

      ...row,

      dataTypes: Array.isArray(row.dataTypes) ? row.dataTypes : [row.dataTypes]

    }));



    res.json(formattedRows);

  } catch (error) {

    console.error("❌ Fetch Error:", error.message);

    res.status(500).json({ error: error.message });

  }

};



// 2.1. Owner ki saari requests fetch karega (Access History page ke liye)

export const getAllOwnerRequests = async (req, res) => {

  const owner_id = req.user.id; 



  try {

    const [rows] = await pool.execute(`

      SELECT 

        c.id, 

        u.name AS requester, 

        c.status,

        c.purpose,

        r.record_name,

        r.category AS dataTypes, 

        c.created_at AS requestedDate

      FROM consents c

      JOIN users u ON c.consumer_id = u.id 

      JOIN records r ON c.record_id = r.id 

      WHERE c.owner_id = ? 

      ORDER BY c.created_at DESC

    `, [owner_id]);



    const formattedRows = rows.map(row => ({

      ...row,

      dataTypes: Array.isArray(row.dataTypes) ? row.dataTypes : [row.dataTypes]

    }));



    res.json(formattedRows);

  } catch (error) {

    console.error("❌ Fetch All Owner Requests Error:", error.message);

    res.status(500).json({ error: error.message });

  }

};



// 3. Approve/Reject Logic (FIXED: Column name 'timestamp')

export const updateRequestStatus = async (req, res) => {

  const { requestId, status } = req.body; 

  const owner_id = req.user.id; 



  console.log(`Backend: Updating consent - RequestID: ${requestId}, Status: ${status}, OwnerID: ${owner_id}`);

  try {

    const [result] = await pool.execute(

      'UPDATE consents SET status = ? WHERE id = ? AND owner_id = ?',

      [status, requestId, owner_id]

    );



    if (result.affectedRows === 0) {

      return res.status(404).json({ message: "Request not found or unauthorized." });

    }



    let auditDetails = `Consent ID ${requestId} status updated to ${status}`;

    if (status === 'APPROVED') {

      const expiresAt = new Date();

      expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year validity

      auditDetails += `. Valid until: ${expiresAt.toLocaleString()}`;

    }



    console.log(`Backend: Consent updated successfully. Inserting into audit logs.`);

    await pool.execute(

      'INSERT INTO audit_logs (user_id, action, details, timestamp) VALUES (?, ?, ?, NOW())',

      [owner_id, `CONSENT_${status}`, auditDetails]

    );



    res.json({ message: `Request ${status} successfully! ✅` });

  } catch (error) {

    console.error(`Backend: Error during updateRequestStatus for RequestID ${requestId}:`, error);

    console.error("❌ Update Error:", error.message);

    res.status(500).json({ error: error.message });

  }

};