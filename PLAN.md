Inkwell - Client-Side App Plan (Revised)

Goals
- Build a client JS app for Micro.blog that focuses on a left timeline and a right reader.
- Timeline shows feeds with post title/summary, avatar, and date/time.
- Reader is a beautiful reading experience with highlight creation.

Tech Stack (Explicit Constraints)
- Vanilla HTML + CSS
- Stimulus JS (controllers only)
- Pico CSS (loaded via CDN on every HTML page)
- Fetch API
- IndexedDB (via a tiny helper, not a framework)
- No React
- No state management library
- No build step required initially

App Structure
/inkwell
  /index.html
  /styles/
    app.css
    reader.css
  /js/
    app.js
    mock_data.js
    api/
      auth.js
      posts.js
      content.js
      micropub.js
    controllers/
      auth_controller.js
      session_controller.js
      timeline_controller.js
      reader_controller.js
      highlight_controller.js
      canvas_controller.js
    storage/
      db.js
      highlights.js
      drafts.js

Pages (Routes)
- Single page: /index.html with progressive sections.
- Hash-based routing or view toggling.

HTML Shell (Include Stimulus + Pico)
<head>
  <!-- Pico CSS -->
  <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@2/css/pico.min.css">
  <!-- App styles -->
  <link rel="stylesheet" href="/styles/app.css">
  <link rel="stylesheet" href="/styles/reader.css">
</head>
<body>
  <main data-controller="auth session">
    <!-- sign-in -->
    <section data-auth-target="signin">
      <button data-action="auth#signin">Sign in with Micro.blog</button>
    </section>

    <!-- app -->
    <section data-auth-target="app" hidden>
      <div class="layout">
        <aside class="left-pane" data-controller="timeline">
          <div class="segments" data-timeline-target="segments">
            <button data-action="timeline#showLatest">Latest</button>
            <button data-action="timeline#showRecent">Recent</button>
            <button data-action="timeline#showFading">Fading</button>
          </div>
          <div class="timeline" data-timeline-target="list"></div>
        </aside>
        <section class="right-pane" data-controller="reader highlight canvas">
          <article class="reader" data-reader-target="content"></article>
          <section class="canvas" data-canvas-target="blocks"></section>
        </section>
      </div>
    </section>
  </main>
  <script type="module" src="/js/app.js"></script>
</body>

Core UI Layout
- Left pane: timeline of feeds and posts (scrollable).
- Right pane: reader area + highlight tools + canvas blocks for notes.
- Timeline rows include:
  - Avatar icon
  - Title or summary
  - Source name
  - Date/time
  - Background color based on age bucket

Timeline Segments
- Segment tabs at top of left sidebar: Latest | Recent | Fading.
- Timeline controller filters the same data set by age bucket and read/archive flags.

Color Buckets for Timeline Rows
- Data object in `js/mock_data.js` (or constants in `js/app.js`) with 5-6 colors.
- Example structure:
  timelineColors = {
    newest: "#F6F3E8",
    fresh: "#EDF4E3",
    recent: "#E6EEF5",
    fading: "#EDE6F5",
    old: "#F2ECEC",
    stale: "#EFEFEF"
  }
- Map color by age bucket (hours/days) when rendering.

Data Models (Plain Objects)
Post
{
  id,
  source,
  title,
  summary,
  url,
  avatar_url,
  published_at,
  is_read: false,
  is_archived: false,
  age_bucket // "newest" | "fresh" | "recent" | "fading" | "old" | "stale"
}

Highlight
{
  id,
  post_id,
  post_url,
  text,
  html,
  start_offset,
  end_offset,
  intent, // highlight | note | reply
  created_at
}

Canvas Block
{
  id,
  type, // quote | note | reply
  content,
  source,
  note
}

Mock Data (Before API)
- Create a `js/mock_data.js` file with:
  - `timelineColors` object
  - `mockPosts` array (10-20 posts)
  - `mockReaderContent` map keyed by post id
- Each post includes `is_read` and `is_archived` booleans and an `age_bucket`.
- Timeline controller reads mock data until API is available.

Controllers Overview
1. auth_controller.js
Responsibility: authentication lifecycle
- Stores access token in localStorage
- Emits auth:ready when signed in

2. session_controller.js
Responsibility: app-level coordination
- Tracks active post id and reading session
- Listens for auth:ready and post:open

3. timeline_controller.js
Responsibility: feed/timeline UI
- Targets: list, segments
- Actions: load(), showLatest(), showRecent(), showFading(), openPost(event)
- Renders posts with age-based background color
- Emits post:open with post id

4. reader_controller.js
Responsibility: readable article display
- Target: content
- Action: open({ post_id })
- Injects sanitized HTML
- Emits reader:ready

5. highlight_controller.js
Responsibility: selection and highlight creation
- Attached to reader content
- Detects selection and shows floating toolbar
- Creates highlight objects and saves locally

6. canvas_controller.js
Responsibility: right-pane canvas editor
- Targets: blocks
- Actions: addHighlight(highlight), removeBlock(), reorderBlocks(), publish()
- Maintains ordered list of blocks (quote, note, reply)

API Modules
api/auth.js
- getToken()
- saveToken()
- clearToken()

api/posts.js
- fetchTimeline({ before_id })
- fetchPostsBySource(source)

api/content.js
- fetchReadableContent(post_id)
  - returns sanitized HTML and metadata

api/micropub.js
- publishReply({ content, in_reply_to })
- publishHighlight({ quote, source })
- publishPost({ title, content })

Storage Modules (Local-First)
storage/db.js
- wraps IndexedDB with simple get/set helpers

storage/highlights.js
- saveHighlight(highlight)
- getHighlightsForPost(post_id)

storage/drafts.js
- saveDraft(session_id, blocks)
- loadDraft(session_id)
