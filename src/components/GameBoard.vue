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
                <v-card class="pa-2" outlined tile @click.native="cellAction(rowIndex, colIndex)">
                  row:{{ rowIndex }}, col:{{ colIndex }}
                  <br />
                  {{ col }}
                </v-card>
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
export default {
  name: "GameBoard",
  data: () => ({
    scale: 3,
    cells: [],
    action: {
      selected: false,
      marked: false
    }
  }),
  computed: {},
  async mounted() {
    this.cells = new Array(this.scale);
    var x, y;
    for (x = 0; x < this.scale; x++) {
      this.cells[x] = new Array(this.scale);
      for (y = 0; y < this.scale; y++) {
        this.cells[x][y] = {
          position: `x:${x}, y:${y}`,
          selected: false,
          marked: false
        };
      }
    }
  },
  methods: {
    initiateGame() {
      this.selected = false;
      this.marked = false;
    },
    cellAction(row, col) {
      if (this.action.selected && this.action.marked) {
        this.action.selected = false;
        this.action.marked = false;
      }

      if (!this.action.selected) {
        var v = this.cells[row].slice(0);
        v[col].selected = true;
        this.$set(this.cells, row, v);
        this.action.selected = true;
      } else if (!this.action.marked) {
        var v = this.cells[row].slice(0);
        v[col].marked = true;
        this.$set(this.cells, row, v);
        this.action.marked = true;
      }
    }
  }
};
</script>