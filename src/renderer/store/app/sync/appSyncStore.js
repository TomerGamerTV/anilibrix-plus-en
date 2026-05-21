import Vue from 'vue'
import __debounce from 'lodash/debounce'

import ReleaseProxy from '@proxies/release'
import SearchTransformer from '@transformers/search'
import { AniListSyncProvider } from '@proxies/sync'
import * as safeStorage from '@main/utils/safe-storage'
import { invokeAniListOAuth } from '@main/handlers/app/app-handlers'

import {
  calculateWatchedCount,
  getBestTitleScore,
  getConflictWinner,
  getEpisodesUpToProgress,
  getMediaTitles,
  getReleaseTitles,
  resolveAniListStatus
} from './syncUtils'

const SET_ENABLED = 'SET_ENABLED'
const SET_STATUS = 'SET_STATUS'
const SET_ERROR = 'SET_ERROR'
const SET_PROVIDER_STATE = 'SET_PROVIDER_STATE'
const SET_MAPPING = 'SET_MAPPING'
const ADD_QUEUED_RELEASE = 'ADD_QUEUED_RELEASE'
const CLEAR_QUEUE = 'CLEAR_QUEUE'
const SET_LAST_SYNC_AT = 'SET_LAST_SYNC_AT'
const SET_ONBOARDING_DISMISSED = 'SET_ONBOARDING_DISMISSED'
const SET_INITIALIZED = 'SET_INITIALIZED'

const PROVIDER_ID = 'anilist'
const TOKEN_STORAGE_KEY = 'sync.anilist.token'
const MATCH_THRESHOLD = 0.72

let flushQueueDebounced = null

function getProvider() {
  let token = null

  try {
    token = safeStorage.getDecrypted(TOKEN_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to read AniList token', error)
  }

  if (!token) return null

  return new AniListSyncProvider(token)
}

function findReleaseById(rootState, releaseId) {
  const id = Number(releaseId)
  const candidates = [
    rootState.release && rootState.release.data,
    ...((rootState.favorites && rootState.favorites.items) || []),
    ...(((rootState.catalog && rootState.catalog.items && rootState.catalog.items.data) || [])),
    ...((rootState.releases && rootState.releases.data) || [])
  ].filter(Boolean)

  return candidates.find(release => Number(release.id) === id) || null
}

function scoreMediaCandidate(release, media) {
  const titleScore = getBestTitleScore(getReleaseTitles(release), getMediaTitles(media))
  const releaseYear = Number(release.year || 0)
  const mediaYear = Number(media.startDate && media.startDate.year ? media.startDate.year : 0)
  const yearScore = releaseYear && mediaYear && releaseYear === mediaYear ? 0.05 : 0

  return titleScore + yearScore
}

export default {
  namespaced: true,

  state: {
    enabled: false,
    initialized: false,
    activeProvider: PROVIDER_ID,
    status: 'idle',
    error: null,
    lastSyncAt: null,
    onboardingDismissed: false,
    queue: [],
    providers: {
      anilist: {
        connected: false,
        tokenSaved: false,
        user: null
      }
    },
    mappings: {}
  },

  getters: {
    isConnected: state => state.providers.anilist.connected && state.providers.anilist.tokenSaved,
    shouldShowOnboarding: (state, getters) => state.initialized && !state.onboardingDismissed && !getters.isConnected,
    canSync: (state, getters) => state.enabled && getters.isConnected,
    getAniListMapping: state => releaseId => {
      return state.mappings[String(releaseId)] && state.mappings[String(releaseId)].anilist
        ? state.mappings[String(releaseId)].anilist
        : null
    }
  },

  mutations: {
    [SET_ENABLED]: (s, enabled) => (s.enabled = enabled),
    [SET_STATUS]: (s, status) => (s.status = status),
    [SET_ERROR]: (s, error) => (s.error = error),
    [SET_PROVIDER_STATE]: (s, payload) => {
      Vue.set(s.providers, PROVIDER_ID, {
        ...s.providers[PROVIDER_ID],
        ...payload
      })
    },
    [SET_MAPPING]: (s, { releaseId, provider, mapping }) => {
      const key = String(releaseId)
      Vue.set(s.mappings, key, {
        ...(s.mappings[key] || {}),
        [provider]: mapping
      })
    },
    [ADD_QUEUED_RELEASE]: (s, releaseId) => {
      const id = Number(releaseId)
      if (Number.isFinite(id) && !s.queue.includes(id)) s.queue.push(id)
    },
    [CLEAR_QUEUE]: s => (s.queue = []),
    [SET_LAST_SYNC_AT]: (s, value) => (s.lastSyncAt = value),
    [SET_ONBOARDING_DISMISSED]: (s, value) => (s.onboardingDismissed = value),
    [SET_INITIALIZED]: (s, value) => (s.initialized = value)
  },

  actions: {
    initialize: async ({ commit }) => {
      const provider = getProvider()
      if (!provider) {
        commit(SET_PROVIDER_STATE, {
          connected: false,
          tokenSaved: false,
          user: null
        })
        commit(SET_INITIALIZED, true)
        return
      }

      try {
        const user = await provider.getCurrentUser()
        commit(SET_PROVIDER_STATE, {
          connected: true,
          tokenSaved: true,
          user
        })
      } catch (error) {
        commit(SET_ERROR, error.message)
        commit(SET_PROVIDER_STATE, {
          connected: false,
          tokenSaved: true,
          user: null
        })
      } finally {
        commit(SET_INITIALIZED, true)
      }
    },

    connectAniList: async ({ commit }, token) => {
      const normalizedToken = (token || '').trim()
      if (!normalizedToken) throw new Error('AniList token is required')

      const provider = new AniListSyncProvider(normalizedToken)
      const user = await provider.getCurrentUser()
      const savedToken = safeStorage.setEncrypted(TOKEN_STORAGE_KEY, normalizedToken)

      if (savedToken === false) {
        throw new Error('Secure token storage is not available')
      }

      commit(SET_PROVIDER_STATE, {
        connected: true,
        tokenSaved: true,
        user
      })
      commit(SET_ERROR, null)
    },

    connectAniListOAuth: async ({ dispatch }) => {
      const token = await invokeAniListOAuth()
      return dispatch('connectAniList', token)
    },

    disconnectAniList: ({ commit }) => {
      safeStorage.remove(TOKEN_STORAGE_KEY)
      commit(SET_ENABLED, false)
      commit(SET_PROVIDER_STATE, {
        connected: false,
        tokenSaved: false,
        user: null
      })
    },

    setEnabled: ({ commit }, enabled) => commit(SET_ENABLED, Boolean(enabled)),

    setOnboardingDismissed: ({ commit }, value = true) => commit(SET_ONBOARDING_DISMISSED, Boolean(value)),

    queueRelease: ({ commit, dispatch, getters }, releaseId) => {
      if (!getters.canSync) return

      commit(ADD_QUEUED_RELEASE, releaseId)

      if (!flushQueueDebounced) {
        flushQueueDebounced = __debounce(() => dispatch('flushQueue'), 5000)
      }

      flushQueueDebounced()
    },

    flushQueue: async ({ commit, dispatch, rootState, state, getters }) => {
      if (!getters.canSync || state.queue.length === 0) return

      const releaseIds = [...state.queue]
      commit(CLEAR_QUEUE)

      await Promise.allSettled(
        releaseIds.map(releaseId => {
          const release = findReleaseById(rootState, releaseId)
          return release ? dispatch('syncRelease', release) : Promise.resolve()
        })
      )
    },

    syncNow: async ({ commit, dispatch, rootState, rootGetters }) => {
      const provider = getProvider()
      if (!provider) throw new Error('AniList is not connected')

      commit(SET_STATUS, 'syncing')
      commit(SET_ERROR, null)

      try {
        const favorites = (rootState.favorites && rootState.favorites.items) || []
        await Promise.allSettled(favorites.map(release => dispatch('syncRelease', release)))

        if (rootGetters['app/account/isAuthorized']) {
          await dispatch('importAniListFavorites')
        }

        commit(SET_LAST_SYNC_AT, new Date().toISOString())
        commit(SET_STATUS, 'idle')
      } catch (error) {
        commit(SET_ERROR, error.message)
        commit(SET_STATUS, 'error')
      }
    },

    syncRelease: async ({ dispatch, rootState, rootGetters }, release) => {
      const provider = getProvider()
      const user = rootState.app.sync.providers.anilist.user

      if (!provider || !user || !release || !release.id) return

      const mapping = await dispatch('resolveAniListMapping', release)
      if (!mapping || mapping.status !== 'resolved') return

      const localProgress = calculateWatchedCount(rootState.app.watch.items, release)
      const entry = await provider.getMediaListEntry({
        mediaId: mapping.mediaId,
        userId: user.id
      })
      const remoteProgress = Number(entry && entry.progress ? entry.progress : 0)
      const winner = getConflictWinner({ localProgress, remoteProgress })
      const total = Number((release.episodes || []).length || mapping.episodes || 0)
      const isFavorite = rootGetters['favorites/isInFavorite'](release)

      if (winner === 'remote') {
        await dispatch('app/watch/setWatchedEpisodes', {
          release_id: release.id,
          episodes: getEpisodesUpToProgress(release, remoteProgress)
        }, { root: true })
        return
      }

      if (winner === 'local' || (isFavorite && !entry)) {
        await provider.saveMediaListEntry({
          mediaId: mapping.mediaId,
          progress: localProgress,
          status: resolveAniListStatus({
            progress: localProgress,
            total,
            hasListEntry: Boolean(isFavorite || entry)
          })
        })
      }
    },

    resolveAniListMapping: async ({ commit, getters }, release) => {
      const existing = getters.getAniListMapping(release.id)
      if (existing && existing.status === 'resolved') return existing
      if (existing && existing.status === 'unresolved') return existing

      if (release.anilist && release.anilist.id) {
        const mapping = {
          status: 'resolved',
          mediaId: release.anilist.id,
          title: release.anilist.titles?.english || release.anilist.titles?.romaji || release.anilist.titles?.user_preferred || null,
          episodes: release.anilist.episodes || null,
          score: 1,
          source: 'cache'
        }

        commit(SET_MAPPING, {
          releaseId: release.id,
          provider: PROVIDER_ID,
          mapping
        })

        return mapping
      }

      const provider = getProvider()
      if (!provider) return null

      const titles = getReleaseTitles(release)
      let best = null

      for (const title of titles.slice(0, 3)) {
        let media = await provider.searchMedia({
          search: title,
          year: release.year
        })

        if (media.length === 0 && release.year) {
          media = await provider.searchMedia({ search: title })
        }

        media.forEach(candidate => {
          const score = scoreMediaCandidate(release, candidate)
          if (!best || score > best.score) {
            best = {
              media: candidate,
              score
            }
          }
        })
      }

      const mapping = best && best.score >= MATCH_THRESHOLD
        ? {
          status: 'resolved',
          mediaId: best.media.id,
          title: (best.media.title && (best.media.title.english || best.media.title.romaji)) || null,
          episodes: best.media.episodes || null,
          score: best.score
        }
        : {
          status: 'unresolved',
          reason: 'No AniList match found'
        }

      commit(SET_MAPPING, {
        releaseId: release.id,
        provider: PROVIDER_ID,
        mapping
      })

      return mapping
    },

    importAniListFavorites: async ({ rootGetters, dispatch }) => {
      const provider = getProvider()
      if (!provider || !rootGetters['app/account/isAuthorized']) return

      const currentUser = await provider.getCurrentUser()
      const entries = await provider.getViewerAnimeList({
        userId: currentUser.id,
        statuses: ['CURRENT', 'PLANNING']
      })

      for (const entry of entries.slice(0, 50)) {
        const mediaTitles = getMediaTitles(entry.media)
        const searchTitle = mediaTitles[0]
        if (!searchTitle) continue

        const localCandidates = await new ReleaseProxy().searchReleases(searchTitle)
        const releases = new SearchTransformer().fetchCollection(localCandidates || [])
        const best = releases
          .map(release => ({
            release,
            score: getBestTitleScore(getReleaseTitles(release), mediaTitles)
          }))
          .sort((left, right) => right.score - left.score)[0]

        if (!best || best.score < MATCH_THRESHOLD) continue

        if (!rootGetters['favorites/isInFavorite'](best.release)) {
          await dispatch('favorites/addToFavorites', best.release, { root: true })
        }
      }
    }
  }
}
