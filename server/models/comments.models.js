const db = require("../../db/connection");

exports.deleteCommentById = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
};

exports.updateCommentById = (id, changeValue) => {
  if (!changeValue) {
    return db
      .query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
      .then(({ rows }) => {
        return rows[0];
      });
  } else {
    return db
      .query(
        `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
        [changeValue, id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
};
