<template>
  <v-card>
    <v-list dense>
      <template v-for="(item, k) in settings">
        <v-divider v-if="k > 0" :key="`d:${k}`"/>
        <v-list-item :key="k" @click="item.action">
          <v-list-item-content>
            <v-list-item-title v-text="item.title" :class="item.classes"/>
          </v-list-item-content>
          <v-list-item-action class="text-right">
            <v-list-item-subtitle v-text="item.value"/>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script>

import { meta, repository } from '@package'
import { shell } from 'electron'

export default {
  computed: {

    /**
     * Get settings items
     *
     * @return array
     */
    settings () {
      return [
        {
          title: this.$t('appSettings.links.anilibria'),
          value: meta.links.anilibria,
          action: () => require('@electron/remote').shell.openExternal(meta.links.anilibria),
        },
        {
          title: this.$t('appSettings.links.supportProject'),
          value: this.$t('appSettings.links.supportProjectValue'),
          action: () => require('@electron/remote').shell.openExternal(meta.links.donate)
        },
        {
          title: this.$t('appSettings.links.unofficialTelegramChannel'),
          action: () => require('@electron/remote').shell.openExternal(meta.links.unofficial)
        },
        {
          title: this.$t('appSettings.links.telegramChannel'),
          value: '@anilibrix',
          action: () => require('@electron/remote').shell.openExternal(meta.links.telegram)
        },
        {
          title: this.$t('appSettings.links.sourceCode'),
          value: '/anilibrix',
          action: () => require('@electron/remote').shell.openExternal(repository.url)
        },
      ]
    },
  }
}

</script>
