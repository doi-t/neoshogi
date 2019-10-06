<template>
  <v-container>
    <Profile />
    <GameMatching />
    <PlayerStats />
    <RoomActivity />
  </v-container>
</template>

<script>
import Profile from '~/components/Profile.vue'
import GameMatching from '~/components/GameMatching.vue'
import PlayerStats from '~/components/PlayerStats.vue'
import RoomActivity from '~/components/RoomActivity.vue'

export default {
  components: {
    Profile,
    GameMatching,
    PlayerStats,
    RoomActivity
  }
}
</script>
