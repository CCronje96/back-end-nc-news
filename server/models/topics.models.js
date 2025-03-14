const db = require("../../db/connection");

exports.selectAllData = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

// interact with DB
// necessary data manipulations
// return back to controller
