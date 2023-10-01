const mongoose = require("mongoose");
require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");

const { DB_HOST_TEST, PORT } = process.env;

describe("test login router", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(() => {});

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test login with correct data", async () => {
    const registerData = {
      email: "masha@gmail.com",
      password: "123456",
    };

    await request(app).post("/api/users/register").send(registerData);

    const { email, subscription } = await User.findOne({
      email: registerData.email,
    });

    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(registerData);
    expect(statusCode).toBe(200);
    expect(body.token).toBeDefined();
    expect(body.token).not.toBe("");
    expect(body.token).not.toBeUndefined();
    expect(body.token).not.toBeNull();
    expect(body.user).toEqual({ email, subscription });
  });
});
