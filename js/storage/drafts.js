import { get, set } from "./db.js";

const KEY_PREFIX = "drafts:";

export async function saveDraft(sessionId, blocks) {
  if (!sessionId) {
    return null;
  }

  const key = `${KEY_PREFIX}${sessionId}`;
  await set(key, blocks);
  return blocks;
}

export async function loadDraft(sessionId) {
  if (!sessionId) {
    return [];
  }

  return (await get(`${KEY_PREFIX}${sessionId}`)) || [];
}
