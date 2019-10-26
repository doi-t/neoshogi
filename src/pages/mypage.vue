<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm4>
        <Profile />
      </v-flex>
      <v-flex xs12 sm8>
        <GameMatching />
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <PlayerStats />
      </v-flex>
      <v-flex xs12 md6>
        <RoomActivity />
      </v-flex>
    </v-layout>
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
