if (process.server) {
  var admin = require("firebase-admin");
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: "https://doi-t-alpha.firebaseio.com"
    });
  }
}

export default admin;
