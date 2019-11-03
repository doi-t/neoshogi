<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card>
          <v-card-title>>GameBoard</v-card-title>
          <v-btn @click="initiateGame()">initiate</v-btn>
          <v-btn @click="resetAction()">reset</v-btn>
          <v-btn @click="moveUnit()">move a unit</v-btn>
          <v-select v-model="selectedScale" :items="scales" label="Choose a game scale"></v-select>
          <v-container>
            <v-row v-for="(row, rowIndex) in cells" :key="rowIndex" no-gutters>
              <v-col v-for="(col, colIndex) in row" :key="colIndex">
                <Cell :row="rowIndex" :col="colIndex" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card>
          <pre>{{ player }}</pre>
          <pre>{{ cells }}</pre>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Cell from "~/components/Cell.vue";
import { mapState } from "vuex";
export default {
  name: "GameBoard",
  components: {
    Cell
  },
  data: () => ({
    selectedScale: 3,
    scales: [3, 5]
  }),
  computed: {
    ...mapState({
      player: state => state.db.player,
      cells: state => state.db.gameStatus.cells
    })
  },
  async mounted(store) {
    this.$store.dispatch("db/initGame", this.selectedScale);
  },
  methods: {
    initiateGame() {
      this.$store.dispatch("db/initGame", this.selectedScale);
    },
    resetAction() {
      this.$store.dispatch("db/resetAction");
    },
    moveUnit() {
      this.$store.dispatch("db/moveUnit");
    }
  }
};
</script>