const db = require("../db/connection");

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COALESCE(COUNT(comments.article_id), 0) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentByArticleId = (id, comment) => {
  comment.article_id = id;
  const { article_id, body, username } = comment;
  return db
    .query(
      `INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *`,
      [article_id, body, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleById = (id, updatedValue) => {
  return db
    .query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`, [
      updatedValue,
      id,
    ])
    .then(({ rows }) => {
      return rows[0];
    });
};

// interact with DB
// necessary data manipulations
// return back to controller
