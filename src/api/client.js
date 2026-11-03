import { AUTH_EXPIRED, clearToken, getToken, setToken } from "./auth.js";

const WAKE_STATUSES = [502, 503, 504];
const WAKE_RETRIES = 8;
const WAKE_DELAY_MS = 6000;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The free backend sleeps when idle and needs up to a minute to wake, so reads retry until it answers.
async function fetchWithWake(url, options) {
  const canRetry = !options.method || options.method === "GET";
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!canRetry || !WAKE_STATUSES.includes(response.status) || attempt >= WAKE_RETRIES) return response;
    } catch (error) {
      if (!canRetry || attempt >= WAKE_RETRIES) throw error;
    }
    await wait(WAKE_DELAY_MS);
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetchWithWake(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
  });
  if (response.status === 401) {
    // Token missing, expired or rejected: send the user back to the login screen.
    clearToken();
    window.dispatchEvent(new Event(AUTH_EXPIRED));
  }
  if (!response.ok) {
    const error = new Error(`Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

export async function login(username, password) {
  const response = await fetch("/api/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (response.status === 429) throw new Error("Too many attempts. Wait a minute and try again.");
  if (!response.ok) throw new Error("Wrong username or password.");
  setToken((await response.json()).token);
}

export const getProducts = () => request("/products/");
export const getOrderGroups = () => request("/orders/");
export const getOrder = (id) => request(`/orders/${id}/`);
export const createOrder = (payload) =>
  request("/orders/", { method: "POST", body: JSON.stringify(payload) });
export const updateOrder = (id, payload) =>
  request(`/orders/${id}/`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteOrder = (id) => request(`/orders/${id}/`, { method: "DELETE" });
