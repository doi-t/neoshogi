if (process.server) {
  var admin = require("firebase-admin");
  if (!admin.apps.length) {
    if (process.env.NODE_ENV === "development") {
      var serviceAccount = require("../../.firebase/firebase-adminsdk.json");
      var cert = admin.credential.cert(serviceAccount);
    } else {
      var cert = admin.credential.applicationDefault();
    }

    admin.initializeApp({
      credential: cert,
      databaseURL: "https://doi-t-alpha.firebaseio.com"
    });
  }
}

export default admin;
