<template>
  <v-container>
    <v-card class="pa-2" outlined tile @click.native="cellAction(row, col)">
      row:{{ row }}, col:{{ col }}
      <br />
      {{ unitStatus }}
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: ["row", "col", "unitStatus"]
};
</script>

<style scored>
</style>