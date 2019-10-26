<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm4>
        <Profile />
      </v-flex>
      <v-flex xs12 sm8>
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
import Profile from "~/components/Profile.vue";

export default {
  components: {
    Welcome,
    HowToPlay,
    Profile
  },
  async fetch({ store, params }) {
    await store.dispatch("db/getPlayer");
  }
};
</script>
