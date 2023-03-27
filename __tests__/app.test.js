const request = require("supertest");
const { app } = require("../db/app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

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
