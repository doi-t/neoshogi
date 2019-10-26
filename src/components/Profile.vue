<template>
  <v-container>
    <v-card>
      <v-avatar color="indigo">
        <v-icon dark>mdi-account-circle</v-icon>
      </v-avatar>
      <v-card-title class="headline">Profile</v-card-title>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Player Name</v-list-item-title>
          <v-list-item-subtitle>{{ playerName }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
export default {
  computed: {
    playerName() {
      return this.$store.state.db.player.name;
    }
  }
};
</script>