// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import theme from 'web/client/theme';
import { injectGlobal } from 'styled-components';
import { adobeFont } from 'web/client/app/utils/css/cssFontFaces';
import { fontType } from 'web/client/app/utils/constants';
// eslint-disable max-len
export const themeUpdate = (appTheme) => {
  if (appTheme) {
    theme.colors.bannerAndFooter = appTheme.textAndControls.bannerColor || theme.colors.navigationMenu;
    theme.colors.reverseTextColor = appTheme.textAndControls.bannerTextColor || theme.colors.light;
    theme.colors.primaryTextColor = appTheme.textAndControls.titleColor || theme.colors.primaryText;
    theme.colors.secondaryTextColor = appTheme.textAndControls.descriptionColor || theme.colors.textGrey;
    theme.colors.contextBar = theme.colors.contextBackground;
    theme.colors.buttonControlColor = appTheme.textAndControls.buttonControlColor || theme.colors.primaryButton;
    theme.colors.buttonTextColor = appTheme.textAndControls.buttonTextColor || theme.colors.light;
    theme.colors.textHoverColor = appTheme.textAndControls.buttonControlColor || theme.colors.primary;
    const appFont = appTheme.textAndControls.fontFamily;
    const receiptFont = appTheme.textAndControls.receiptFontFamily;
    theme.fontFamily = fontType[appFont] || theme.fontFamily;
    theme.receiptFontFamily = fontType[receiptFont] || theme.receiptFontFamily; // eslint-disable-line max-len
    if (appFont === 'adobeClean' || receiptFont === 'adobeClean') {
      injectGlobal`
        * {
        ${adobeFont}
        ${appFont === 'adobeClean' && `font-family: Adobe Clean;`}
      }
        `;
    }
  }
  return theme;
};
