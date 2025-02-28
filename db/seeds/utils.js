const db = require("../../db/connection");

convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

formatFunc = (data) => {
  return data.map((item) => Object.values(item));
};

formatArticles = (articleData) => {
  return articleData.map((article) => {
    const updatedArticle = convertTimestampToDate(article);
    return [
      updatedArticle.title,
      updatedArticle.topic,
      updatedArticle.author,
      updatedArticle.body,
      updatedArticle.created_at,
      updatedArticle.votes,
      updatedArticle.article_img_url,
    ];
  });
};

createArticleLookup = (insertedArticles) => {
  const articleLookup = {};
  for (let i = 0; i < insertedArticles.length; i++) {
    articleLookup[insertedArticles[i].title] = insertedArticles[i].article_id;
  }
  return articleLookup;
};

formatComments = (commentData, insertedArticles) => {
  const articleLookup = createArticleLookup(insertedArticles);
  if (commentData.length === 0) {
    return [];
  }
  const result = commentData.map((comment) => {
    const updatedComment = convertTimestampToDate(comment);
    return {
      article_id: articleLookup[updatedComment.article_title],
      body: updatedComment.body,
      votes: updatedComment.votes,
      author: updatedComment.author,
      created_at: updatedComment.created_at,
    };
  });
  return result;
};

module.exports = {
  convertTimestampToDate,
  formatFunc,
  formatArticles,
  createArticleLookup,
  formatComments,
};
