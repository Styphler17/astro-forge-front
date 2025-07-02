import mysql from 'mysql2/promise';

// MySQL Database Configuration
export const mysqlConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // Update this if you have a password set
  database: 'astro_forge_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
};

// Create connection pool
export const pool = mysql.createPool(mysqlConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL database connection failed:', error);
    return false;
  }
};

// Database utility functions
export const db = {
  // Execute a query with parameters
  query: async (sql: string, params?: unknown[]) => {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  // Execute a query and return the first row
  queryOne: async (sql: string, params?: unknown[]) => {
    try {
      const [rows] = await pool.execute(sql, params);
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  // Execute an insert query and return the insert ID
  insert: async (sql: string, params?: unknown[]) => {
    try {
      const [result] = await pool.execute(sql, params);
      return result;
    } catch (error) {
      console.error('Database insert error:', error);
      throw error;
    }
  },

  // Execute an update query
  update: async (sql: string, params?: unknown[]) => {
    try {
      const [result] = await pool.execute(sql, params);
      return result;
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  },

  // Execute a delete query
  delete: async (sql: string, params?: unknown[]) => {
    try {
      const [result] = await pool.execute(sql, params);
      return result;
    } catch (error) {
      console.error('Database delete error:', error);
      throw error;
    }
  },

  // Begin a transaction
  beginTransaction: async () => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    return connection;
  },

  // Commit a transaction
  commit: async (connection: mysql.PoolConnection) => {
    await connection.commit();
    connection.release();
  },

  // Rollback a transaction
  rollback: async (connection: mysql.PoolConnection) => {
    await connection.rollback();
    connection.release();
  }
};

export default db; 