function normalizeTitle(value) {
  return (value || '')
    .toString()
    .toLowerCase()
    .replace(/[()[\]{}'"`.,!?/\\|:;~@#$%^&*_+=-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function titleTokens(value) {
  const normalized = normalizeTitle(value)
  return normalized ? normalized.split(' ').filter(Boolean) : []
}

function tokenOverlap(left, right) {
  const leftTokens = new Set(titleTokens(left))
  const rightTokens = new Set(titleTokens(right))

  if (!leftTokens.size || !rightTokens.size) return 0

  let matches = 0
  leftTokens.forEach(token => {
    if (rightTokens.has(token)) matches += 1
  })

  return matches / Math.max(leftTokens.size, rightTokens.size)
}

export function getMediaTitles(media = {}) {
  const title = media.title || {}
  return [
    title.english,
    title.romaji,
    title.native,
    ...(media.synonyms || [])
  ].filter(Boolean)
}

export function getReleaseTitles(release = {}) {
  const names = release.names || {}
  return [
    release.displayTitle,
    release.displaySubtitle,
    names.en,
    names.original,
    names.ru,
    ...(release.searchAliases || [])
  ].filter(Boolean)
}

export function getBestTitleScore(leftTitles = [], rightTitles = []) {
  let best = 0

  leftTitles.forEach(left => {
    rightTitles.forEach(right => {
      const normalizedLeft = normalizeTitle(left)
      const normalizedRight = normalizeTitle(right)

      if (!normalizedLeft || !normalizedRight) return
      if (normalizedLeft === normalizedRight) {
        best = Math.max(best, 1)
        return
      }

      if (normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft)) {
        best = Math.max(best, 0.9)
      }

      best = Math.max(best, tokenOverlap(left, right))
    })
  })

  return best
}

export function calculateWatchedCount(watchItems = {}, release = {}) {
  const episodeIds = (release.episodes || [])
    .map(episode => Number(episode.id))
    .filter(id => Number.isFinite(id))

  return episodeIds.reduce((count, episodeId) => {
    const item = watchItems[`${release.id}:${episodeId}`]
    return item && item.isSeen === true ? count + 1 : count
  }, 0)
}

export function getEpisodesUpToProgress(release = {}, progress = 0) {
  const watchedCount = Math.max(0, Number(progress || 0))
  return (release.episodes || [])
    .filter(episode => Number(episode.id) <= watchedCount)
}

export function resolveAniListStatus({ progress = 0, total = 0, hasListEntry = false }) {
  if (total > 0 && progress >= total) return 'COMPLETED'
  if (progress > 0) return 'CURRENT'
  return hasListEntry ? 'PLANNING' : 'CURRENT'
}

export function getConflictWinner({ localProgress = 0, remoteProgress = 0 }) {
  if (remoteProgress > localProgress) return 'remote'
  if (localProgress > remoteProgress) return 'local'
  return 'equal'
}
