<template>
  <v-container class="pa-2">
    <div class="text-center justify-center align-center d-flex">
      <v-card class="pa-0" width="192px" height="192px">
        <v-row v-for="(row, rowIndex) in 3" :key="rowIndex" no-gutters>
          <v-col v-for="(col, colIndex) in 3" :key="colIndex">
            <!-- one direction -->
            <template>
              <v-card>
                <div
                  class="justify-center align-center text-center"
                  style="font-size: 40px; width: 64px; height: 64px;"
                >{{ getMoves(rowIndex, colIndex) }}</div>

                <v-overlay :absolute="true" :value="true" v-if="(rowIndex*3 + colIndex) != 4">
                  <div>
                    <v-btn
                      class="ma-0 pa-0"
                      style="width: 32px; height: 32px; opacity: 0.4;"
                      @click.native="increaseSpeed(rowIndex * 3 + colIndex)"
                    >+</v-btn>
                    <v-btn
                      class="ma-0 pa-0"
                      style="width: 32px; height: 32px; opacity: 0.4;"
                      @click.native="decreaseSpeed(rowIndex * 3 + colIndex)"
                    >-</v-btn>
                  </div>
                </v-overlay>
              </v-card>
            </template>
            <!-- one direction -->
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "UnitConfig",
  props: ["row", "col", "unit"],
  computed: {
    ...mapState({
      opponentName: state => state.db.opponent.profile.name
    })
  },
  methods: {
    getMoves(row, col) {
      if (this.opponentName === this.unit.player) {
        return this.unit.moves[8 - (row * 3 + col)];
      } else {
        return this.unit.moves[row * 3 + col];
      }
    },
    increaseSpeed(direction) {
      if (this.opponentName === this.unit.player) direction = 8 - direction;
      this.$store.dispatch("db/increaseSpeed", {
        row: this.row,
        col: this.col,
        direction: direction
      });
    },
    decreaseSpeed(direction) {
      if (this.opponentName === this.unit.player) direction = 8 - direction;
      this.$store.dispatch("db/decreaseSpeed", {
        row: this.row,
        col: this.col,
        direction: direction
      });
    }
  }
};
</script>