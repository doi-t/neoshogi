<template>
  <v-card :class="getCellColor(row, col)" tile class="ma-0 pa-0" @click.native="updateCell()">
    <Unit :unit="getCell(row, col).unit" />
  </v-card>
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