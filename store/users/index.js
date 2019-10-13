import { auth } from "@/services/firebase";
import Cookie from "js-cookie";

export const state = () => ({
  user: null
});

export const mutations = {
  SET_USER: (state, account) => {
    state.user = account;
  }
};

export const actions = {
  async loginWithEmailAndPassword({ commit }, account) {
    try {
      await auth.signInWithEmailAndPassword(account.email, account.password);
    } catch (error) {
      throw error;
    }
  },
  async setLoginState({ commit }, user) {
    try {
      // Get JWT token from Firebase Auth
      const token = await auth.currentUser.getIdToken();
      const { email, uid } = auth.currentUser;

      // Set JWT token to the cookie
      // TODO: Doesn't need to be "__session" on Firebase Function
      // Ref. https://qiita.com/daishinkawa/items/5a0c12db05576f30a177
      Cookie.set("access_token", token);

      // Set the user locally
      commit("SET_USER", { email, uid });
    } catch (error) {
      throw error;
    }
  }
};