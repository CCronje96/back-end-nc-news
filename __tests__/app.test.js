const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/notAPath", () => {
  test("ANY 404: responds with error message when path is not found", () => {
    return request(app)
      .get("/api/treasure")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("path not found");
      });
  });
});

describe("/api", () => {
  test("GET 200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("/api/topics", () => {
  test("GET 200: Responds with an array of topic objects, each with expected properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(typeof topic.slug).toBe("string");
          expect(topic).toHaveProperty("description");
          expect(typeof topic.description).toBe("string");
        });
        expect(topics[0].slug).toBe("mitch");
        expect(topics[0].description).toBe("The man, the Mitch, the legend");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: Responds with an array of article topics, each with expected properties, sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(typeof article.article_id).toBe("number");
          expect(article).toHaveProperty("author");
          expect(typeof article.author).toBe("string");
          expect(article).toHaveProperty("title");
          expect(typeof article.title).toBe("string");
          expect(article).toHaveProperty("topic");
          expect(typeof article.topic).toBe("string");
          expect(article).toHaveProperty("created_at");
          expect(typeof article.created_at).toBe("string");
          expect(article).toHaveProperty("votes");
          expect(typeof article.votes).toBe("number");
          expect(article).toHaveProperty("article_img_url");
          expect(typeof article.article_img_url).toBe("string");
          expect(article).toHaveProperty("comment_count");
          expect(typeof article.comment_count).toBe("string");
        });
        expect(articles[0].article_id).toBe(3);
        expect(articles[0].author).toBe("icellusedkars");
        expect(articles[0].title).toBe(
          "Eight pug gifs that remind me of mitch"
        );
        expect(articles[0].topic).toBe("mitch");
        expect(articles[0].created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(articles[0].votes).toBe(0);
        expect(articles[0].article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(articles[0].comment_count).toBe("2");
      });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("200: Responds with an article object, with expected properties and with corresponding article_id as provided in parametric endpoint", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article.article_id).toBe(3);
          expect(article.author).toBe("icellusedkars");
          expect(article.title).toBe("Eight pug gifs that remind me of mitch");
          expect(article.body).toBe("some gifs");
          expect(article.topic).toBe("mitch");
          expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
          expect(article.votes).toBe(0);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("400: Responds with 'bad request' when article_id provided is invalid'", () => {
      return request(app)
        .get("/api/articles/three")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("404: Responds with 'not found' when article_id provided is valid, but doesnt exist", () => {
      return request(app)
        .get("/api/articles/58")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("not found");
        });
    });
  });
  describe("PATCH", () => {
    test("200: Updates an article specified by article_id, responding with updated article - INCREASE votes - leaving other property values unchanged", () => {
      return request(app)
        .patch("/api/articles/5")
        .send({ inc_votes: 3 })
        .expect(200)
        .then(({ body }) => {
          const {
            article_id,
            title,
            topic,
            author,
            created_at,
            votes,
            article_img_url,
          } = body.updatedArticle;
          expect(votes).toBe(3);
          expect(article_id).toBe(5);
          expect(title).toBe("UNCOVERED: catspiracy to bring down democracy");
          expect(topic).toBe("cats");
          expect(author).toBe("rogersop");
          expect(created_at).toBe("2020-08-03T13:14:00.000Z");
          expect(article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("200: Updates an article specified by article_id, responding with updated article - DECREASE votes - leaving other property values unchanged", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -46 })
        .expect(200)
        .then(({ body }) => {
          const {
            article_id,
            title,
            topic,
            author,
            created_at,
            votes,
            article_img_url,
          } = body.updatedArticle;
          expect(votes).toBe(54);
          expect(article_id).toBe(1);
          expect(title).toBe("Living in the shadow of a great man");
          expect(topic).toBe("mitch");
          expect(author).toBe("butter_bridge");
          expect(created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("200: Responds with an unchanged article when an empty body is sent", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(200)
        .then(({ body }) => {
          const {
            article_id,
            title,
            topic,
            author,
            created_at,
            votes,
            article_img_url,
          } = body.updatedArticle;
          expect(votes).toBe(100);
          expect(article_id).toBe(1);
          expect(title).toBe("Living in the shadow of a great man");
          expect(topic).toBe("mitch");
          expect(author).toBe("butter_bridge");
          expect(created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test.todo(
      "400: Responds with bad request when request body does not contain required properties due to misspelling of key - to be completed and code refactored for dynamicism once sprint is done"
    );
    test("400: Responds with bad request when request body has required properties, but with invalid values", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "three" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("400: Responds with 'bad request' when article_id provided is invalid'", () => {
      return request(app)
        .patch("/api/articles/three")
        .send({ inc_votes: 3 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("404: Responds with 'not found' when article_id provided is valid, but doesnt exist", () => {
      return request(app)
        .patch("/api/articles/58")
        .send({ inc_votes: 3 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("not found");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("200: Responds with an array of comment objects for the given article_id, each with the expected properties, in descending order by date", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(comments.length).toBe(11);
          expect(comments).toBeSortedBy("created_at", { descending: true });
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
            expect(comment).toHaveProperty("comment_id");
            expect(typeof comment.comment_id).toBe("number");
            expect(comment).toHaveProperty("votes");
            expect(typeof comment.votes).toBe("number");
            expect(comment).toHaveProperty("created_at");
            expect(typeof comment.created_at).toBe("string");
            expect(comment).toHaveProperty("author");
            expect(typeof comment.author).toBe("string");
            expect(comment).toHaveProperty("body");
            expect(typeof comment.body).toBe("string");
          });
          expect(comments[0].comment_id).toBe(5);
          expect(comments[0].votes).toBe(0);
          expect(comments[0].created_at).toBe("2020-11-03T21:00:00.000Z");
          expect(comments[0].author).toBe("icellusedkars");
          expect(comments[0].body).toBe("I hate streaming noses");
        });
    });
    test("400: Responds with 'bad request' when article_id provided is invalid'", () => {
      return request(app)
        .get("/api/articles/three/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("404: Responds with 'not found' when article_id provided is valid, but doesnt exist", () => {
      return request(app)
        .get("/api/articles/58/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("not found");
        });
    });
  });
  describe("POST", () => {
    test("201: Creates a new comment object and inserts the comment into the database, responding with the inserted comment object", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          body: "I love using gifs, there's one for every occasion",
          username: "butter_bridge",
        })
        .expect(201)
        .then(({ body }) => {
          const { comment_id, article_id, author } = body.insertedComment;
          expect(comment_id).toBe(19);
          expect(article_id).toBe(3);
          expect(author).toBe("butter_bridge");
          expect(body.insertedComment.body).toBe(
            "I love using gifs, there's one for every occasion"
          );
        });
    });
    test("400: Responds with bad request when request body does not contain required properties", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          body: "I love using gifs, there's one for every occasion",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("400: Responds with bad request when request body has required properties, but with invalid values", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          body: "I love using gifs, there's one for every occasion",
          username:
            "butter_bridgebutter_bridgebutter_bridgebutter_bridgebutter_bridgebutter_bridgebutter_bridgebutter_bridgebutter_bridgebutter_bridge",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("400: Responds with bad request when request body has required properties, but with invalid values where property value is foreign key referenced from another table", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          body: "I love using gifs, there's one for every occasion",
          username: "someoneNew",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("400: Responds with 'bad request' when article_id provided is invalid'", () => {
      return request(app)
        .post("/api/articles/three/comments")
        .send({
          body: "I love using gifs, there's one for every occasion",
          username: "butter_bridge",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("400: Responds with 'bad request' when article_id provided is valid, but doesn't exist, which is a requirement for comment to be created", () => {
      return request(app)
        .post("/api/articles/58/comments")
        .send({
          body: "I love using gifs, there's one for every occasion",
          username: "butter_bridge",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("204: Deletes the given comment by comment_id", () => {
      return request(app).delete("/api/comments/5").expect(204);
    });
    test("400: Responds with bad request when given invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("404: Responds with not found when given valid comment_id which doesn't exist", () => {
      return request(app)
        .delete("/api/comments/58")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("not found");
        });
    });
  });
});
