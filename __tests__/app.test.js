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
      .get("/api/notAPath")
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
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
        expect(topics[0].slug).toBe("mitch");
        expect(topics[0].description).toBe("The man, the Mitch, the legend");
      });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("200: Responds with an array of articles, each with expected properties, sorted by DATE in DESC order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles.length).toBe(13);
          expect(articles).toBeSortedBy("created_at", { descending: true });
          articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
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
  describe("GET: sort_by", () => {
    test("200: Responds with an array of articles, each with expected properties, sorted by ANY valid input column in DESC order by default", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("title", { descending: true });
        });
    });
    test("400: Responds with bad request if sort_by query has invalid input column", () => {
      return request(app)
        .get("/api/articles?sort_by=tootle")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("400: Responds with bad request if sort_by query is misspelled", () => {
      return request(app)
        .get("/api/articles?srt_by=title")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
  });
  describe("GET: order", () => {
    test("200: Responds with an array of articles, each with expected properties, sorted by DATE in ASC order if specified", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles.length).toBe(13);
          expect(articles).toBeSortedBy("created_at");
          articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("string");
          });
          expect(articles[0].article_id).toBe(7);
          expect(articles[0].author).toBe("icellusedkars");
          expect(articles[0].title).toBe("Z");
          expect(articles[0].topic).toBe("mitch");
          expect(articles[0].created_at).toBe("2020-01-07T14:08:00.000Z");
          expect(articles[0].votes).toBe(0);
          expect(articles[0].article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(articles[0].comment_count).toBe("0");
        });
    });
    test("400: Responds with bad request if order query is misspelled", () => {
      return request(app)
        .get("/api/articles?sort_by=title&ordr=asc")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
  });
  describe("GET: sort_by & order", () => {
    test("200: Responds with an array of articles, each with expected properties, sorted by ANY valid input column in ASC order if specified", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("title");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("200: Responds with an array of all user objects, each with the expected properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const users = body.users;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
          expect(users[0].username).toBe("butter_bridge");
          expect(users[0].name).toBe("jonny");
          expect(users[0].avatar_url).toBe(
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          );
        });
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
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
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
