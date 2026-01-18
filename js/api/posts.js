import { mockPosts } from "../mock_data.js";

export async function fetchTimeline() {
  return [...mockPosts];
}

export async function fetchPostsBySource(source) {
  return mockPosts.filter((post) => post.source === source);
}
