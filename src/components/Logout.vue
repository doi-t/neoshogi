<template>
  <v-container>
    <v-card>
      <v-card-title>Logout</v-card-title>
      <v-card-text>
        <v-card-actions>
          <v-btn color="info" @click="logout" type="submit">Logout</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { auth } from "@/plugins/firebase";
import Cookie from "js-cookie";
export default {
  methods: {
    async logout() {
      await auth.signOut();
      await Cookie.remove("access_token");
      await Cookie.remove("neoshogi");
      location.href = "/";
    }
  }
};
</script>