<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="4">
        <PlayerStatus />
      </v-col>
      <v-col cols="4">
        <UnitStorage />
      </v-col>
      <v-col cols="4">
        <PhaseDisplay />
      </v-col>
      <v-col cols="12">
        <GameBoard />
      </v-col>
      <v-col cols="12">
        <UnitInfo />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PlayerStatus from "~/components/PlayerStatus.vue";
import PhaseDisplay from "~/components/PhaseDisplay.vue";
import GameBoard from "~/components/GameBoard.vue";
import UnitInfo from "~/components/UnitInfo.vue";
import UnitStorage from "~/components/UnitStorage.vue";

export default {
  components: {
    PlayerStatus,
    PhaseDisplay,
    GameBoard,
    UnitInfo,
    UnitStorage
  }
};
</script>
