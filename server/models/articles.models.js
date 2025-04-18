const db = require("../../db/connection");
const { getValidColumns } = require("../../utils");

exports.selectAllArticles = async (sort_by, order, topic, limit, offset) => {
  let queryValue = [];
  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COALESCE(COUNT(comments.article_id), 0)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    queryValue.push(topic);
    queryString += `WHERE topic = $1 `;
  }

  queryString += `GROUP BY articles.article_id `;

  const table = "articles";
  const validColumns = await getValidColumns(table);

  const validComputedColumns = ["comment_count"];

  const allValidColumns = [...validColumns, ...validComputedColumns];

  const validOrderValues = ["asc", "desc"];
  const isInvalidOrder = order && !validOrderValues.includes(order);
  const isInvalidSortBy = sort_by && !allValidColumns.includes(sort_by);

  if (isInvalidOrder || isInvalidSortBy) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const validSortBy = sort_by || "created_at";
  const validOrder = validOrderValues.includes(order) ? order : "desc";

  queryString += `ORDER BY ${validSortBy} ${validOrder} LIMIT $${
    queryValue.length + 1
  } OFFSET $${queryValue.length + 2}`;

  queryValue.push(limit, offset);

  return db.query(queryString, queryValue).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleCount = async (topic) => {
  let queryValue = [];
  let queryString = `SELECT COUNT(*) FROM articles `;

  if (topic) {
    queryValue.push(topic);
    queryString += `WHERE topic = $1`;
  }

  return db.query(queryString, queryValue).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COALESCE(COUNT(comments.article_id), 0)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
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

exports.updateArticleById = (id, changeValue) => {
  if (!changeValue) {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
      .then(({ rows }) => {
        return rows[0];
      });
  } else {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
        [changeValue, id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
};

exports.insertArticle = (article) => {
  const { title, topic, author, body, article_img_url } = article;
  return db
    .query(
      `INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, topic, author, body, article_img_url]
    )
    .then(({ rows }) => {
      const article_id = rows[0].article_id;
      return this.selectArticleById(article_id);
    })
    .then((output) => {
      return output;
    });
};

// interact with DB
// necessary data manipulations
// return back to controller
