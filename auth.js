// auth.js
import jwt from 'jsonwebtoken';

const secretKey = 'VlLCJpYXQiOjE3MDE2OTk0MzMsImV4cCI6MTcwMTcwMzAzM30.1sR1U6uNDE0cGB7Pb-Di-nBeiRgpMN3Jog4aduTlY4o'; // Replace with your actual secret key

// Middleware to check for admin authentication
export const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing Token' });
  }

  try {
    // Remove 'Bearer ' from the token if present
    const tokenWithoutBearer = token.replace('Bearer ', '');

    const decoded = jwt.verify(tokenWithoutBearer, secretKey);

    if (decoded.isAdmin) {
      next(); // Allow access if the user is an admin
    } else {
      throw new Error();
    }
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden - Not an Admin' });
  }
};

// Function to generate admin JWT (replace with your actual authentication logic)
export const generateAdminToken = (username, password) => {
  // Dummy admin credentials for demonstration purposes
  const adminCredentials = {
    username: 'admin',
    password: 'adminpassword',
    isAdmin: true,
  };

  // Check admin credentials (replace with your actual authentication logic)
  if (username === adminCredentials.username && password === adminCredentials.password) {
    // Issue a JWT with an isAdmin claim
    const token = jwt.sign({ isAdmin: true }, secretKey, { expiresIn: '1h' });
    return { success: true, token };
  } else {
    return { success: false, error: 'Invalid credentials' };
  }
};
