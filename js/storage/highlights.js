import { get, set } from "./db.js";

const KEY_PREFIX = "highlights:";

export async function saveHighlight(highlight) {
  const key = `${KEY_PREFIX}${highlight.post_id}`;
  const existing = (await get(key)) || [];
  const updated = [highlight, ...existing];
  await set(key, updated);
  return highlight;
}

export async function getHighlightsForPost(postId) {
  return (await get(`${KEY_PREFIX}${postId}`)) || [];
}
