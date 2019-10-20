if (process.server) {
  var admin = require("firebase-admin");
  if (!admin.apps.length) {
    var serviceAccount = require("../../.firebase/firebase-adminsdk.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://doi-t-alpha.firebaseio.com"
    });
  }
}

export default admin;
