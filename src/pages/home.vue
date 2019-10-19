<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <Welcome />
      </v-flex>
      <v-flex xs12>
        <HowToPlay />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Welcome from "~/components/Welcome.vue";
import HowToPlay from "~/components/HowToPlay.vue";

export default {
  components: {
    Welcome,
    HowToPlay
  }
};
</script>
