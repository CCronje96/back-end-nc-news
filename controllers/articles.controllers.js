const { request } = require("../app");
const {
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
} = require("../models/articles.models");
const { checkExists } = require("../utils");

exports.getAllArticles = (request, response, next) => {
  selectAllArticles().then((articles) => {
    response.status(200).send({ articles: articles });
  });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;

  const promises = [selectArticleById(article_id)];
  promises.push(checkExists("articles", "article_id", article_id));

  Promise.all(promises)
    .then(([article]) => {
      response.status(200).send({ article: article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  const promises = [selectCommentsByArticleId(article_id)];
  promises.push(checkExists("articles", "article_id", article_id));

  Promise.all(promises)
    .then(([comments]) => {
      response.status(200).send({ comments: comments });
    })
    .catch((error) => {
      next(error);
    });
};

// receive the request
// extract necessary info
// invoke the model
// sends back the response
