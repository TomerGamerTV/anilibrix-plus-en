<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="290"
  >
    <v-card>
      <v-card-title className="text-h5">
        WARNING
      </v-card-title>
      <v-card-text>
        Do you really want to remove the snapshot?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :loading="loading"
          color="green darken-1"
          text
          v-on:click="deleteSnapshot"
        >
          Yes
        </v-btn>
        <v-btn
          :loading="loading"
          color="green darken-1"
          text
          v-on:click="visible = false"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { catGirlFetch } from '@utils/fetch'
export default {
  data () {
    return {
      visible: false,
      loading: false,
      id: null
    }
  },
  computed: {
    ...mapState('app/account', {
      _session: s => s.session
    }),
  },
  methods: {
    deleteSnapshot: async function () {
      this.loading = true
      await catGirlFetch(process.env.EXT_API_SERVER + '/snapshot/' + this.id, {
        method: 'DELETE',
        headers: {
          'x-session': this._session
        }
      })
        .then(({ success, error }) => {
          if (success) {
            return this.$emit('fetchSnapshots')
          } else this.$toasted.show(error, { type: 'error' })
        })
        .catch((error) => this.$toasted.show(error, { type: 'error' }))
      this.loading = false
      this.hideDialog()
    },

    hideDialog () {
      this.visible = false
      this.id = null
    },
    /**
     * Show dialog
     *
     * @return void
     */
    showDialog (id) {
      this.visible = true
      this.id = id
    }
  }

}
</script>
