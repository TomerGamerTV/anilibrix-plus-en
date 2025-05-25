<template>
  <v-select
    v-bind="{items}"
    outlined
    hide-details
    item-text="title"
    item-value="value"
    :placeholder="$t('catalogFilters.sort.placeholder')"
    :value="_value"
    @input="_setFilterValue({filter: 'sort', value: $event})">
  </v-select>
</template>

<script>

import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('catalog', { _value: s => s.filters.sort.value }),
    items () {
      return [
        {
          title: this.$t('catalogFilters.sort.byNewest'),
          value: 1
        },
        {
          title: this.$t('catalogFilters.sort.byPopularity'),
          value: 2
        },
      ]
    }
  },

  methods: {
    ...mapActions('catalog', { _setFilterValue: 'setFilterValue' })
  },

}
</script>
