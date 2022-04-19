import React from 'react';

import Routes from './navigation/index';

import { LogBox } from 'react-native';
import _ from 'lodash';

/*LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);
console.warn = message => {
if (message.indexOf('Setting a timer') <= -1) {
   _console.warn(message);
   }
};*/

export default function App() {
  return <Routes />;
}