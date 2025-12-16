module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  },
  
  // Future database config
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/befach'
  },
  
  // Future JWT config
  jwt: {
    secret: process.env.JWT_SECRET || 'development-secret-key',
    expiresIn: '7d'
  },
  
  // API rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

