<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="2">
        <v-card>
          <v-select v-model="selectedScale" :items="scales" label="Choose a game scale"></v-select>
        </v-card>
      </v-col>
      <v-col cols="10">
        <v-card>
          <v-card-actions>
            <v-btn @click="initiateGame()">initiate</v-btn>
            <v-btn @click="startGame()">startGame</v-btn>
            <v-btn @click="deployUnit()">deploy</v-btn>
            <v-btn @click="resetAction()">reset</v-btn>
            <v-btn @click="moveUnit()">move a unit</v-btn>
            <v-btn color="#E53935">Give Up</v-btn>
          </v-card-actions>
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
    scales: [3, 5, 7, 9]
  }),
  computed: {
    ...mapState({
      player: state => state.db.player,
      cells: state => state.db.game.cells
    })
  },
  async mounted(store) {
    this.$store.dispatch("db/initGame", this.selectedScale);
  },
  methods: {
    initiateGame() {
      this.$store.dispatch("db/initGame", this.selectedScale);
    },
    startGame() {
      this.$store.dispatch("db/startGame", this.selectedScale);
    },
    deployUnit() {
      this.$store.dispatch("db/deployUnit", this.selectedScale);
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