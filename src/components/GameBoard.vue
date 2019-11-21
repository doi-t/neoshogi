<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="2">
        <v-card>
          <v-select v-model="selectedScale" :items="scales" label="Choose a game scale"></v-select>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card>
          <v-select v-model="selectedTurn" :items="blackWhite" label="Choose your turn"></v-select>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card>
          <div class="text-center justify-center align-center d-flex">
            <v-card-actions>
              <v-btn @click="initiateGame()">initiate</v-btn>
              <v-btn @click="startGame()">startGame</v-btn>
              <v-btn @click="startOfflineGame()">start Offline Game</v-btn>
              <v-btn color="#E53935">Give Up</v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-container>
            <div class="text-center justify-center align-center d-flex">
              <v-card class="pa-2">
                <v-row v-for="(row, rowIndex) in cells" :key="rowIndex" no-gutters>
                  <v-col v-for="(col, colIndex) in row" :key="colIndex">
                    <Cell :row="rowIndex" :col="colIndex" />
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card>
          <pre>{{ player }}</pre>
          <pre>{{ opponent }}</pre>
          <pre>{{ playerInAction }}</pre>
          <pre>{{ playerNotInAction }}</pre>
          <pre>{{ cells }}</pre>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Cell from "~/components/Cell.vue";
import { mapState } from "vuex";
import constants from "@/store/db/constants";
export default {
  name: "GameBoard",
  components: {
    Cell
  },
  data: () => ({
    selectedScale: 3,
    scales: [3, 5, 7, 9],
    selectedTurn: constants.GAME_TURN_BLACK,
    blackWhite: [constants.GAME_TURN_BLACK, constants.GAME_TURN_WHITE]
  }),
  computed: {
    ...mapState({
      player: state => state.db.player,
      opponent: state => state.db.opponent,
      playerInAction: state => state.db.game.playerInAction,
      playerNotInAction: state => state.db.game.playerNotInAction,
      cells: state => state.db.game.cells
    })
  },
  async mounted(store) {
    this.$store.dispatch("db/initGame", {
      scale: this.selectedScale,
      turn: this.selectedTurn
    });
  },
  methods: {
    initiateGame() {
      this.$store.dispatch("db/initGame", {
        scale: this.selectedScale,
        turn: this.selectedTurn
      });
    },
    startGame() {
      this.$store.dispatch("db/startGame", this.selectedScale);
    },
    startOfflineGame() {
      this.$store.dispatch("db/startOfflineGame", this.selectedScale);
    }
  }
};
</script>