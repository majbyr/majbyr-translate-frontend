const CONSENT_KEY = "majbyr.analytics.consent.v1";
const VISITOR_KEY = "majbyr.analytics.visitor.v1";

export function getAnalyticsConsent() {
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function setAnalyticsConsent(value) {
  window.localStorage.setItem(CONSENT_KEY, value);
  if (value === "denied") {
    window.localStorage.removeItem(VISITOR_KEY);
  }
}

function createVisitorId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const random = new Uint8Array(16);
  crypto.getRandomValues(random);
  return Array.from(random, byte => byte.toString(16).padStart(2, "0")).join("");
}

function getVisitorId() {
  if (getAnalyticsConsent() !== "granted") return null;
  let visitorId = window.localStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    visitorId = createVisitorId();
    window.localStorage.setItem(VISITOR_KEY, visitorId);
  }
  return visitorId;
}

export function analyticsFetch(input, init = {}) {
  const visitorId = getVisitorId();
  if (!visitorId) return fetch(input, init);
  const headers = new Headers(init.headers);
  headers.set("X-Majbyr-Client-ID", visitorId);
  return fetch(input, { ...init, headers });
}
