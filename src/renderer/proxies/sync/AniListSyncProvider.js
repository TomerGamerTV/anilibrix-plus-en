import axios from 'axios'
import { meta, version } from '@package'

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co'

const VIEWER_QUERY = `
query {
  Viewer {
    id
    name
    avatar {
      large
    }
  }
}
`

const SEARCH_MEDIA_QUERY = `
query ($search: String, $year: Int) {
  Page(perPage: 5) {
    media(search: $search, type: ANIME, seasonYear: $year) {
      id
      episodes
      title {
        romaji
        english
        native
      }
      synonyms
      startDate {
        year
      }
    }
  }
}
`

const SEARCH_MEDIA_WITHOUT_YEAR_QUERY = `
query ($search: String) {
  Page(perPage: 5) {
    media(search: $search, type: ANIME) {
      id
      episodes
      title {
        romaji
        english
        native
      }
      synonyms
      startDate {
        year
      }
    }
  }
}
`

const MEDIA_LIST_ENTRY_QUERY = `
query ($mediaId: Int, $userId: Int) {
  MediaList(mediaId: $mediaId, userId: $userId, type: ANIME) {
    id
    status
    progress
    media {
      id
      episodes
      title {
        romaji
        english
        native
      }
    }
  }
}
`

const SAVE_MEDIA_LIST_ENTRY_MUTATION = `
mutation ($mediaId: Int, $status: MediaListStatus, $progress: Int) {
  SaveMediaListEntry(mediaId: $mediaId, status: $status, progress: $progress) {
    id
    status
    progress
    media {
      id
    }
  }
}
`

const DELETE_MEDIA_LIST_ENTRY_MUTATION = `
mutation ($id: Int) {
  DeleteMediaListEntry(id: $id) {
    deleted
  }
}
`

const MEDIA_LIST_COLLECTION_QUERY = `
query ($userId: Int, $statusIn: [MediaListStatus]) {
  MediaListCollection(userId: $userId, type: ANIME, status_in: $statusIn) {
    lists {
      entries {
        id
        status
        progress
        media {
          id
          episodes
          title {
            romaji
            english
            native
          }
          synonyms
          startDate {
            year
          }
        }
      }
    }
  }
}
`

export default class AniListSyncProvider {
  constructor(token) {
    this.token = token
  }

  async submit(query, variables = {}) {
    const response = await axios.request({
      url: ANILIST_GRAPHQL_ENDPOINT,
      method: 'POST',
      timeout: 15000,
      data: {
        query,
        variables
      },
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${this.token}`,
        'user-agent': `${meta.name}/${version}`
      }
    })

    if (response.data && response.data.errors && response.data.errors.length > 0) {
      throw new Error(response.data.errors.map(error => error.message).join(', '))
    }

    return response.data.data
  }

  async getCurrentUser() {
    const data = await this.submit(VIEWER_QUERY)
    return data.Viewer
  }

  async authenticate() {
    return this.getCurrentUser()
  }

  async searchMedia({ search, year = null }) {
    const query = year ? SEARCH_MEDIA_QUERY : SEARCH_MEDIA_WITHOUT_YEAR_QUERY
    const variables = year ? { search, year: Number(year) } : { search }
    const data = await this.submit(query, variables)

    return data.Page.media || []
  }

  async getMediaListEntry({ mediaId, userId }) {
    try {
      const data = await this.submit(MEDIA_LIST_ENTRY_QUERY, {
        mediaId: Number(mediaId),
        userId: Number(userId)
      })

      return data.MediaList || null
    } catch (error) {
      if (/not found/i.test(error.message)) return null
      throw error
    }
  }

  async saveMediaListEntry({ mediaId, progress, status }) {
    const data = await this.submit(SAVE_MEDIA_LIST_ENTRY_MUTATION, {
      mediaId: Number(mediaId),
      progress: Number(progress || 0),
      status
    })

    return data.SaveMediaListEntry
  }

  async deleteMediaListEntry(id) {
    const data = await this.submit(DELETE_MEDIA_LIST_ENTRY_MUTATION, {
      id: Number(id)
    })

    return data.DeleteMediaListEntry
  }

  async getViewerAnimeList({ userId, statuses = ['CURRENT', 'PLANNING'] }) {
    const data = await this.submit(MEDIA_LIST_COLLECTION_QUERY, {
      userId: Number(userId),
      statusIn: statuses
    })

    return (data.MediaListCollection.lists || [])
      .reduce((entries, list) => [...entries, ...(list.entries || [])], [])
  }
}
