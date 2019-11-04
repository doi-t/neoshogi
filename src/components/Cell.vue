<template>
  <div class="text-center">
    <v-card
      :class="getCellColor(row, col)"
      tile
      class="ma-0 pa-0"
      @click.stop="updateCell(); openDialog()"
    >
      <Unit :unit="getCell(row, col).unit" />
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title>Unit Speed Config (Speed Stock: {{ speeds }})</v-card-title>

        <UnitConfig :row="row" :col="col" :unit="getCell(row, col).unit" />

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialog()">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Unit from "~/components/Unit.vue";
import UnitConfig from "~/components/UnitConfig.vue";
import { mapState, mapGetters } from "vuex";
export default {
  name: "Cell",
  props: ["row", "col"],
  components: { Unit, UnitConfig },
  data: () => ({
    dialog: false
  }),
  computed: {
    ...mapState({
      speeds: state => state.db.player.storage.speeds
    }),
    ...mapGetters({
      getCell: "db/getCell",
      getCellColor: "db/getCellColor"
    })
  },
  methods: {
    updateCell() {
      this.$store.dispatch("db/updateCell", { row: this.row, col: this.col });
    },
    openDialog() {
      if (this.$store.state.db.player.action.unitConfigDialog)
        this.dialog = true;
    },
    closeDialog() {
      this.$store.dispatch("db/setUnitConfigDialog", { toggle: false });
      this.dialog = false;
    }
  }
};
</script>

<style scored>
</style>