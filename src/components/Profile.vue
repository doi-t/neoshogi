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
          <v-list-item-subtitle>{{ playerProfile.name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      playerProfile: state => state.db.player.profile
    })
  },
  async mounted(store) {
    this.$store.dispatch("db/getPlayer");
  }
};
</script>