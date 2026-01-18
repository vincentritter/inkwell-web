import { mockReaderContent } from "../mock_data.js";

export async function fetchReadableContent(postId) {
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
