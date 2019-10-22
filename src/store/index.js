export const state = () => ({
  authenticated: false
});

export const getters = {
  IsAuthenticated: state => state.authenticated
};

export const actions = {
  async setVerifiedToken({ commit }, token) {
    // Set the user on the server side
    commit("users/SET_USER", {
      uid: token.uid,
      email: token.email
    });
    console.log(`Set verified user token: ${token.uid}`);
  },
  async setAuthenticated({ commit }, authStatus) {
    commit("setAuthenticated", authStatus);
    console.log(`Updated status of auth as "${authStatus}".`);
  }
};

export const mutations = {
  setAuthenticated: (state, authStatus) => (state.authenticated = authStatus)
};
