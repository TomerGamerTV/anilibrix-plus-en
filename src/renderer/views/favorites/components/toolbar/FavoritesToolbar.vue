<template>
  <v-layout class="shrink">

    <!-- Search -->
    <v-text-field
      solo
      clearable
      hide-details
      class="mr-2"
      placeholder="Search by featured releases ..."
      prepend-inner-icon="mdi-magnify"
      :value="search"
      @input="$emit('update:search', $event)">
    </v-text-field>

    <!-- Reload -->
    <v-btn v-bind="{loading}" class="mr-2" height="48" @click="$emit('reload')">
      <v-icon small class="mr-2">mdi-refresh</v-icon>
      <span>Refresh</span>
    </v-btn>

    <!-- Settings -->
    <v-btn v-bind="{loading}" height="48" @click="$emit('update:settings', !settings)">
      <v-icon small class="mr-2">mdi-settings</v-icon>
      <span>Settings</span>
    </v-btn>


  </v-layout>
</template>

<script>

const props = {
  search: {
    type: String,
    default: null
  },
  settings: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  }
}

export default {
  props,

}
</script>
