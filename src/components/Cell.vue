<template>
  <v-container>
    <v-card :class="getCellColor(row, col)" class="pa-2" outlined tile @click.native="updateCell()">
      <br />
      {{ getCell(row, col).position }}
      <Unit :unit="getCell(row, col).unit" />
    </v-card>
  </v-container>
</template>

<script>
import Unit from "~/components/Unit.vue";
import { mapGetters } from "vuex";
export default {
  name: "Cell",
  props: ["row", "col"],
  components: { Unit },
  data: () => ({}),
  computed: {
    ...mapGetters({
      getCell: "db/getCell",
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