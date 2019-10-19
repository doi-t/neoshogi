<template>
  <v-app dark>
    <v-app-bar app>
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
      <v-btn to="/home" nuxt text rounded>Home</v-btn>
      <v-btn to="/mypage" nuxt text rounded>My Page</v-btn>
      <v-btn to="/game" nuxt text rounded>Game</v-btn>
      <v-btn to="/login" nuxt text rounded>Login</v-btn>
      <v-btn to="/logout" nuxt text rounded>Logout</v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: "NeoShogi"
    };
  }
};
</script>
