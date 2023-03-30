const request = require("supertest");
const { app } = require("../db/app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { string } = require("pg-format");

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("GET: /api/topics", () => {
  it("200: GET responds with all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("GET: /api/articles", () => {
  it("200: GET responds with an array of article objects, sorted in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
});

describe("GET: /api/articles_id", () => {
  it("200: GET responds with specific article object using article_id", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveLength(1);
        article.forEach((article) => {
          expect(article).toMatchObject({
            article_id: 4,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });

  it("400: GET invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("404: GET responds with correct error msg for valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/78")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: GET responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: 5,
            created_at: expect.any(String),
          });
        });
      });
  });
  it("200: GET responds with an empty array when queried by an article_id that exists, but no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  it("400: GET invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("404: GET responds with correct error msg for valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/78/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
});

describe("GET: All file paths", () => {
  it("404: GET responds with error message when requested invalid file path", () => {
    return request(app)
      .get("/api/toopics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid file path!");
      });
  });
});

describe.only("PATCH: /api/articles/article_id", () => {
  it("200: PATCH responds with updated article object for positive integer", () => {
    const patchUpdate = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/4")
      .send(patchUpdate)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: expect.any(String),
          votes: 50,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("200: PATCH responds with updated article object for negative integer", () => {
    const patchUpdate = { inc_votes: -250 };
    return request(app)
      .patch("/api/articles/1")
      .send(patchUpdate)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: -150,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  //it("400L PATCH responds with ");
});
