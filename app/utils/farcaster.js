/**
 * Generate a Warpcast composer URL with pre-filled text
 * @param {string} text - The text to share
 * @param {string[]} embeds - Optional array of URLs to embed
 * @returns {string} - The Warpcast composer URL
 */
export function getWarpcastShareUrl(text, embeds = []) {
  const baseUrl = 'https://warpcast.com/~/compose'
  const params = new URLSearchParams()

  params.append('text', text)

  if (embeds.length > 0) {
    embeds.forEach(url => {
      params.append('embeds[]', url)
    })
  }

  return `${baseUrl}?${params.toString()}`
}

/**
 * Generate share text for a guestbook message
 * @param {object} message - The message object
 * @param {string} appUrl - The app URL
 * @returns {string}
 */
export function getMessageShareText(message, appUrl) {
  return `Just posted on the Guest Book! 📖\n\n"${message.message}"\n\nBy ${message.name}\n\n${appUrl}`
}

/**
 * Generate share text for a todo
 * @param {object} todo - The todo object
 * @param {string} appUrl - The app URL
 * @returns {string}
 */
export function getTodoShareText(todo, appUrl) {
  const status = todo.completed ? '✅ Completed' : '📝 Todo'
  let text = `${status}: ${todo.title}\n\n`

  if (todo.description) {
    text += `${todo.description}\n\n`
  }

  text += `❤️ ${todo.likes} likes\n\n`
  text += `Check out the community todo list on Base: ${appUrl}`

  return text
}
