export async function publishReply({ content, in_reply_to }) {
  return { status: "mock", content, in_reply_to };
}

export async function publishHighlight({ quote, source }) {
  return { status: "mock", quote, source };
}

export async function publishPost({ title, content }) {
  return { status: "mock", title, content };
}
