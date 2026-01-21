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
    console.log("Auth Middleware: JWT_SECRET used for verification:", process.env.JWT_SECRET ? "Present" : "MISSING");
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // FIX: Agar token ke andar user object hai toh use flat karke req.user mein daalna
    // Isse req.user.id hamesha accessible rahegi
    req.user = decoded.user ? decoded.user : decoded; 
    
    console.log("Auth Middleware: Token verified. Decoded user ID:", req.user.id);
    console.log("Auth Middleware: req.user after setting:", req.user);
    
    // Agle function (Controller) par bhejo
    next();
  } catch (err) {
    console.error("Auth Middleware: Token verification failed. Error details:", err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;