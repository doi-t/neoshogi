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
        <v-btn color="info" @click="login" type="submit">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Login',
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
    login(e) {
      e.preventDefault();
      this.$store
        .dispatch("users/login", this.account)
        .then(() => {
          this.$router.push("/mypage")
        })
        .catch(error => {
          console.log(error)
          this.isError = true
          this.errMsg = error.code

          setTimeout(() => {
            this.isError = false
          }, 5000)
        })
    }
  }
}
</script>
