import { Controller } from "../stimulus.js";

export default class extends Controller {
  connect() {
    this.currentPost = null;
    this.handlePostOpen = this.handlePostOpen.bind(this);
    window.addEventListener("post:open", this.handlePostOpen);
  }

  disconnect() {
    window.removeEventListener("post:open", this.handlePostOpen);
  }

  handlePostOpen(event) {
    this.currentPost = event.detail.post;
    this.dispatch("change", { detail: { post: this.currentPost }, prefix: "session" });
  }
}
