<template>
  <v-container>
    <v-card min-width="400px" max-width="600px" class="mx-auto mt-5">
      <v-card-title class="pb-5">
        <h1>Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="account.email" label="Username" prepend-icon="mdi-account-circle" />
          <v-text-field
            v-model="account.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
        </v-form>
      </v-card-text>
      <v-card-text v-if="isError">
        <p>{{ errMsg }}</p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="success">Register</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="loginWithEmailAndPassword" type="submit">Login</v-btn>
      </v-card-actions>
      <v-divider></v-divider>
      <v-card>
        <v-layout justify-center>
          <v-btn fab icon>
            <v-avatar size="45">
              <v-img
                alt="Google Logo"
                :src="require('@/assets/google-logo.png')"
                @click="loginWithGoogle"
              />
            </v-avatar>
          </v-btn>
        </v-layout>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import firebase from "firebase";
import { auth } from "@/services/firebase";

export default {
  name: "Login",
  data: () => ({
    account: {
      email: "",
      password: ""
    },
    isError: false,
    errMsg: "",
    showPassword: false
  }),

  methods: {
    loginWithEmailAndPassword(e) {
      console.log("Signing with Email and Password...");
      e.preventDefault();
      this.$store
        .dispatch("users/loginWithEmailAndPassword", this.account)
        .then(() => {
          this.$store.dispatch("users/setLoginState");
        })
        .then(() => {
          this.$router.push("/mypage");
        })
        .catch(error => {
          this.isError = true;
          this.errMsg = error.code;

          setTimeout(() => {
            this.isError = false;
          }, 5000);
        });
    },
    loginWithGoogle() {
      console.log("Signing in using GoogleAuth...");
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
  },
  async mounted() {
    let user = await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => resolve(user));
    });
    if (user) {
      console.log("You are already logged in.");
      this.$store
        .dispatch("users/setLoginState")
        .then(() => {
          this.$router.push("/mypage");
        })
        .catch(error => {
          this.isError = true;
          this.errMsg = error.code;

          setTimeout(() => {
            this.isError = false;
          }, 5000);
        });
    }
  }
};
</script>
