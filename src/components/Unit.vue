<template>
  <v-container>
    <v-card>
      <v-row v-for="(row, rowIndex) in 3" :key="rowIndex" no-gutters>
        <v-col
          v-for="(col, colIndex) in 3"
          :key="colIndex"
        >{{ unit.moves[rowIndex * 3 + colIndex] }}</v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Unit",
  props: ["unit"],
  computed: {}
};
</script>