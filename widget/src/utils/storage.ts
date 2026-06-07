/**
 * Local storage utilities
 */

import { ChatMessage } from "@/types/widget-types";

const SESSION_KEY = "onyx-widget-session";
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours

export interface StoredSession {
  sessionId: string;
  messages: ChatMessage[];
  timestamp: number;
}

/**
 * Save session to localStorage
 */
export function saveSession(sessionId: string, messages: ChatMessage[]): void {
  try {
    const session: StoredSession = {
      sessionId,
      messages,
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn("Failed to save session:", e);
  }
}

/**
 * Load session from localStorage
 * Returns null if session doesn't exist or has expired
 */
export function loadSession(): StoredSession | null {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;

    const session: StoredSession = JSON.parse(data);

    // Check if session has expired
    if (Date.now() - session.timestamp > SESSION_TTL) {
      clearSession();
      return null;
    }

    return session;
  } catch (e) {
    console.warn("Failed to load session:", e);
    return null;
  }
}

/**
 * Clear session from localStorage
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.warn("Failed to clear session:", e);
  }
}

/**
 * Check if a session exists
 */
export function hasSession(): boolean {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return false;

    const session: StoredSession = JSON.parse(data);

    // Check if session has expired
    if (Date.now() - session.timestamp > SESSION_TTL) {
      clearSession();
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}
