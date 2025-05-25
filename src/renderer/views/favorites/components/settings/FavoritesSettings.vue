<template>
  <div>

    <!-- Seen -->
    <v-card class="mb-2">
      <v-list-item class="py-2" @click="_setSettingsShowSeen(!_show_seen)">
        <v-list-item-content>
          <v-list-item-title>{{ $t('favoritesSettings.watchedReleases.title') }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('favoritesSettings.watchedReleases.subtitle') }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-switch :input-value="_show_seen" @click="_setSettingsShowSeen"/>
        </v-list-item-action>
      </v-list-item>
    </v-card>

    <!-- Completed -->
    <v-card class="mb-2">
      <v-list-item class="py-2" @click="_setSettingsShowCompleted(!_show_completed)">
        <v-list-item-content>
          <v-list-item-title>{{ $t('favoritesSettings.onlyCompleted.title') }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('favoritesSettings.onlyCompleted.subtitle') }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-switch :input-value="_show_completed" @click="_setSettingsShowCompleted"/>
        </v-list-item-action>
      </v-list-item>
    </v-card>


    <!-- Sort -->
    <v-card class="mb-2">
      <v-list-item class="py-2">
        <v-list-item-content>
          <v-list-item-title>{{ $t('favoritesSettings.sort.title') }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('favoritesSettings.sort.subtitle') }}</v-list-item-subtitle>
          <v-select
            outlined
            hide-details
            class="mt-4"
            item-text="title"
            item-value="value"
            :placeholder="$t('favoritesSettings.sort.placeholder')"
            :items="sortItems"
            :value="_sort"
            @input="_setSettingsSort">
          </v-select>
        </v-list-item-content>
      </v-list-item>
    </v-card>


    <!-- Group -->
    <v-card>
      <v-list-item class="py-2">
        <v-list-item-content>
          <v-list-item-title>{{ $t('favoritesSettings.group.title') }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('favoritesSettings.group.subtitle') }}</v-list-item-subtitle>
          <v-select
            outlined
            hide-details
            class="mt-4"
            item-text="title"
            item-value="value"
            :placeholder="$t('favoritesSettings.group.placeholder')"
            :items="groupItems"
            :value="_group"
            @input="_setSettingsGroup">
          </v-select>
        </v-list-item-content>
      </v-list-item>
    </v-card>

  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {}
  },

  computed: {
    ...mapState('favorites', {
      _sort: s => s.settings.sort,
      _group: s => s.settings.group,
      _show_seen: s => s.settings.show_seen,
      _show_completed: s => s.settings.show_completed,
    }),
    sortItems() {
      return [
        { title: this.$t('favoritesSettings.sortOptions.byTitle'), value: 'title' },
        { title: this.$t('favoritesSettings.sortOptions.byPopularity'), value: 'rating' },
        { title: this.$t('favoritesSettings.sortOptions.byDateAddedToFavorites'), value: 'original' },
        { title: this.$t('favoritesSettings.sortOptions.byReleaseUpdateDate'), value: 'updates' }
      ];
    },
    groupItems() {
      return [
        { title: this.$t('favoritesSettings.groupOptions.noGrouping'), value: 'original' },
        { title: this.$t('favoritesSettings.groupOptions.byYears'), value: 'years' }
      ];
    }
  },

  methods: {

    ...mapActions('favorites', {
      _setSettingsSort: 'setSettingsSort',
      _setSettingsGroup: 'setSettingsGroup',
      _setSettingsShowSeen: 'setSettingsShowSeen',
      _setSettingsShowCompleted: 'setSettingsShowCompleted',
    })

  }

}
</script>
