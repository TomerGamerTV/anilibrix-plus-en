<template>
  <loader v-if="loading"/>
  <v-layout v-else class="shrink">

    <!-- Show video -->
    <!-- Show release -->
    <v-btn class="mr-1" @click="$emit('toVideo')">{{ $t('releasesActions.watchButton') }}</v-btn>
    <v-btn class="mr-1" @click="$emit('toRelease')">{{ $t('releasesActions.releaseButton') }}</v-btn>

  </v-layout>
</template>

<script>

import Loader from './components/loader'

const props = {
  loading: {
    type: Boolean,
    default: false
  },
  release: {
    type: Object,
    default: null
  }
}
export default {
  props,
  components: {
    Loader,
  },
}
</script>
