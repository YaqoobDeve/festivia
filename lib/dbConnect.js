import mongoose from "mongoose";
let isConnected = false;
async function dbConnect() {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "Festivia",   
    });
    isConnected = db.connections[0].readyState === 1;
    console.log(`✅ DB Connected: ${db.connection.db.databaseName}`);
 } catch (error) {
  console.error("Database connection failed:", error);
  throw new Error("DB_CONNECTION_FAILED"); 
}}
export default dbConnect;
 