const postgres = require("postgres");

const connectionString = process.env.SUPABASE_DATABASE_URL;

const sql = postgres(connectionString, {
  host: process.env.SUPABASE_HOST,
  port: process.env.SUPABASE_PORT,
  password: process.env.SUPABASE_PASSWORD,
  username: "postgres",
  database: "postgres",
});

module.exports = sql;
