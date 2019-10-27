<template>
  <v-container>
    <v-card :class="cellColor" class="pa-2" outlined tile @click.native="updateCell()">
      row:{{ row }}, col:{{ col }}
      <br />
      {{ unitStatus }}
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: ["row", "col"],
  data: () => ({}),
  computed: {
    cellColor() {
      if (this.$store.state.db.gameStatus.cells[this.row][this.col].selected)
        return "red";
      if (this.$store.state.db.gameStatus.cells[this.row][this.col].marked)
        return "green";
      return "blue";
    },
    unitStatus() {
      return this.$store.state.db.gameStatus.cells[this.row][this.col];
    },
    selected() {
      return { active: this.$store.state.db.player.selected };
    },
    marked() {
      return this.$store.state.db.player.marked;
    }
  },
  methods: {
    updateCell() {
      this.$store.dispatch("db/updateCell", { row: this.row, col: this.col });
    }
  }
};
</script>

<style scored>
</style>