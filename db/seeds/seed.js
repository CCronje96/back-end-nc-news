const db = require("../connection");
const {
  convertTimestampToDate,
  formatFunc,
  formatArticles,
  formatComments,
} = require("../seeds/utils");
const format = require("pg-format");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics;");
    })
    .then(() => {
      return createTopics();
    })
    .then(() => {
      return createUsers();
    })
    .then(() => {
      return createArticles();
    })
    .then(() => {
      return createComments();
    })
    .then(() => {
      return insertTopics(topicData);
    })
    .then(() => {
      return insertUsers(userData);
    })
    .then(() => {
      return insertArticles(articleData);
    })
    .then((insertedArticles) => {
      return insertComments(commentData, insertedArticles);
    });
};

function createTopics() {
  return db.query(`CREATE TABLE topics(
  slug VARCHAR(40) PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  img_url VARCHAR(1000) NOT NULL)`);
}

function createUsers() {
  return db.query(`CREATE TABLE users(
  username VARCHAR(20) PRIMARY KEY, 
  name VARCHAR(40) NOT NULL,
  avatar_url VARCHAR(1000) NOT NULL)`);
}

function createArticles() {
  return db.query(`CREATE TABLE articles(
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    topic VARCHAR(40) REFERENCES topics(slug) NOT NULL,
    author VARCHAR(20) REFERENCES users(username) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000) NOT NULL)`);
}

function createComments() {
  return db.query(`CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id) NOT NULL,
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR(20) REFERENCES users(username) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
}

function insertTopics(topicData) {
  const formattedTopics = formatFunc(topicData);
  const topicsString = format(
    `INSERT INTO topics (description, slug, img_url) VALUES %L RETURNING * `,
    formattedTopics
  );
  return db.query(topicsString);
}

function insertUsers(userData) {
  const formattedUsers = formatFunc(userData);
  const usersString = format(
    `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING * `,
    formattedUsers
  );
  return db.query(usersString);
}

function insertArticles(articleData) {
  const formattedArticles = formatArticles(articleData);
  const articlesString = format(
    `INSERT INTO articles (title, topic, author, body, created_at, votes,article_img_url) VALUES %L RETURNING * `,
    formattedArticles
  );
  return db.query(articlesString);
}

function insertComments(commentData, insertedArticles) {
  const formattedComments = formatComments(commentData, insertedArticles.rows);
  const nestedCommentData = formatFunc(formattedComments);

  const commentsString = format(
    `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING * `,
    nestedCommentData
  );
  return db.query(commentsString);
}

module.exports = seed;
