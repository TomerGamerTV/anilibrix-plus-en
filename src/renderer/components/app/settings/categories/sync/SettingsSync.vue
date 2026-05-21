<template>
  <div ref="settings">
    <div class="pa-4 caption grey--text">
      <div class="body-1">{{ $t('settings.syncTitle') }}</div>
      <div>{{ $t('settings.syncDescription') }}</div>
    </div>

    <v-card class="mt-2">
      <v-card-subtitle class="pb-0 font-weight-bold">
        <v-icon left color="primary">mdi-sync</v-icon>
        AniList
      </v-card-subtitle>

      <v-card-text class="caption">
        <div v-if="_connected">
          {{ $t('settings.syncConnectedAs', { user: userName }) }}
        </div>
        <div v-else>
          {{ $t('settings.syncTokenHint') }}
        </div>
      </v-card-text>

      <v-card-text v-if="!_connected" class="pt-0">
        <v-btn
          block
          color="primary"
          class="mb-3"
          :loading="oauthLoading"
          :disabled="!oauthConfigured"
          @click="connectOAuth">
          <v-icon left small>mdi-open-in-new</v-icon>
          {{ $t('settings.syncOAuthConnect') }}
        </v-btn>
        <div v-if="!oauthConfigured" class="caption grey--text mb-2">
          {{ $t('settings.syncOAuthUnavailable') }}
        </div>

        <div class="caption grey--text mb-2">
          {{ $t('settings.syncManualToken') }}
        </div>

        <v-text-field
          v-model="token"
          outlined
          dense
          hide-details
          type="password"
          :label="$t('settings.syncTokenLabel')">
          <template v-slot:prepend-inner>
            <v-icon color="primary">mdi-key</v-icon>
          </template>
        </v-text-field>
      </v-card-text>

      <v-list-item v-if="_connected" dense @click="_setEnabled(!_enabled)">
        <v-list-item-icon class="mr-3 my-auto">
          <v-icon>mdi-cloud-sync</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('settings.syncAutomatic') }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="mr-2 my-auto">
          <v-switch :input-value="_enabled" @change="_setEnabled"/>
        </v-list-item-action>
      </v-list-item>

      <v-card-text v-if="_lastSyncAt || _error" class="caption pt-0">
        <div v-if="_lastSyncAt">{{ $t('settings.syncLastSync', { datetime: formattedLastSync }) }}</div>
        <div v-if="_error" class="error--text">{{ _error }}</div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-if="!_connected"
          small
          color="primary"
          :loading="loading"
          :disabled="!token"
          @click="connect">
          <v-icon left small>mdi-login</v-icon>
          {{ $t('settings.syncConnect') }}
        </v-btn>

        <template v-else>
          <v-btn
            small
            color="primary"
            :loading="_status === 'syncing'"
            @click="syncNow">
            <v-icon left small>mdi-sync</v-icon>
            {{ $t('settings.syncNow') }}
          </v-btn>
          <v-spacer/>
          <v-btn small text color="error" @click="_disconnectAniList">
            <v-icon left small>mdi-logout</v-icon>
            {{ $t('settings.syncDisconnect') }}
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>

import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  data () {
    return {
      token: '',
      loading: false,
      oauthLoading: false
    }
  },

  computed: {
    ...mapState('app/sync', {
      _enabled: s => s.enabled,
      _status: s => s.status,
      _error: s => s.error,
      _lastSyncAt: s => s.lastSyncAt,
      _user: s => s.providers.anilist.user
    }),
    ...mapGetters('app/sync', { _connected: 'isConnected' }),

    userName () {
      return this.$__get(this._user, 'name') || 'AniList'
    },

    formattedLastSync () {
      return this._lastSyncAt
        ? new Intl.DateTimeFormat(undefined, {
          dateStyle: 'short',
          timeStyle: 'short'
        }).format(new Date(this._lastSyncAt))
        : ''
    },

    oauthConfigured () {
      return Boolean(process.env.ANILIST_CLIENT_ID)
    }
  },

  methods: {
    ...mapActions('app/sync', {
      _connectAniList: 'connectAniList',
      _connectAniListOAuth: 'connectAniListOAuth',
      _disconnectAniList: 'disconnectAniList',
      _setEnabled: 'setEnabled',
      _syncNow: 'syncNow'
    }),

    async connect () {
      this.loading = true

      try {
        await this._connectAniList(this.token)
        this.token = ''
      } catch (error) {
        this.$toasted.error(error.message)
      } finally {
        this.loading = false
      }
    },

    async connectOAuth () {
      this.oauthLoading = true

      try {
        await this._connectAniListOAuth()
      } catch (error) {
        this.$toasted.error(error.message)
      } finally {
        this.oauthLoading = false
      }
    },

    async syncNow () {
      try {
        await this._syncNow()
      } catch (error) {
        this.$toasted.error(error.message)
      }
    }
  }
}
</script>

<style scoped>
.my-auto {
  margin-top: auto !important;
  margin-bottom: auto !important;
}
</style>
