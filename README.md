# Boat Navigation - Mobile Project for Cetema

[![Build Status](https://travis-ci.com/villelie/mp-cetema.svg?branch=master)](https://travis-ci.com/villelie/mp-cetema.svg?branch=master)

### Made with
- Expo
- React Native
- Native Base
- Firebase

### Installation
We are assuming you have installed [npm](https://www.npmjs.com/get-npm) and [Yarn](https://classic.yarnpkg.com/en/docs/install/) and have globally installed expo-cli with npm: ``npm i -g expo-cli``

Clone the repository and change to cloned folder
```
git clone https://github.com/villelie/mp-cetema.git
cd mp-cetema
```

Run the project. Some dependencies are not available with npm anymore, so please install the dependencies using Yarn. Then start the app with Yarn
```
yarn install
yarn start
```
You can now start modifying the code.

## Change API keys
Change these API keys and cofigs to your own:
- Firebase config is located in ``src/helpers/Firebase.js``
- Foreca API config is located in ``src/helpers/WeatherApi.js``
- Google Maps API key is located in ``app.json``

Firebase needs to be configured just by adding a new web project. Firestore does not need any configuration, App will build data structure on its own.

### Build
Build project with expo-cli.

For android:
```
expo build:android
```
For ios:
```
expo build:ios
```
For publishing app to expo.io:
```
expo publish
```

### :warning: Expo build might not work.
[expo.io/@villeliekari/projects/mp-cetema](https://expo.io/@villeliekari/projects/mp-cetema)
