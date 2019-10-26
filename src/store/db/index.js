import { db } from "@/plugins/firebase";

export const state = () => ({
  player: null
});

export const mutations = {
  SET_PLAYER: (state, playerInfo) => {
    state.player = playerInfo;
  }
};

export const actions = {
  getPlayer: async ({ commit, rootState }) => {
    const uid = rootState.users.user.uid;
    var userDocRef = db.collection("users").doc(uid);
    const player = await userDocRef.get();
    if (player.exists) {
      commit("SET_PLAYER", player.data());
    } else {
      console.log(`Creating a new player account... ${player.data()}`);
      await userDocRef.set({ name: "test player1" });
    }
  }
};
