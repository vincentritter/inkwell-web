import { mockReaderContent } from "../mock_data.js";
import { getFeedEntry } from "./feeds.js";

export async function fetchReadableContent(postId) {
  const feedEntry = getFeedEntry(postId);
  if (feedEntry) {
    const title = feedEntry.title || feedEntry.summary || "Untitled";
    const html =
      feedEntry.content ||
      (feedEntry.summary ? `<p>${feedEntry.summary}</p>` : "<p>No preview available yet.</p>");
    return {
      title,
      byline: feedEntry.author || "",
      html
    };
  }

  const payload = mockReaderContent[postId];
  if (!payload) {
    return {
      title: "Untitled",
      byline: "",
      html: "<p>No preview available yet.</p>"
    };
  }

  return {
    title: payload.title,
    byline: payload.byline,
    html: payload.html
  };
}
