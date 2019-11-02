<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="8">
        <v-card>
          <v-card-title>>GameBoard</v-card-title>
          <v-btn @click="initiateGame()">initiate</v-btn>
          <v-container>
            <v-row v-for="(row, rowIndex) in cells" :key="rowIndex" no-gutters>
              <v-col v-for="(col, colIndex) in row" :key="colIndex">
                <UnitCell :row="rowIndex" :col="colIndex" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card>
          <pre>{{ cells }}</pre>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UnitCell from "~/components/UnitCell.vue";
import { mapState } from "vuex";
export default {
  name: "GameBoard",
  components: {
    UnitCell
  },
  data: () => ({
    scale: 3
  }),
  computed: {
    ...mapState({
      cells: state => state.db.gameStatus.cells
    })
  },
  async mounted(store) {
    this.$store.dispatch("db/initGame", this.scale);
  },
  methods: {
    initiateGame() {
      this.$store.dispatch("db/initGame", this.scale);
    }
  }
};
</script>