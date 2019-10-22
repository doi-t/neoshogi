Init the project.

```
$ yarn create nuxt-app .
yarn create v1.19.0
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
warning "@vue/cli-service-global > @vue/babel-preset-app > @babel/plugin-syntax-dynamic-import@7.2.0" has unmet peer dependency "@babel/core@^7.0.0-0".
warning " > @vue/cli-service@3.11.0" has unmet peer dependency "vue-template-compiler@^2.0.0".
warning "@vue/cli-service-global > @vue/babel-preset-app > @babel/plugin-proposal-decorators@7.6.0" has unmet peer dependency "@babel/core@^7.0.0-0".
warning "@vue/cli-service-global > @vue/babel-preset-app > @babel/plugin-syntax-jsx@7.2.0" has unmet peer dependency "@babel/core@^7.0.0-0".
warning "@vue/cli-service-global > @vue/babel-preset-app > @babel/plugin-transform-runtime@7.6.2" has unmet peer dependency "@babel/core@^7.0.0-0".
warning "@vue/cli-service-global > @vue/babel-preset-app > @babel/preset-env@7.3.4" has unmet peer dependency "@babel/core@^7.0.0-0".
warning "@vue/cli-service-global > @vue/babel-preset-app > @babel/plugin-proposal-decorators > @babel/plugin-syntax-decorators@7.2.0" has unmet peer dependency "@babel/core@^7.0.0-0".
[4/4] 🔨  Building fresh packages...
success Installed "create-nuxt-app@2.11.1" with binaries:
      - create-nuxt-app

create-nuxt-app v2.11.1
✨  Generating Nuxt.js project in .
? Project name neoshogi
? Project description yet another online shogi aming to be an e-sports.
? Author name Toshiya Doi
? Choose the package manager Yarn
? Choose UI framework Vuetify.js
? Choose custom server framework None (Recommended)
? Choose Nuxt.js modules (Press <space> to select, <a> to toggle all, <i> to invert selection)
? Choose linting tools
? Choose test framework None
? Choose rendering mode Universal (SSR)
? Choose development tools jsconfig.json (Recommended for VS Code)

🎉  Successfully created project neoshogi

  To get started:

	yarn dev

  To build & start for production:

	yarn build
	yarn start

✨  Done in 987.74s.
```

```
$ firebase init

     ######## #### ########  ######## ########     ###     ######  ########
     ##        ##  ##     ## ##       ##     ##  ##   ##  ##       ##
     ######    ##  ########  ######   ########  #########  ######  ######
     ##        ##  ##    ##  ##       ##     ## ##     ##       ## ##
     ##       #### ##     ## ######## ########  ##     ##  ######  ########

You're about to initialize a Firebase project in this directory:

  /Users/doi-t/github/neoshogi

? Which Firebase CLI features do you want to set up for this folder? Press Space to select features,
 then Enter to confirm your choices. Functions: Configure and deploy Cloud Functions, Hosting: Confi
gure and deploy Firebase Hosting sites

=== Project Setup

First, let's associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add,
but for now we'll just set up a default project.

? Please select an option: Use an existing project
? Select a default Firebase project for this directory: doi-t-alpha (doi-t-alpha)
i  Using project doi-t-alpha (doi-t-alpha)

=== Functions Setup

A functions directory will be created in your project with a Node.js
package pre-configured. Functions can be deployed with firebase deploy.

? What language would you like to use to write Cloud Functions? JavaScript
? Do you want to use ESLint to catch probable bugs and enforce style? No
✔  Wrote functions/package.json
✔  Wrote functions/index.js
✔  Wrote functions/.gitignore
? Do you want to install dependencies with npm now? Yes

> protobufjs@6.8.8 postinstall /Users/doi-t/github/neoshogi/functions/node_modules/protobufjs
> node scripts/postinstall

npm notice created a lockfile as package-lock.json. You should commit this file.
added 236 packages from 180 contributors and audited 667 packages in 23.432s
found 0 vulnerabilities


=== Hosting Setup

Your public directory is the folder (relative to your project directory) that
will contain Hosting assets to be uploaded with firebase deploy. If you
have a build process for your assets, use your build's output directory.

? What do you want to use as your public directory? public
? Configure as a single-page app (rewrite all urls to /index.html)? No
✔  Wrote public/404.html
✔  Wrote public/index.html

i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...

✔  Firebase initialization complete!
```

```
$ anyenv install nodenv
$ nodenv install 10.15.3
$ nodenv global 10.15.3
$ node -v
v10.15.3
$ yarn build # nuxt build
$ cp -R functions/.nuxt/dist/ public/_nuxt
$ cp src/static/* public/
```

If you add `hosting.site` to `firebase.json` for custom domain, you have to set up Sign in method in Firebase Auth.

> "This domain (neoshogi.firebaseapp.com) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab."

In addition to above config, you need to update `Authorized JavaScript origins` and `Authorized redirect URLs` in Google APIs console as the error page that you will encounter through the first sign in attempt suggests.

> The redirect URI in the request, https://<site name>.firebaseapp.com/\_\_/auth/handler, does not match the ones authorized for the OAuth client. To update the authorized redirect URIs, visit: https://console.developers.google.com/apis/credentials/oauthclient/.....

# Cloud Run with Firebase Hosting

Ref. https://firebase.google.com/docs/hosting/serverless-overview
Ref. https://firebase.google.com/docs/hosting/cloud-run

# Manage Firebase Token with Cloud KMS
Firebase token is necessary when you want to deploy firebase in CI like Cloud Build.

Ref. https://cloud.google.com/cloud-build/docs/configuring-builds/build-test-deploy-artifacts#deploying_artifacts

You need to store the token in a secure but accessible way in your CI system.

Ref. https://firebase.google.com/docs/cli

## How to store Firebase token to Cloud KMS
```shell
$ firebase login:ci # You will get a token after Google Auth
$ gcloud kms keyrings create neoshogi \
  --location=global
$ gcloud kms keyrings list \
  --location=global
NAME
projects/doi-t-alpha/locations/global/keyRings/neoshogi
$ gcloud kms keys create firebase-token \
  --location=global \
  --keyring=neoshogi \
  --purpose=encryption
$ gcloud kms keys list \
  --location=global \
  --keyring=neoshogi
NAME                                                                               PURPOSE          ALGORITHM                    PROTECTION_LEVEL  LABELS  PRIMARY_ID  PRIMARY_STATE
projects/doi-t-alpha/locations/global/keyRings/neoshogi/cryptoKeys/firebase-token  ENCRYPT_DECRYPT  GOOGLE_SYMMETRIC_ENCRYPTION  SOFTWARE                  1           ENABLED
$ gcloud kms keys add-iam-policy-binding \
    firebase-token --location=global --keyring=neoshogi \
    --member=serviceAccount:xxxxxxxxxxx@cloudbuild.gserviceaccount.com \
    --role=roles/cloudkms.cryptoKeyDecrypter
Updated IAM policy for key [firebase-token].
bindings:
- members:
  - serviceAccount:xxxxxxxxxxx@cloudbuild.gserviceaccount.com
  role: roles/cloudkms.cryptoKeyDecrypter
etag: BwWVP-zdtf4=
version: 1
$ MY_SECRET="<your firebase token>"; echo -n $MY_SECRET | gcloud kms encrypt \
  --plaintext-file="-" \
  --ciphertext-file="-" \
  --location=global \
  --keyring=neoshogi \
  --key=firebase-token | base64
```

## How to revoke the token

On any machine with the Firebase CLI installed, you can immediately revoke access for the specified token by running:

```shell
$ firebase logout --token <your firebase token>
```

# Cloud Build tips

`cloud-build-local` sometimes gets stuck forever like below (at least on macbook with Docker Desktop).
```
$ cloud-build-local --config cloudbuild.yaml --dryrun=false . # First attempt
2019/10/19 18:23:11 Warning: The server docker version installed (19.03.3) is different from the one used in GCB (18.09.0)
2019/10/19 18:23:11 Warning: The client docker version installed (19.03.3) is different from the one used in GCB (18.09.0)
$ cloud-build-local --config cloudbuild.yaml --dryrun=false . # Second attempt
2019/10/19 18:25:18 Warning: there are left over step containers from a previous build, cleaning them.
```

Retart Docker Desktop and run `docker container prune`.
Then, `cloud-build-local` might be able to start to build your application on your local.
It takes time to start to see build logs, anyway. Be patient.

# Nuxt.js

## Local Development
A local server sometimes doesn't respond to a browser at all. If you face it, try to delete `.nuxt` and restart the server.

## Nuxt.js Lifecycle Hooks
- Ref. https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
- Ref. https://zendev.com/2018/06/07/async-data-options-in-vue-nuxt.html
- Ref. https://twitter.com/KrutiePatel/status/1000022559184764930?ref_src=twsrc%5Etfw
- Ref. https://hafilog.com/execution-order

## SSR

1. nuxtServerInit (SSR)
1. plugins (SSR)
1. middleware (SSR)
1. fetch (SSR)
1. beforeCreate (SSR)
1. plugins (CSR)
1. beforeEach (CSR)
1. afterEach (CSR)
1. beforeCreate (CSR)

## Not SSR

1. beforeEach (CSR)
1. middleware (CSR)
1. fetch (CSR)
1. afterEach (CSR)
1. beforeCreate (CSR)

