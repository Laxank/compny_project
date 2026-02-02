// basic user store using localStorage
const USERS_KEY = 'am_users';

function _getRawUsers() {
  const s = localStorage.getItem(USERS_KEY);
  if (!s) return [];
  try {
    return JSON.parse(s);
  } catch {
    return [];
  }
}

function _saveRawUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function createUser({ name, email, password }) {
  const users = _getRawUsers();
  const id = generateId();
  const now = Date.now();
  const user = { id, name, email, password, createdAt: now, updatedAt: now };
  users.push(user);
  _saveRawUsers(users);
  return { ...user };
}

function updateUser(id, patch) {
  const users = _getRawUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return { success: false, message: 'User not found' };

  // check potential email conflict
  if (patch.email) {
    const conflict = users.find((u) => u.email === patch.email && u.id !== id);
    if (conflict) return { success: false, message: 'Email already in use' };
  }

  users[idx] = {
    ...users[idx],
    ...patch,
    updatedAt: Date.now(),
  };
  _saveRawUsers(users);
  const { password, ...rest } = users[idx];
  return { success: true, user: rest };
}

function getUserById(id) {
  const users = _getRawUsers();
  return users.find((u) => u.id === id) || null;
}

function generateId() {
  return 'u_' + Math.random().toString(36).slice(2, 10);
}

export default {
  _getRawUsers,
  _saveRawUsers,
  createUser,
  updateUser,
  getUserById,
};