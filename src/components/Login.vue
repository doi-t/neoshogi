<template>
  <v-container>
    <v-dialog v-model="loading" fullscreen hide-overlay persistent>
      <v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
        <v-layout justify-center align-center>
          <v-card color="gray" dark width="300">
            <v-card-text>
              Please stand by
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-layout>
      </v-container>
    </v-dialog>
    <v-card>
      <v-card-title>
        <h1>Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="account.email"
            label="Username"
            prepend-icon="mdi-account-circle"
            :disabled="loading"
          />
          <v-text-field
            v-model="account.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :disabled="loading"
          />
        </v-form>
      </v-card-text>
      <v-alert type="error" v-if="isError">{{ errMsg }}</v-alert>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="success" :disabled="loading">Register</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="info"
          @click="loginWithEmailAndPassword"
          type="submit"
          :disabled="loading"
        >Login</v-btn>
      </v-card-actions>
      <v-divider></v-divider>
      <v-card>
        <v-layout justify-center>
          <v-btn fab icon :disabled="loading">
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
import { auth } from "@/plugins/firebase";
import { mapState, mapActions } from "vuex";

export default {
  name: "Login",
  data: () => ({
    account: {
      email: "",
      password: ""
    },
    isError: false,
    errMsg: "",
    showPassword: false,
    loading: true
  }),
  computed: mapState(["authenticated"]),
  methods: {
    ...mapActions(["setAuthenticated"]),
    loginWithEmailAndPassword(e) {
      console.log("Signing with Email and Password...");
      e.preventDefault();
      this.$store
        .dispatch("users/loginWithEmailAndPassword", this.account)
        .then(() => {
          this.$store.dispatch("users/setLoginState");
        })
        .then(() => {
          this.$router.push("/home");
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
      console.log("Loading...");
      this.loading = true;
      firebase.auth().onAuthStateChanged(user => resolve(user));
    });
    if (user) {
      console.log("You are already logged in.");
      this.setAuthenticated(true);
      this.$store
        .dispatch("users/setLoginState")
        .then(() => {
          this.$router.push("/home");
        })
        .catch(error => {
          this.isError = true;
          this.errMsg = error.code;

          setTimeout(() => {
            this.isError = false;
          }, 5000);
        });
    } else {
      console.log("You are not logged in yet.");
      this.loading = false;
      this.setAuthenticated(false);
    }
  }
};
</script>