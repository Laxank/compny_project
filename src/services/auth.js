// Simple auth service backed by localStorage
import userService from './userService';

const USERS_KEY = 'am_users';
const SESSION_KEY = 'am_session';

function getUsers() {
  return userService._getRawUsers();
}

function login(email, password) {
  const users = getUsers();
  const u = users.find((x) => x.email === email);
  if (!u) return { success: false, message: 'No user with that email' };
  if (u.password !== password) return { success: false, message: 'Invalid password' };
  setSessionUser(u);
  return { success: true, user: sanitize(u) };
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
}

function register({ name, email, password }) {
  // create user
  const existing = getUsers().find((x) => x.email === email);
  if (existing) return { success: false, message: 'Email already registered' };
  const user = userService.createUser({ name, email, password });
  setSessionUser(user);
  return { success: true, user: sanitize(user) };
}

function setSessionUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  // trigger storage event for same-tab update
  window.dispatchEvent(new Event('storage'));
}

function getCurrentUser() {
  const s = localStorage.getItem(SESSION_KEY);
  if (!s) return null;
  try {
    const user = JSON.parse(s);
    return sanitize(user);
  } catch (e) {
    return null;
  }
}

function sanitize(user) {
  if (!user) return null;
  // exclude password when returning
  const { password, ...rest } = user;
  return rest;
}

export default {
  login,
  logout,
  register,
  getCurrentUser,
  setSessionUser,
};