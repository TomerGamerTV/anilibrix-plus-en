<template>
  <v-dialog v-model="visible" persistent max-width="560">
    <v-card>
      <v-card-title class="text-h5">
        {{ $t('syncOnboarding.title') }}
      </v-card-title>

      <v-card-text>
        <div class="caption grey--text mb-4">
          {{ $t('syncOnboarding.description') }}
        </div>

        <v-list dense class="transparent provider-list">
          <v-list-item
            v-for="provider in providers"
            :key="provider.id"
            :disabled="provider.disabled"
            class="provider-list__item"
            :class="{
              'provider-list__item--selected': selectedProvider === provider.id,
              'provider-list__item--disabled': provider.disabled
            }"
            @click="selectedProvider = provider.id">
            <v-list-item-icon class="mr-3">
              <div
                class="provider-list__badge"
                :style="{
                  background: provider.color,
                  color: provider.textColor
                }">
                {{ provider.mark }}
              </div>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ provider.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ provider.subtitle }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon v-if="selectedProvider === provider.id" color="primary">mdi-check-circle</v-icon>
              <v-chip v-else-if="provider.disabled" x-small>{{ $t('syncOnboarding.comingSoon') }}</v-chip>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-text-field
          v-if="selectedProvider === 'anilist'"
          v-model="token"
          class="mt-3"
          outlined
          dense
          hide-details
          type="password"
          :label="$t('settings.syncTokenLabel')">
          <template v-slot:prepend-inner>
            <v-icon color="primary">mdi-key</v-icon>
          </template>
        </v-text-field>

        <div v-if="selectedProvider === 'anilist'" class="caption grey--text mt-2">
          {{ $t('settings.syncManualToken') }}
        </div>
        <div v-if="selectedProvider === 'anilist' && !oauthConfigured" class="caption grey--text mt-1">
          {{ $t('settings.syncOAuthUnavailable') }}
        </div>

        <div v-if="error" class="caption error--text mt-2">{{ error }}</div>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="skip">
          {{ $t('syncOnboarding.notNow') }}
        </v-btn>
        <v-spacer/>
        <v-btn text @click="openSettings">
          {{ $t('syncOnboarding.configureLater') }}
        </v-btn>
        <v-btn
          text
          :loading="oauthLoading"
          :disabled="selectedProvider !== 'anilist' || !oauthConfigured"
          @click="connectOAuth">
          <v-icon left small>mdi-open-in-new</v-icon>
          {{ $t('settings.syncOAuthConnect') }}
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!canConnect"
          @click="connect">
          {{ $t('settings.syncConnect') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      visible: false,
      selectedProvider: 'anilist',
      token: '',
      loading: false,
      oauthLoading: false,
      error: null
    }
  },

  computed: {
    ...mapGetters('app/sync', { _shouldShowOnboarding: 'shouldShowOnboarding' }),

    providers () {
      return [
        {
          id: 'anilist',
          title: 'AniList',
          subtitle: this.$t('syncOnboarding.anilistSubtitle'),
          mark: 'AL',
          color: '#02A9FF',
          textColor: '#001522',
          disabled: false
        },
        {
          id: 'shikimori',
          title: 'Shikimori',
          subtitle: this.$t('syncOnboarding.shikimoriSubtitle'),
          mark: 'S',
          color: '#343434',
          textColor: '#ffffff',
          disabled: true
        },
        {
          id: 'myanimelist',
          title: 'MyAnimeList',
          subtitle: this.$t('syncOnboarding.malSubtitle'),
          mark: 'MAL',
          color: '#2E51A2',
          textColor: '#ffffff',
          disabled: true
        }
      ]
    },

    canConnect () {
      return this.selectedProvider === 'anilist' && this.token.trim().length > 0
    },

    oauthConfigured () {
      return Boolean(process.env.ANILIST_CLIENT_ID)
    }
  },

  mounted () {
    this.visible = this._shouldShowOnboarding
  },

  watch: {
    _shouldShowOnboarding (value) {
      if (value) this.visible = true
    }
  },

  methods: {
    ...mapActions('app', { _setDrawer: 'setDrawer' }),
    ...mapActions('app/sync', {
      _connectAniList: 'connectAniList',
      _connectAniListOAuth: 'connectAniListOAuth',
      _setEnabled: 'setEnabled',
      _setOnboardingDismissed: 'setOnboardingDismissed'
    }),

    async connect () {
      this.loading = true
      this.error = null

      try {
        await this._connectAniList(this.token)
        await this._setEnabled(true)
        await this._setOnboardingDismissed(true)
        this.visible = false
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async connectOAuth () {
      this.oauthLoading = true
      this.error = null

      try {
        await this._connectAniListOAuth()
        await this._setEnabled(true)
        await this._setOnboardingDismissed(true)
        this.visible = false
      } catch (error) {
        this.error = error.message
      } finally {
        this.oauthLoading = false
      }
    },

    async skip () {
      await this._setOnboardingDismissed(true)
      this.visible = false
      this.$toasted.info(this.$t('syncOnboarding.settingsHint'))
    },

    async openSettings () {
      await this._setOnboardingDismissed(true)
      this.visible = false
      this._setDrawer(true)
    }
  }
}
</script>

<style scoped lang="scss">
.provider-list {
  &__item {
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    margin-bottom: 8px;
    transition: border-color 140ms ease, background-color 140ms ease;

    &--selected {
      background: rgba(2, 169, 255, 0.08);
      border-color: rgba(2, 169, 255, 0.55);
    }

    &--disabled {
      opacity: 0.58;
    }
  }

  &__badge {
    align-items: center;
    border-radius: 8px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
    display: flex;
    font-size: 11px;
    font-weight: 800;
    height: 36px;
    justify-content: center;
    letter-spacing: 0;
    min-width: 36px;
    padding: 0 6px;
  }
}
</style>
