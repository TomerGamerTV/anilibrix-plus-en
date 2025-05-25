<template>
  <v-layout column align-center justify-center>

    <!-- Noise -->
    <blank-noise/>

    <!-- Message -->
    <div class="text-center caption" :style="{zIndex: 1}">
      <div>{{ text }}</div>
      <div>{{ error }}</div>
      <v-btn text class="mt-5" @click="toReleases">{{ $t('buttons.back') }}</v-btn>
    </div>

  </v-layout>
</template>

<script>

import BlankNoise from './components/noise'
import { toReleases } from '@utils/router/views'

const props = {
  message: {
    type: String,
    default: null,
  },
  error: {
    type: String,
    default: null
  }
}

export default {
  props,
  metaInfo () {
    return {
      title: this.$t('blankView.metaTitleVideoNotAvailable')
    }
  },
  components: {
    BlankNoise
  },

  computed: {

    /**
     * Get blank message
     *
     * @return {string}
     */
    text () {
      return this.message || this.$t('blankView.defaultErrorLoadingEpisode')
    }

  },

  methods: {

    /**
     * Go back
     *
     * @return void
     */
    toReleases,

  }

}
</script>
