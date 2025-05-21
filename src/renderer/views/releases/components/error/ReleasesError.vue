<template>
  <v-layout fill-height align-center justify-center>
    <v-row justify="center" align="center">

      <v-col cols="12" sm="3" align-self="center">
        <v-img class="image" contain :src="image"/>
      </v-col>

      <v-col cols="12" sm="6" align-self="center">
        <v-card flat color="transparent">
          <v-card-title>{{ $t('releases.error.loadErrorTitle') }}</v-card-title>
          <v-card-text>
            <div>{{ $t('releases.error.connectionOrApiProblem') }}</div>
            <div>{{ $t('releases.error.tryChangingConnectionOrLater') }}</div>
          </v-card-text>
          <v-layout>
            <v-btn @click="reload">{{ $t('releases.error.retry') }}</v-btn>
          </v-layout>
        </v-card>
      </v-col>

    </v-row>
  </v-layout>
</template>

<script>

// Utils
import { mapActions } from 'vuex'

// Images
import LibriaTyan01 from '@assets/images/libria-tyan/LibriaTyan01.svg'

export default {
  data () {
    return {
      image: LibriaTyan01,
    }
  },
  methods: {
    reload () {
      window.location.reload()
    },
    ...mapActions('releases', { _getReleases: 'getReleases' }),
  }
}
</script>
