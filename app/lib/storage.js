// src/lib/storage.js

const isBrowser = () => typeof window !== "undefined";

export const save = (key, value) => {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const load = (key) => {
  if (!isBrowser()) return null;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const remove = (key) => {
  if (!isBrowser()) return;
  localStorage.removeItem(key);
};
