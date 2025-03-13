const format = require("pg-format");
const db = require("./db/connection");

exports.checkExists = async (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const dbOutput = await db.query(queryStr, [value]);

  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, message: "not found" });
  }
};

exports.getValidColumns = async (tableName) => {
  try {
    const query = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = $1`;

    const result = await db.query(query, [tableName]);

    const columns = result.rows.map((row) => row.column_name);
    return columns;
  } catch (err) {
    console.error("Error fetching columns:", err);
    throw err;
  }
};
