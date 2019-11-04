<template>
  <v-container class="pa-2">
    <v-card class="pa-0" width="48px" height="48px">
      <v-row
        align="center"
        justify="center"
        v-for="(row, rowIndex) in 3"
        :key="rowIndex"
        no-gutters
      >
        <v-col class="text-center" align-self="center" v-for="(col, colIndex) in 3" :key="colIndex">
          <div
            class="justify-center align-center text-center ma-0 pa-0"
            style="font-size: 10px; width: 16px; height: 16px;"
          >{{ unit.moves[rowIndex * 3 + colIndex] }}</div>
        </v-col>
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