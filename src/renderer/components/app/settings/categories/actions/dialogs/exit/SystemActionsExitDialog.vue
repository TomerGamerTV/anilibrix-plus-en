<template>
  <v-overlay v-if="visible" absolute opacity=".85">
    <v-dialog v-bind="{attach}" v-model="visible" hide-overlay>
      <v-card>
        <v-card-title>Exit</v-card-title>
        <v-card-subtitle class="pt-2 pb-0">Are you sure you want to exit the application?</v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-bind="{loading}" text color="red" @click="exitApp">Exit</v-btn>
          <v-btn v-bind="{loading}" text @click="visible = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-overlay>
</template>

<script>

const props = {
  attach: {
    type: HTMLDivElement,
    default: null
  }
}

export default {
  props,
  data () {
    return {
      visible: false,
      loading: false,
    }
  },

  methods: {

    /**
     * Show dialog
     *
     * @return void
     */
    showDialog () {
      this.visible = true
    },

    /**
     * Exit application
     *
     * @return void
     */
    exitApp () {
      require('@electron/remote').app.exit(0)
    }
  }

}
</script>
