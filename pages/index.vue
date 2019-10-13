<template>
  <v-container>
    <v-row>
      <v-col>
        <Welcome />
      </v-col>
      <v-col>
        <Login />
      </v-col>
      <v-col>
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
