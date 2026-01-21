import pool from '../config/db.js';

// 1. Owner ko email se search karna
export const searchOwner = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const [owners] = await pool.execute(
      'SELECT id, name, email FROM users WHERE email = ? AND (role = "owner" OR role = "OWNER" OR role = "DATA_OWNER")', 
      [email]
    );
    if (owners.length === 0) return res.status(404).json({ message: "No data owner found." });
    res.json(owners[0]); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Owner ke records list karna
export const getOwnerPublicRecords = async (req, res) => {
  const { ownerId } = req.params;
  try {
    const [records] = await pool.execute(
      'SELECT id, record_name, category FROM records WHERE owner_id = ?',
      [ownerId]
    );
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Sabhi available data owners list karna
export const getAvailableOwners = async (req, res) => {
  try {
    const [owners] = await pool.execute('SELECT id, name, email FROM users WHERE role IN ("owner", "OWNER", "DATA_OWNER")');
    res.json(owners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Consumer ki apni request history (Access History Fix)
export const getMyRequests = async (req, res) => {
  const consumerId = req.user ? req.user.id : null; 
  if (!consumerId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const [requests] = await pool.execute(
      `SELECT cr.id, u.name AS ownerName, r.record_name AS recordType, 
       cr.status, cr.created_at, r.id AS recordId 
       FROM consents cr 
       JOIN users u ON cr.owner_id = u.id 
       JOIN records r ON cr.record_id = r.id 
       WHERE cr.consumer_id = ?
       ORDER BY cr.created_at DESC`,
      [consumerId]
    );
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Consumer data access request bhejnat
export const requestAccess = async (req, res) => {
  const { ownerId, recordId } = req.body; 
  const consumerId = req.user.id; 

  try {
    await pool.execute(
      'INSERT INTO consents (consumer_id, owner_id, record_id, status, purpose, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [consumerId, ownerId, recordId, 'PENDING', 'General Access Request'] 
    );
    res.status(201).json({ message: "Access request sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 6. Consumer approved record ka data dekhega
export const getRecordData = async (req, res) => {
  const { recordId } = req.params;
  const consumerId = req.user.id;

  try {
    // Pehle check karo ki consumer ke paas is record ke liye APPROVED consent hai ya nahi
    const [consents] = await pool.execute(
      'SELECT * FROM consents WHERE consumer_id = ? AND record_id = ? AND status = \'APPROVED\'',
      [consumerId, recordId]
    );

    if (consents.length === 0) {
      return res.status(403).json({ message: "Access Restricted: You do not have approved consent for this record." });
    }

    // Agar approved consent hai, toh record ka detailed data fetch karo
    const [records] = await pool.execute(
      `SELECT r.id, r.owner_id, u.name AS ownerName, r.record_name, r.category, r.content, r.status, r.created_at 
       FROM records r
       JOIN users u ON r.owner_id = u.id
       WHERE r.id = ?`,
      [recordId]
    );

    if (records.length === 0) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.json(records[0]); // Sirf pehla record return karo
  } catch (error) {
    console.error("❌ Error fetching record data:", error.message);
    res.status(500).json({ error: error.message });
  }
};