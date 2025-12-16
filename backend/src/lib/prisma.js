// Prisma Client Instance for Prisma 7 with PostgreSQL adapter
// This file creates a single instance of Prisma Client to be reused across the app

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Create a connection pool
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client with the adapter
const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Test connection on startup
pool.connect()
  .then(client => {
    console.log('✅ Connected to Supabase PostgreSQL database');
    client.release();
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error.message);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  await pool.end();
});

module.exports = prisma;
