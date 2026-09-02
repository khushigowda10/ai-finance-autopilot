import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 2,
  duration: "10s",
};

const BASE_URL = "http://localhost:5000";

export default function () {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: "wrong@example.com", password: "wrongpass" }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(res, {
    "got a response (200/401/404/429)": (r) => [200, 401, 404, 429].includes(r.status),
  });

  sleep(1);
}