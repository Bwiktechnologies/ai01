/**
 * Local dev auth — used when Firebase .env is not configured.
 * Only active in Vite dev mode (import.meta.env.DEV).
 */

const DEV_USERS = {
  'ashutoshshekhar37@gmail.com': {
    uid: 'dev-admin-001',
    email: 'ashutoshshekhar37@gmail.com',
    name: 'Admin Ashutosh',
    role: 'admin',
    onboardingComplete: true,
    status: 'active',
  },
  'sharma.dhruv@mca.christuniversity.in': {
    uid: 'dev-student-001',
    email: 'sharma.dhruv@mca.christuniversity.in',
    name: 'Dhruv Sharma',
    role: 'student',
    onboardingComplete: true,
    status: 'active',
  },
};

const DEV_PASSWORDS = {
  'ashutoshshekhar37@gmail.com': 'Ashutosh@1234sa',
  'sharma.dhruv@mca.christuniversity.in': 'Password@123',
};

const STORAGE_KEY = 'aisajan_dev_session';

export const isDevAuthEnabled = import.meta.env.DEV;

export const getDevSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const email = JSON.parse(raw);
    return DEV_USERS[email] ?? null;
  } catch {
    return null;
  }
};

export const devLogin = async (email, password) => {
  const normalized = email.trim().toLowerCase();
  const user = DEV_USERS[normalized];
  if (!user) {
    throw new Error('Invalid email or password. Use the admin or student dev credentials.');
  }
  if (DEV_PASSWORDS[normalized] !== password) {
    throw new Error('Invalid email or password.');
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return { ...user };
};

export const devLogout = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const DEV_CREDENTIALS_HINT = [
  { label: 'Admin', email: 'ashutoshshekhar37@gmail.com', password: 'Ashutosh@1234sa' },
  { label: 'Student', email: 'sharma.dhruv@mca.christuniversity.in', password: 'Password@123' },
];
