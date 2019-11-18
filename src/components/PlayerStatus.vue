<template>
  <v-container>
    <v-card>
      <v-card-title>PlayerStatus</v-card-title>
      <v-card-text>{{ playerName }} ({{ playerTurn }}) vs {{ opponentName }} ({{ opponentTurn }})</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      playerName: state => state.db.player.profile.name,
      playerTurn: state => state.db.player.action.turn,
      opponentName: state => state.db.opponent.profile.name,
      opponentTurn: state => state.db.opponent.action.turn
    })
  }
};
</script>