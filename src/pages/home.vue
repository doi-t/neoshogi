<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <Profile />
      </v-col>
      <v-col cols="12" sm="8">
        <Welcome />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <HowToPlay />
      </v-col>
    </v-row>
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
