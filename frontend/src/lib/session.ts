export type Session = { _id: string; name: string; email: string; role: string; token: string; avatar?: string };
export const SESSION_KEY = 'isoko-session';

export const getSession = (): Session | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) as Session : null;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const saveSession = (session: Session) => {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('isoko-session-change'));
};

export const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('isoko-session-change'));
};
