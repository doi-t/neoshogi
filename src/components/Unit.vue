<template>
  <v-container>
    <v-card class="ma-0 pa-0" width="100px" height="100px">
      <v-row
        align="center"
        justify="center"
        v-for="(row, rowIndex) in 3"
        :key="rowIndex"
        no-gutters
      >
        <v-col class="text-center" align-self="center" v-for="(col, colIndex) in 3" :key="colIndex">
          <v-card-title
            class="justify-center ma-0 pa-0 cell-speeds"
          >{{ unit.moves[rowIndex * 3 + colIndex] }}</v-card-title>
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

<style>
.cell-speeds {
  font-size: 12px;
}
</style>