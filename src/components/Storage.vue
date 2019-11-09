<template>
  <v-container>
    <v-card>
      <v-card-title>Storage</v-card-title>
      <v-card-text>Speed stocks: {{ speeds }}</v-card-text>
      <v-row align="center" justify="center" no-gutters>
        <v-col
          class="text-center"
          align-self="center"
          v-for="(unit, unitIndex) in units"
          :key="unitIndex"
        >
          <v-card tile class="ma-0 pa-0">
            <Unit :unit="unit" />
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import Unit from "~/components/Unit.vue";
import { mapState } from "vuex";
export default {
  components: { Unit },
  computed: {
    ...mapState({
      units: state => state.db.player.storage.units,
      speeds: state => state.db.player.storage.speeds
    })
  }
};
</script>