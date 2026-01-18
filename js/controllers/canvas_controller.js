import { Controller } from "../stimulus.js";
import { loadDraft, saveDraft } from "../storage/drafts.js";

export default class extends Controller {
  static targets = ["blocks"];

  connect() {
    this.blocks = [];
    this.activePostId = null;
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handlePostOpen = this.handlePostOpen.bind(this);
    window.addEventListener("highlight:create", this.handleHighlight);
    window.addEventListener("post:open", this.handlePostOpen);
    this.render();
  }

  disconnect() {
    window.removeEventListener("highlight:create", this.handleHighlight);
    window.removeEventListener("post:open", this.handlePostOpen);
  }

  async handlePostOpen(event) {
    const { post } = event.detail;
    this.activePostId = post?.id || null;
    this.blocks = await loadDraft(this.activePostId);
    this.render();
  }

  async handleHighlight(event) {
    const highlight = event.detail;
    if (!highlight || highlight.post_id !== this.activePostId) {
      return;
    }

    const block = {
      id: `block-${Date.now()}`,
      type: highlight.intent === "note" ? "note" : "quote",
      content: highlight.text,
      source: highlight.post_url,
      note: ""
    };

    this.blocks.unshift(block);
    await saveDraft(this.activePostId, this.blocks);
    this.render();
  }

  render() {
    if (!this.blocks.length) {
      this.blocksTarget.innerHTML = "<p class=\"canvas-empty\">Highlights and notes will appear here.</p>";
      return;
    }

    const items = this.blocks
      .map((block) => {
        const label = block.type === "note" ? "Note" : "Highlight";
        return `
          <div class="canvas-block">
            <div class="block-meta">${label}</div>
            <blockquote>${block.content}</blockquote>
            <textarea rows="2" placeholder="Add a note..."></textarea>
          </div>
        `;
      })
      .join("");

    this.blocksTarget.innerHTML = `
      <div class="canvas-title">Session Notes</div>
      ${items}
    `;
  }
}
