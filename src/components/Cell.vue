<template>
  <div class="text-center">
    <v-card
      :class="getCellColor(row, col)"
      tile
      class="ma-0 pa-0"
      @click.stop="updateCell(); openDialog(row, col)"
      :disabled="checkTurn()"
    >
      <div>{{ row }}:{{ col }}({{ getCell(row, col).position.row }}:{{ getCell(row, col).position.col }})</div>

      <Unit :unit="getCell(row, col).unit" />
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title>Unit Speed Config (Speed Stock: {{ speeds }})</v-card-title>

        <UnitConfig :row="row" :col="col" :unit="getCell(row, col).unit" />

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="secondary" text @click="cancelSpeedUp()" :disabled="isInitPhase()">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialog()" :disabled="isSpeedUp()">Speed Up</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Unit from "~/components/Unit.vue";
import UnitConfig from "~/components/UnitConfig.vue";
import { mapState, mapGetters } from "vuex";
import constants from "@/store/db/constants";
export default {
  name: "Cell",
  props: ["row", "col"],
  components: { Unit, UnitConfig },
  data: () => ({
    dialog: false
  }),
  computed: {
    ...mapState({
      speeds: state => state.db.game.playerInAction.storage.speeds,
      gamePhase: state => state.db.game.status,
      unitConfigDialog: state =>
        state.db.game.playerInAction.action.unitConfigDialog,
      playerTurn: state => state.db.game.playerInAction.action.turn,
      gameTurn: state => state.db.game.turn,
      speedUp: state => state.db.game.playerInAction.action.speedUp
    }),
    ...mapGetters({
      getCell: "db/getCell",
      getCellColor: "db/getCellColor"
    })
  },
  methods: {
    checkTurn() {
      return this.playerTurn === this.gameTurn ? false : true;
    },
    isInitPhase() {
      return this.gamePhase === constants.GAME_STATUS_INIT ? true : false;
    },
    isSpeedUp() {
      if (this.gamePhase === constants.GAME_STATUS_PLAYING) {
        return this.speedUp.direction == null ? true : false;
      }
    },
    updateCell() {
      this.$store.dispatch("db/updateCell", { row: this.row, col: this.col });
    },
    openDialog(row, col) {
      if (
        this.getCell(row, col).unit.role !== constants.PIECE_KING &&
        this.unitConfigDialog
      )
        this.dialog = true;
    },
    closeDialog() {
      this.$store.dispatch("db/setUnitConfigDialog", { toggle: false });
      this.dialog = false;
      this.$store.dispatch("db/takeTurn");
    },
    cancelSpeedUp() {
      this.$store.dispatch("db/cancelSpeedUp", {
        row: this.row,
        col: this.col
      });
      this.$store.dispatch("db/setUnitConfigDialog", { toggle: false });
      this.dialog = false;
    }
  }
};
</script>

<style scored>
</style>