import { Controller } from "../stimulus.js";
import { fetchReadableContent } from "../api/content.js";

export default class extends Controller {
  static targets = ["content", "title", "meta"];

  connect() {
    this.handlePostOpen = this.handlePostOpen.bind(this);
    window.addEventListener("post:open", this.handlePostOpen);
    this.showPlaceholder();
  }

  disconnect() {
    window.removeEventListener("post:open", this.handlePostOpen);
  }

  async handlePostOpen(event) {
    const { post } = event.detail;
    if (!post) {
      return;
    }

    this.titleTarget.textContent = post.title || "Untitled";
    this.metaTarget.textContent = `${post.source} - ${this.formatDate(post.published_at)}`;
    this.contentTarget.innerHTML = "<p class=\"loading\">Loading readable view...</p>";

    const payload = await fetchReadableContent(post.id);
    const html = payload.html || `<p>${post.summary || "No preview available yet."}</p>`;
    this.titleTarget.textContent = payload.title || post.title || "Untitled";
    this.metaTarget.textContent = payload.byline || `${post.source} - ${this.formatDate(post.published_at)}`;
    this.contentTarget.innerHTML = html;
    this.contentTarget.dataset.postId = post.id;
    this.contentTarget.dataset.postUrl = post.url;
    this.dispatch("ready", { detail: { postId: post.id }, prefix: "reader" });
  }

  showPlaceholder() {
    this.contentTarget.innerHTML = "<p class=\"loading\">Choose a post from the timeline to begin reading.</p>";
  }

  formatDate(isoDate) {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric"
    }).format(date);
  }
}
