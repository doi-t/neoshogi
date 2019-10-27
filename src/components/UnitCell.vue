<template>
  <v-container>
    <v-card class="pa-2" outlined tile @click.native="updateCell()">
      row:{{ row }}, col:{{ col }}
      <br />
      {{ unitStatus }}
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: ["row", "col"],
  computed: {
    unitStatus() {
      return this.$store.state.db.gameStatus.cells[this.row][this.col];
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