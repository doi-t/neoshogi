<template>
  <v-container>
    <v-card>
      <v-card-title>PlayerStatus</v-card-title>
      <v-card-text>{{ playerName }} (you) vs guest_123 (online)</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      playerName: state => state.db.player.profile.name
    })
  }
};
</script>