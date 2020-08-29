'use strict';

import theme from './theme';

describe('Theme', function () {
  describe('fontSizeFromProps()', function () {
    it('should return font size based on input', function () {
      expect(theme.fontSizeFromProps({xl: {}, theme})).toEqual('2.4rem');
      expect(theme.fontSizeFromProps({lg: {}, theme})).toEqual('1.8rem');
      expect(theme.fontSizeFromProps({md: {}, theme})).toEqual('1.3rem');
      expect(theme.fontSizeFromProps({nm: {}, theme})).toEqual('1rem');
      expect(theme.fontSizeFromProps({sm: {}, theme})).toEqual('0.75rem');
      expect(theme.fontSizeFromProps({theme})).toEqual('inherit');
    });
  });

  describe('mediaBreakpoints()', function () {
    let expectedMobile = ['@media (max-width: 32em) {', 'w', '}'];
    let expectedTablet = ['@media (max-width: 72em) {', 'w', '}'];
    let expectedDesktop = ['@media (min-width: 72em) {', 'w', '}'];
    it('should return font size based on input', function () {
      expect(theme.mediaBreakpoints.mobile(`width: 100`)).toEqual(expectedMobile);
      expect(theme.mediaBreakpoints.tablet(`width: 100`)).toEqual(expectedTablet);
      expect(theme.mediaBreakpoints.desktop(`width: 100`)).toEqual(expectedDesktop);
    });
  });
});
