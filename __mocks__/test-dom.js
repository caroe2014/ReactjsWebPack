import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import jsdom from 'jsdom';

const copyProps = (src, target) => {
  const props = Object.getOwnPropertyNames(src)
      .filter(prop => typeof target[prop] === 'undefined')
      .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
};

const setUpDomEnvironment = () => {
    const { JSDOM } = jsdom;
    const dom = new JSDOM('<!doctype html><html><body><div id="appContainer"></div></body></html>', {url: 'http://localhost/'});
    const { window } = dom;

    global.window = window;
    global.document = window.document;
    global.navigator = {
        userAgent: 'node.js',
    };
    copyProps(window, global);
};

setUpDomEnvironment();

configure({ adapter: new Adapter() });
