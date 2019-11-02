<template>
  <v-container>
    <v-card :class="getCellColor(row, col)" class="pa-2" outlined tile @click.native="updateCell()">
      row:{{ row }}, col:{{ col }}
      <br />
      {{ getUnitStatus(row, col) }}
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["row", "col"],
  data: () => ({}),
  computed: {
    ...mapGetters({
      getUnitStatus: "db/getUnitStatus",
      getCellColor: "db/getCellColor"
    })
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