<template>
  <div>
    <v-btn icon id="toolbar__settings" v-on:click="_setDrawer(!_drawer)">
      <v-icon>mdi-settings</v-icon>
    </v-btn>

    <v-tooltip left activator="#toolbar__settings">Application settings</v-tooltip>
  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('app', { _drawer: 'drawer' }),
  },

  methods: {
    ...mapActions('app', { _setDrawer: 'setDrawer' }),
  }
}
</script>
