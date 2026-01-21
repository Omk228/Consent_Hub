import jwt from 'jsonwebtoken';

// Maine function ka naam 'authMiddleware' kar diya hai taaki export ke saath match ho
const authMiddleware = (req, res, next) => {
  console.log("--- Auth Middleware: Checking Request ---");
  
  // 1. Header se token nikalna
  const authHeader = req.header('Authorization'); 
  console.log("Auth Middleware: Authorization header:", authHeader ? "Received" : "MISSING");
  
  if (!authHeader) {
    console.log("Auth Middleware: No Authorization header found.");
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 2. Bearer part split karna
  const token = authHeader.split(' ')[1]; 
  console.log("Auth Middleware: Extracted token:", token ? "Token present" : "No token after split");

  if (!token) {
    console.log("Auth Middleware: Invalid token format.");
    return res.status(401).json({ message: 'Invalid token format, authorization denied' });
  }

  // 3. Verify token
  try {
    console.log("Auth Middleware: Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("Auth Middleware: Token verified. Decoded user ID:", decoded.id);
    
    // Request object mein user data daalna taaki Controller use kar sake
    req.user = decoded; 
    
    // Agle function (Controller) par bhejo
    next();
  } catch (err) {
    console.error("Auth Middleware: Token verification failed:", err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Ab ye ReferenceError nahi dega
export default authMiddleware;