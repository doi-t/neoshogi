<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <Profile />
      </v-col>
      <v-col cols="12" sm="8">
        <GameMatching />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <PlayerStats />
      </v-col>
      <v-col cols="12" md="6">
        <RoomActivity />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Profile from "~/components/Profile.vue";
import GameMatching from "~/components/GameMatching.vue";
import PlayerStats from "~/components/PlayerStats.vue";
import RoomActivity from "~/components/RoomActivity.vue";

export default {
  components: {
    Profile,
    GameMatching,
    PlayerStats,
    RoomActivity
  }
};
</script>
