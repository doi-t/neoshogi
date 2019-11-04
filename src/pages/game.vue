<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="4">
        <PlayerStatus />
      </v-col>
      <v-col cols="4">
        <Storage />
      </v-col>
      <v-col cols="4">
        <PhaseDisplay />
      </v-col>
      <v-col cols="12">
        <GameBoard />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PlayerStatus from "~/components/PlayerStatus.vue";
import PhaseDisplay from "~/components/PhaseDisplay.vue";
import GameBoard from "~/components/GameBoard.vue";
import Storage from "~/components/Storage.vue";

export default {
  components: {
    PlayerStatus,
    PhaseDisplay,
    GameBoard,
    Storage
  }
};
</script>
