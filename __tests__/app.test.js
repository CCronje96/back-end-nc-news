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

describe("/api/notAPath", () => {
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
        expect(topics[0]).toMatchObject({
          slug: "mitch",
          description: "The man, the Mitch, the legend",
          img_url: "",
        });
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
            expect(typeof article.comment_count).toBe("number");
          });
          expect(articles[0]).toMatchObject({
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            topic: "mitch",
            created_at: expect.any(String),
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 2,
          });
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
            expect(typeof article.comment_count).toBe("number");
          });
          expect(articles[0]).toMatchObject({
            author: "icellusedkars",
            title: "Z",
            article_id: 7,
            topic: "mitch",
            created_at: expect.any(String),
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          });
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
    test("400: Responds with bad request if order value is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=banana")
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
    test("400: Responds with bad request if either query is misspelled", () => {
      return request(app)
        .get("/api/articles?srt_by=title&order=asc")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("400: Responds with bad request if either query value is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=tootle&order=asc")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
  });
  describe("GET: topic", () => {
    test("200: Responds with an array of articles, each with expected properties, filtered by TOPIC", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles.length).toBe(1);
          articles.forEach((article) => {
            expect(article.topic).toBe("cats");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
          });
          expect(articles[0]).toMatchObject({
            author: "rogersop",
            title: "UNCOVERED: catspiracy to bring down democracy",
            article_id: 5,
            topic: "cats",
            created_at: expect.any(String),
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 2,
          });
        });
    });
    test("200: Responds with an empty array if TOPIC query provided is valid, but has no articles assigned to it", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles.length).toBe(0);
        });
    });
    test("400: Responds with bad request if topic query is misspelled", () => {
      return request(app)
        .get("/api/articles?topc=cats")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("404: Responds with not found if queried topic doesn't exist", () => {
      return request(app)
        .get("/api/articles?topic=spoons")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("not found");
        });
    });
  });
  describe("POST", () => {
    xtest("201: Creates a new article object and inserts the article into the database, responding with the inserted article object", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "It's Friday",
          topic: "paper",
          author: "lurker",
          body: "Gotta get down on Friday",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body).toMatchObject({
            insertedArticle: {
              article_id: 14,
              title: "It's Friday",
              topic: "paper",
              created_at: expect.any(String),
              author: "butter_bridge",
              body: "Gotta get down on Friday",
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          });
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
          expect(users[0]).toMatchObject({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    test("200: Responds with a user object, with the expected properties and with corresponding username as provided in parametric endpoint", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject({
            user: [
              {
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              },
            ],
          });
        });
    });
    test("404: Responds with not found when username provided is valid, but doesnt exist", () => {
      return request(app)
        .get("/api/users/butterbridge")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("not found");
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
          expect(body).toMatchObject({
            article: {
              article_id: 3,
              title: "Eight pug gifs that remind me of mitch",
              topic: "mitch",
              author: "icellusedkars",
              body: "some gifs",
              created_at: expect.any(String),
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              comment_count: 2,
            },
          });
        });
    });
    test("200: Responds with an article object, with expected properties and with corresponding article_id as provided in parametric endpoint - ADDITION of comment_count property", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article.comment_count).toBe(2);
        });
    });
    test("400: Responds with bad request when article_id provided is invalid", () => {
      return request(app)
        .get("/api/articles/three")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("404: Responds with not found when article_id provided is valid, but doesnt exist", () => {
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
          expect(body).toMatchObject({
            updatedArticle: {
              article_id: 5,
              title: "UNCOVERED: catspiracy to bring down democracy",
              topic: "cats",
              author: "rogersop",
              body: "Bastet walks amongst us, and the cats are taking arms!",
              created_at: expect.any(String),
              votes: 3,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          });
        });
    });
    test("200: Updates an article specified by article_id, responding with updated article - DECREASE votes - leaving other property values unchanged", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -46 })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject({
            updatedArticle: {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 54,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          });
        });
    });
    test("200: Responds with an unchanged article when an empty body is sent", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject({
            updatedArticle: {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          });
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
    test("400: Responds with bad request when article_id provided is invalid'", () => {
      return request(app)
        .patch("/api/articles/three")
        .send({ inc_votes: 3 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("404: Responds with not found when article_id provided is valid, but doesnt exist", () => {
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
          expect(comments[0]).toMatchObject({
            comment_id: 5,
            article_id: 1,
            body: "I hate streaming noses",
            votes: 0,
            author: "icellusedkars",
            created_at: expect.any(String),
          });
        });
    });
    test("400: Responds with bad request when article_id provided is invalid'", () => {
      return request(app)
        .get("/api/articles/three/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("404: Responds with not found when article_id provided is valid, but doesnt exist", () => {
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
          expect(body).toMatchObject({
            insertedComment: {
              comment_id: 19,
              article_id: 3,
              body: "I love using gifs, there's one for every occasion",
              votes: 0,
              created_at: expect.any(String),
              author: "butter_bridge",
            },
          });
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
    test("400: Responds with bad request when article_id provided is invalid'", () => {
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
    test("400: Responds with bad request when article_id provided is valid, but doesn't exist, which is a requirement for comment to be created", () => {
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
  describe("PATCH", () => {
    test("200: Updates a comment specified by comment_id, responding with updated comment - INCREASE votes - leaving other property values unchanged", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: 16 })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject({
            updatedComment: {
              comment_id: 2,
              article_id: 1,
              body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
              votes: 30,
              author: "butter_bridge",
              created_at: expect.any(String),
            },
          });
        });
    });
    test("200: Updates a comment specified by comment_id, responding with updated comment - DECREASE votes - leaving other property values unchanged", () => {
      return request(app)
        .patch("/api/comments/5")
        .send({ inc_votes: -50 })
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject({
            updatedComment: {
              comment_id: 5,
              article_id: 1,
              body: "I hate streaming noses",
              votes: -50,
              author: "icellusedkars",
              created_at: expect.any(String),
            },
          });
        });
    });
    test("400: Responds with bad request when request body has required properties, but with invalid values", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "three" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("400: Responds with bad request when comment_id provided is invalid'", () => {
      return request(app)
        .patch("/api/comments/three")
        .send({ inc_votes: 3 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request");
        });
    });
    test("404: Responds with not found when comment_id provided is valid, but doesnt exist", () => {
      return request(app)
        .patch("/api/comments/58")
        .send({ inc_votes: 3 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("not found");
        });
    });
  });
});
