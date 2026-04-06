const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hospital",
  port: process.env.DB_PORT || 3306,
  
  // Thêm các config quan trọng
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // ✅ THÊM: Timeout cho kết nối (60 giây)
  connectTimeout: 60000,
  
  // ✅ THÊM: Timeout cho query
  acquireTimeout: 60000,
  timeout: 60000,
  
  // ✅ THÊM: Keep connection alive
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// ✅ THÊM: Hàm kiểm tra kết nối khi khởi động
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log("✅ Kết nối MySQL thành công!");
    console.log(`   Host: ${process.env.DB_HOST || "localhost"}`);
    console.log(`   Database: ${process.env.DB_NAME || "hospital"}`);
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Lỗi kết nối MySQL:", error.message);
    console.error("   Chi tiết:", {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || "hospital",
      user: process.env.DB_USER || "root",
      errorCode: error.code,
    });
    return false;
  }
}

// Export cả pool và hàm test
module.exports = { db, testConnection };
