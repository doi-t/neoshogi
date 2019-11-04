<template>
  <v-container>
    <v-card>
      <v-card-title>Game Status: {{ gameStatus }}</v-card-title>
      <v-card-text>Player A's deploy/move phase</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      gameStatus: state => state.db.game.status
    })
  }
};
</script>