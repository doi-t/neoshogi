<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs7>
        <Welcome />
      </v-flex>
      <v-flex xs5>
        <Login />
      </v-flex>
      <v-flex xs12>
        <HowToPlay />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Welcome from "~/components/Welcome.vue";
import Login from "~/components/Login.vue";
import HowToPlay from "~/components/HowToPlay.vue";

export default {
  components: {
    Welcome,
    Login,
    HowToPlay
  }
};
</script>
