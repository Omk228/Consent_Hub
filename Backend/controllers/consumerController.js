import pool from '../config/db.js';

// 1. Owner ko email se search karna
export const searchOwner = async (req, res) => {
  const { email } = req.query;

  // Validation: Agar email nahi bheja toh error de do
  if (!email) {
    return res.status(400).json({ message: "Email is required for search." });
  }

  try {
    const [owners] = await pool.execute(
      'SELECT id, name, email FROM users WHERE email = ? AND role = "DATA_OWNER"', // Changed role
      [email]
    );

    if (owners.length === 0) {
      return res.status(404).json({ message: "No data owner found with this email." }); // Changed message
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
      'SELECT r.id, r.record_name, r.category, u.name AS ownerName FROM records r JOIN users u ON r.owner_id = u.id WHERE r.owner_id = ?',
      [ownerId]
    );

    // Agar owner ke koi records nahi hain toh empty array jayega, crash nahi hoga
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Sabhi available data owners ko list karna
export const getAvailableOwners = async (req, res) => {
  try {
    const [owners] = await pool.execute(
      'SELECT id, name, email, category FROM users WHERE role = "OWNER"' // Assuming 'category' field in users table for owners
    );
    res.json(owners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Consumer ki apni request history list karna
export const getMyRequests = async (req, res) => {
  // Assuming user ID is available from auth middleware after authentication
  // For now, let's use a placeholder if req.user is not yet implemented
  const consumerId = req.user ? req.user.id : null; 

  if (!consumerId) {
    return res.status(401).json({ message: "Authentication required: Consumer ID not found." });
  }

  try {
    const [requests] = await pool.execute(
      'SELECT cr.id, u.name AS ownerName, r.category AS recordType, cr.status, cr.request_date AS requestedDate, r.id AS recordId FROM consumer_requests cr JOIN users u ON cr.owner_id = u.id JOIN records r ON cr.record_id = r.id WHERE cr.consumer_id = ?',
      [consumerId]
    );
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Consumer data access request send karna
export const requestAccess = async (req, res) => {
  const { ownerId, recordId } = req.body; // Assuming recordId is also sent from frontend if needed
  const consumerId = req.user ? req.user.id : null; // Assuming user ID is available from auth middleware

  if (!consumerId || !ownerId) {
    return res.status(400).json({ message: "Consumer ID aur Owner ID zaroori hain!" });
  }

  try {
    // Check if a record exists for the given ownerId (optional, but good for data integrity)
    const [records] = await pool.execute('SELECT id FROM records WHERE owner_id = ? LIMIT 1', [ownerId]);
    if (records.length === 0) {
      return res.status(404).json({ message: "No records found for this owner." });
    }
    const actualRecordId = recordId || records[0].id; // Use provided recordId or default to first found record

    // Insert the request into consumer_requests table
    await pool.execute(
      'INSERT INTO consumer_requests (consumer_id, owner_id, record_id, status, request_date) VALUES (?, ?, ?, ?, NOW())',
      [consumerId, ownerId, actualRecordId, 'PENDING'] // Default status PENDING
    );

    res.status(201).json({ message: "Access request sent successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
