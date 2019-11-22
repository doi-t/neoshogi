<template>
  <v-container>
    <v-card>
      <v-card-title>Game Status: {{ gameStatus }}</v-card-title>
      <v-card-text>{{ turn }}'s turn</v-card-text>
      <v-card-text>
        palyerInAction: {{ playerInAction.profile.name }}
        <br />
        {{ playerInAction.storage }}
      </v-card-text>
      <v-card-text>
        palyerNotInAction: {{ playerNotInAction.profile.name }}
        <br />
        {{ playerNotInAction.storage }}
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      gameStatus: state => state.db.game.status,
      turn: state => state.db.game.turn,
      playerInAction: state => state.db.game.playerInAction,
      playerNotInAction: state => state.db.game.playerNotInAction
    })
  }
};
</script>