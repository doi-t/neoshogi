<template>
  <v-container>
    <PlayerStatus />
    <PhaseDisplay />
    <GameBoard />
    <UnitInfo />
    <UnitStorage />
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
