<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="6" md="7">
        <Welcome />
      </v-col>
      <v-col cols="12" sm="6" md="5">
        <Login />
      </v-col>
      <v-col cols="12">
        <HowToPlay />
      </v-col>
    </v-row>
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
