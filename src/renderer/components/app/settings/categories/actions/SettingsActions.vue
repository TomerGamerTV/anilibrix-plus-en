<template>
  <div ref="settings">

    <div class="pa-4 caption grey--text">
      <div class="body-1">{{ $t('settings.actions.title') }}</div>
      <div>{{ $t('settings.actions.subtitle') }}</div>
    </div>

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


    <!-- Dialogs -->
    <template v-if="isMounted">
      <component
        v-for="(dialog,k) in dialogs"
        :is="dialog.component"
        :key="k"
        :ref="dialog.ref"
        :attach="$refs.settings">
      </component>
    </template>

  </div>
</template>

<script>

import ExitDialog from './dialogs/exit'
import CacheDialog from './dialogs/cache'
import { invokeShowConfig } from '@main/handlers/app/appHandlers'

export default {
  data () {
    return {
      isMounted: false,
    }
  },

  computed: {

    /**
     * Get settings items
     *
     * @return array
     */
    settings () {
      return [
        {
          title: this.$t('settings.actions.reloadApp'),
          value: this.shortcuts['reload'],
          action: () => require('@electron/remote').getCurrentWindow().reload(),
        },
        {
          title: this.$t('settings.actions.showConfigFile'),
          value: '',
          action: () => invokeShowConfig(),
        },
        {
          title: this.$t('settings.actions.minimizeApp'),
          value: this.shortcuts['minimize'],
          action: () => require('@electron/remote').getCurrentWindow().minimize(),
        },
        {
          title: this.$t('settings.actions.closeApp'),
          value: this.shortcuts['close'],
          action: () => this.$refs.exit[0].showDialog(),
        },
        {
          title: this.$t('settings.actions.resetCache'),
          action: () => this.$refs.cache[0].showDialog(),
        }
      ]
    },

    /**
     * Get dialogs
     *
     * @return Array
     */
    dialogs () {
      return [
        {
          component: ExitDialog,
          ref: 'exit'
        },
        {
          component: CacheDialog,
          ref: 'cache'
        }
      ]
    },

    /**
     * Get actions shortcuts
     *
     * @return {object}
     */
    shortcuts () {
      return {
        'close': process.platform === 'darwin' ? this.$t('settings.actions.shortcuts.closeMac') : this.$t('settings.actions.shortcuts.closeWin'),
        'reload': process.platform === 'darwin' ? this.$t('settings.actions.shortcuts.reloadMac') : this.$t('settings.actions.shortcuts.reloadWin'),
        'minimize': process.platform === 'darwin' ? this.$t('settings.actions.shortcuts.minimizeMac') : this.$t('settings.actions.shortcuts.minimizeWin'),
        'fullscreen': process.platform === 'darwin' ? this.$t('settings.actions.shortcuts.fullscreenMac') : this.$t('settings.actions.shortcuts.fullscreenWin'),
      }
    }

  },

  mounted () {
    this.isMounted = true
  }

}
</script>
