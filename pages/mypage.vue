<template>
  <v-container>
    <Profile />
    <GameMatching />
    <PlayerStats />
    <RoomActivity />
    <Logout />
  </v-container>
</template>

<script>
import Profile from '~/components/Profile.vue'
import GameMatching from '~/components/GameMatching.vue'
import PlayerStats from '~/components/PlayerStats.vue'
import RoomActivity from '~/components/RoomActivity.vue'
import Logout from '~/components/Logout.vue'

export default {
  components: {
    Profile,
    GameMatching,
    PlayerStats,
    RoomActivity,
    Logout
  }
}
</script>
