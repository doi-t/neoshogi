<template>
  <v-container>
    <v-card>
      <v-card-title>Storage</v-card-title>
      <v-card-text>Units: {{ units }} / Speeds: {{ speeds }}</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      units: state => state.db.player.storage.units,
      speeds: state => state.db.player.storage.speeds
    })
  }
};
</script>