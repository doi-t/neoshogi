<template>
  <v-container class="pa-2">
    <v-card :class="getUnitClass()" width="48px" height="48px" :color="getUnitColor()">
      <v-row
        align="center"
        justify="center"
        v-for="(row, rowIndex) in 3"
        :key="rowIndex"
        no-gutters
      >
        <v-col class="text-center" align-self="center" v-for="(col, colIndex) in 3" :key="colIndex">
          <div
            class="justify-center align-center text-center ma-0 pa-0"
            style="font-size: 10px; width: 16px; height: 16px;"
          >{{ getMoves(rowIndex, colIndex) }}</div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Unit",
  props: ["unit"],
  computed: {
    ...mapState({
      playerName: state => state.db.player.profile.name,
      playerTurn: state => state.db.player.turn,
      opponentName: state => state.db.opponent.profile.name,
      opponentTurn: state => state.db.opponent.turn
    })
  },
  methods: {
    getUnitColor() {
      if (this.playerName === this.unit.player) return this.playerTurn;
      else if (this.opponentName === this.unit.player) return this.opponentTurn;
      else return "gray";
    },
    getUnitClass() {
      if (this.playerName === this.unit.player)
        return `${this.opponentTurn}--text pa-0`;
      else if (this.opponentName === this.unit.player)
        return `${this.playerTurn}--text pa-0`;
      else return "pa-0";
    },
    getMoves(row, col) {
      if (this.opponentName === this.unit.player) {
        return this.unit.moves[8 - (row * 3 + col)] !== 0
          ? this.unit.moves[8 - (row * 3 + col)]
          : "";
      } else {
        return this.unit.moves[row * 3 + col] !== 0
          ? this.unit.moves[row * 3 + col]
          : "";
      }
    }
  }
};
</script>