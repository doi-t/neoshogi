// In universal mode, middlewares will be called server-side once
// (on the first request to the Nuxt app or when page refreshes)
// and client-side when navigating to further routes.
// Ref. https://nuxtjs.org/guide/routing#middleware

// See https://nuxtjs.org/api/context/ to understand arguments
export default ({ req, store, route, redirect }) => {
  if (process.server) {
    if (!req.headers.cookie) {
      redirect("/");
      return;
    }

    var admin = require("firebase-admin");
    const cookieparser = require("cookieparser");
    const token = cookieparser.parse(req.headers.cookie).access_token;
    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedToken => {
        console.log("ID Token has been verified.");
        store.dispatch("setVerifiedToken", decodedToken).catch(error => {
          console.error(error);
        });
      })
      .catch(error => {
        console.error(error);
        redirect("/");
      });
  }

  if (process.client) {
    const user = store.state.users.user;
    const blockedRoute = /\/(home|game|mypage|logout)\/*/g;
    const homeRoute = "/";
    if (!user && route.path.match(blockedRoute)) {
      redirect("/");
    }

    if (user && route.path === homeRoute) {
      redirect("/home");
    }
  }
};
