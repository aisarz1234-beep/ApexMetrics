import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { db } from '../database.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please log in.' });
  }

  jwt.verify(token, CONFIG.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired access token.' });
    }

    const user = db.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'Authenticated user no longer exists.' });
    }

    req.user = user;
    next();
  });
};

// IDOR Prevention: Ensures requester owns the target resource or has admin privileges
export const requireResourceOwner = (getOwnerIdFn) => {
  return (req, res, next) => {
    const ownerId = getOwnerIdFn(req);
    if (!ownerId) {
      return res.status(400).json({ error: 'Target resource ID missing.' });
    }
    if (req.user.id !== ownerId) {
      return res.status(403).json({ 
        error: 'IDOR Prevention: You do not have permission to modify another athlete\'s record.' 
      });
    }
    next();
  };
};
