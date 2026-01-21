import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  console.log("Auth Middleware: Checking request..."); // NEW LOG
  // Get token from header
  const authHeader = req.header('Authorization'); 
  console.log("Auth Middleware: Authorization header:", authHeader); // NEW LOG
  
  if (!authHeader) {
    console.log("Auth Middleware: No Authorization header found."); // NEW LOG
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  console.log("Auth Middleware: Extracted token:", token ? "Token present" : "No token after split"); // NEW LOG

  // Check if no token after splitting
  if (!token) {
    console.log("Auth Middleware: Invalid token format."); // NEW LOG
    return res.status(401).json({ message: 'Invalid token format, authorization denied' });
  }

  // Verify token
  try {
    console.log("Auth Middleware: Verifying token..."); // NEW LOG
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth Middleware: Token verified. Decoded user:", decoded); // NEW LOG
    req.user = decoded; // Set user from token payload
    next();
  } catch (err) {
    console.error("Auth Middleware: Token verification failed:", err.message); // NEW LOG
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;