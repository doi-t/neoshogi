<template>
  <v-container>
    <v-card :disabled="checkTurn()">
      <v-card-title>Storage</v-card-title>
      <v-card-text>Speed stocks: {{ speeds }}</v-card-text>
      <v-row align="center" justify="center" no-gutters>
        <v-col
          class="text-center"
          align-self="center"
          v-for="(unit, unitIndex) in units"
          :key="unitIndex"
        >
          <v-container
            :class="getUnitInStorageColor(unitIndex)"
            @click.stop="selectUnitInStorage(unit, unitIndex)"
          >
            <Unit :unit="unit" />
          </v-container>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import Unit from "~/components/Unit.vue";
import { mapState, mapGetters } from "vuex";
export default {
  components: { Unit },
  computed: {
    ...mapState({
      units: state => state.db.player.storage.units,
      speeds: state => state.db.player.storage.speeds,
      playerTurn: state => state.db.player.action.turn,
      gameTurn: state => state.db.game.turn
    }),
    ...mapGetters({
      getUnitInStorageColor: "db/getUnitInStorageColor"
    })
  },
  methods: {
    checkTurn() {
      return this.playerTurn === this.gameTurn ? false : true;
    },
    selectUnitInStorage(unit, unitIndex) {
      this.$store.dispatch("db/selectUnitInStorage", unitIndex);
    }
  }
};
</script>