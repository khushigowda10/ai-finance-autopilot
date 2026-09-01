const request = require("supertest");
const app = require("../app");

describe("Auth routes", () => {
  test("Login with wrong password returns 401 or 404", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "nonexistent-test-user@example.com", password: "wrongpass" });

    expect([401, 404]).toContain(res.statusCode);
  });
});

describe("Protected routes", () => {
  test("Dashboard insights without token returns 401", async () => {
    const res = await request(app).get("/dashboard/insights");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("Transactions without token returns 401", async () => {
    const res = await request(app).get("/transactions");

    expect(res.statusCode).toBe(401);
  });
});

describe("Authenticated flow", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      });
    token = res.body.token;
  });

  test("Login with correct credentials returns a token", () => {
    expect(token).toBeDefined();
  });
test("Dashboard insights with valid token returns success and a source field", async () => {
  const res = await request(app)
    .get("/dashboard/insights")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(["ai", "fallback"]).toContain(res.body.data.source);
}, 15000);
});