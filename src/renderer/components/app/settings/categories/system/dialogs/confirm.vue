<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="500"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ $t('dialogs.warningTitle') }}
      </v-card-title>
      <v-card-text>

        <p>{{ $t('snapshotDialogs.consent.dataTransferConsent') }}</p>

        <p class="mt-1" v-html="$t('snapshotDialogs.consent.passwordDisclaimer')"></p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          v-on:click="$emit('openSnapshots')"
        >
          {{ $t('buttons.agree') }}
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          v-on:click="visible = false"
        >
          {{ $t('buttons.noThanks') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      loading: false,
    }
  },
  methods: {
    hideDialog () {
      this.visible = false
    },
    /**
     * Show dialog
     *
     * @return void
     */
    showDialog () {
      this.visible = true
    }
  }

}
</script>
