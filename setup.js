const request = require("supertest");
const connection = require("./configs/db");

beforeAll(async () => {
  // Any setup before all tests
});

beforeEach(async () => {
  await connection.promise().query("START TRANSACTION");
});

afterEach(async () => {
  await connection.promise().query("ROLLBACK");
});

afterAll(async () => {
  await connection.promise().end();
});

module.exports = request;
