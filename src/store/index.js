import JWTDecode from "jwt-decode";
import cookieparser from "cookieparser";

export const state = () => ({
  authenticated: false
});

export const getters = {
  IsAuthenticated: state => state.authenticated
};

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (process.server && process.static) return;
    if (!req.headers.cookie) return;

    const parsed = cookieparser.parse(req.headers.cookie);
    const accessTokenCookie = parsed.access_token;

    if (!accessTokenCookie) return;

    const decoded = JWTDecode(accessTokenCookie);

    if (decoded) {
      commit("users/SET_USER", {
        uid: decoded.user_id,
        email: decoded.email
      });
    }
  },
  async setAuthenticated({ commit }, authStatus) {
    console.log("Updating status of auth...");
    commit("setAuthenticated", authStatus);
  }
};

export const mutations = {
  setAuthenticated: (state, authStatus) => (state.authenticated = authStatus)
};
