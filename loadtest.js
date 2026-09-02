import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
};

const BASE_URL = "http://localhost:5000";
const TEST_EMAIL = "vishwashiremath93@gmail.com";
const TEST_PASSWORD = "123456";

// Runs ONCE before the load test starts — logs in once, shares the token
export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(loginRes, {
    "setup login succeeded": (r) => r.status === 200,
  });

  return { token: loginRes.json("token") };
}

// Runs repeatedly, once per VU per iteration, using the shared token
export default function (data) {
  const overviewRes = http.get(`${BASE_URL}/dashboard/finance-overview`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });

  check(overviewRes, {
    "finance-overview status is 200": (r) => r.status === 200,
  });

  sleep(1);
}