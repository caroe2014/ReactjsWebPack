import 'babel-polyfill';
import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
const req = require.context('../../service', true, /^(?!.*(?:node_modules)).*\.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
