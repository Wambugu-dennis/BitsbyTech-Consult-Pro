// src/lib/db.ts
import mysql from 'mysql2/promise';

// This is a placeholder for a global connection pool.
// In a real serverless or edge environment, you would manage connections differently.
let connectionPool: mysql.Pool | null = null;

function getDbPool() {
  if (connectionPool) {
    return connectionPool;
  }

  // Ensure environment variables are set. In a real app, you might have a config service.
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_DATABASE) {
    throw new Error('Database environment variables are not configured.');
  }

  connectionPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Recommended for Vercel/serverless environments
    // See: https://github.com/vercel/next.js/tree/canary/examples/with-mysql
    // ssl: {
    //   rejectUnauthorized: true,
    // },
  });

  return connectionPool;
}

/**
 * Executes a database query.
 * In a real application, you would add more robust error handling,
 * potentially use an ORM like Prisma or Drizzle, and handle different query types.
 *
 * @param query The SQL query string with ? placeholders.
 * @param values An array of values to be sanitized and inserted into the placeholders.
 * @returns The result of the query.
 */
export async function query(sql: string, values: any[] = []) {
  const pool = getDbPool();
  try {
    const [results] = await pool.execute(sql, values);
    return results;
  } catch (error) {
    console.error('Database Query Error:', error);
    // Depending on your error handling strategy, you might want to throw
    // a more specific error or return a structured error object.
    throw new Error('Failed to execute database query.');
  }
}

// Example of how to close the pool when the application shuts down
// This is more relevant for traditional Node.js servers.
// process.on('exit', () => {
//   if (connectionPool) {
//     console.log('Closing database connection pool.');
//     connectionPool.end();
//   }
// });
