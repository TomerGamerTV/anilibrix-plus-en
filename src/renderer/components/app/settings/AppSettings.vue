<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    right
    fixed
    temporary
    width="400"
    class="settings">

    <!-- System bar offset -->
    <system-bar-placeholder fixed/>

    <!-- Header -->
    <v-toolbar flat class="shrink" color="#363636" :class="{'mt-9': !this.isMacOnFullscreen}">
      <v-toolbar-title class="body-1">{{ $t('settings.title') }}</v-toolbar-title>
    </v-toolbar>
    <v-divider/>

    <!-- Language Switcher -->
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>{{ $t('settings.language') }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-select
          :items="languages"
          v-model="currentLanguage"
          item-text="name"
          item-value="code"
          @change="changeLanguage"
          dense
          outlined
          hide-details
          style="max-width: 150px;"
        ></v-select>
      </v-list-item-action>
    </v-list-item>
    <v-divider/>

    <!-- Categories -->
    <component
      v-for="(category, k) in categories"
      class="mb-2"
      :is="category"
      :key="k">
    </component>


    <!-- Credentials -->
    <credentials/>


  </v-navigation-drawer>
</template>

<script>

import Credentials from './components/credentials'
import PlayerSettings from './categories/player'

import SystemSettings from './categories/system'
import ActionsSettings from './categories/actions'
import DevtoolsSettings from './categories/devtools'
import AnilibriaSettings from './categories/app'

import SystemBarPlaceholder from './../systembar/placeholder'

import { AppPlatformMixin } from '@mixins/app'
import { mapActions, mapState } from 'vuex'

export default {
  mixins: [AppPlatformMixin],
  components: {
    Credentials,
    SystemBarPlaceholder
  },
  data() {
    return {
      // Languages are now dynamically generated in computed property
    };
  },
  computed: {
    ...mapState('app', { _drawer: s => s.drawer }),
    ...mapState('app/settings/system', { _devtools: s => s.devtools }),

    languages() {
      return [
        { name: this.$t('settings.languages.english'), code: 'en' },
        { name: this.$t('settings.languages.russian'), code: 'ru' },
      ];
    },

    currentLanguage: {
      get() {
        return this.$i18n.locale;
      },
      set(lang) {
        this.$i18n.locale = lang;
      }
    },

    /**
     * Get categories components
     *
     * @return Array
     */
    categories () {
      return [
        PlayerSettings,
        SystemSettings,
        ActionsSettings,
        AnilibriaSettings,
        this._devtools ? DevtoolsSettings : null
      ].filter(category => category)
    },

    drawer: {

      /**
       * Get drawer state
       *
       * @return boolean
       */
      get () {
        return !!this._drawer
      },

      /**
       * Set drawer state
       *
       * @param state
       * @return void
       */
      set (state) {
        this._setDrawer(state)
      }
    }

  },

  methods: {
    ...mapActions('app', { _setDrawer: 'setDrawer' }),
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      // Optionally, save the selected language to localStorage or Vuex store
      // localStorage.setItem('user-language', lang);
    },
  }

}
</script>

<style>
/*
  See: https://github.com/buefy/buefy/issues/2096
  See: https://stackoverflow.com/questions/14677490/blurry-text-after-using-css-transform-scale-in-chrome
*/
.v-navigation-drawer__content {
  transform: translateZ(0);
  backface-visibility: hidden;
}
</style>

<style lang="scss" scoped>
.settings {

  ::v-deep {
    .v-navigation-drawer__content {
      overflow-y: scroll;
    }
  }


  ::-webkit-scrollbar-thumb {
    background-color: black;
  }

  ::-webkit-scrollbar {
    background-color: transparent;
  }
}

</style>
