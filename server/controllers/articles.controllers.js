const {
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleById,
  insertArticle,
  selectArticleCount,
} = require("../models/articles.models");
const { checkExists } = require("../../utils");

exports.getAllArticles = (request, response, next) => {
  const { sort_by, order, topic, limit = 10, p = 1 } = request.query;

  const validQueryParams = ["sort_by", "order", "topic", "limit", "p"];
  const invalidQueryParams = Object.keys(request.query).filter(
    (key) => !validQueryParams.includes(key)
  );
  if (invalidQueryParams.length > 0) {
    return response.status(400).send({ message: "bad request" });
  }
  const validQueries = Object.keys(request.query).every((key) =>
    validQueryParams.includes(key)
  );

  if (!validQueries) {
    return response.status(400).send({
      message: "bad request: invalid query parameters.",
    });
  }

  const page = Number(p);
  const pageSize = Number(limit);
  const offset = (page - 1) * pageSize;

  const promises = [
    selectAllArticles(sort_by, order, topic, pageSize, offset),
    selectArticleCount(topic),
  ];
  if (topic) {
    promises.push(checkExists("topics", "slug", topic));
  }

  Promise.all(promises)
    .then(([articles, totalCount]) => {
      response
        .status(200)
        .send({ articles: articles, total_count: totalCount[0].count });
    })
    .catch((error) => {
      next(error);
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

exports.postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const comment = request.body;
  insertCommentByArticleId(article_id, comment)
    .then((insertedComment) => {
      response.status(201).send({ insertedComment: insertedComment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  const promises = [updateArticleById(article_id, inc_votes)];
  promises.push(checkExists("articles", "article_id", article_id));

  Promise.all(promises)
    .then(([updatedArticle]) => {
      response.status(200).send({ updatedArticle: updatedArticle });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postArticle = (request, response, next) => {
  const article = request.body;
  insertArticle(article)
    .then((insertedArticle) => {
      response.status(201).send({ insertedArticle: insertedArticle });
    })
    .catch((error) => {
      next(error);
    });
};

// receive the request
// extract necessary info
// invoke the model
// sends back the response
