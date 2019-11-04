<template>
  <v-container class="pa-2">
    <div class="text-center justify-center align-center d-flex">
      <v-card class="pa-0" width="192px" height="192px">
        <v-row v-for="(row, rowIndex) in 3" :key="rowIndex" no-gutters>
          <v-col v-for="(col, colIndex) in 3" :key="colIndex">
            <!-- one direction -->
            <template>
              <v-card>
                <div
                  class="justify-center align-center text-center"
                  style="font-size: 40px; width: 64px; height: 64px;"
                >{{ unit.moves[rowIndex * 3 + colIndex] }}</div>

                <v-overlay :absolute="true" :value="true">
                  <div>
                    <v-btn class="ma-0 pa-0" left style="width: 32px; height: 32px; opacity: 0.4;">+</v-btn>
                    <v-btn class="ma-0 pa-0" left style="width: 32px; height: 32px; opacity: 0.4;">-</v-btn>
                  </div>
                </v-overlay>
              </v-card>
            </template>
            <!-- one direction -->
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "UnitConfig",
  props: ["unit", "unitConfig"]
};
</script>