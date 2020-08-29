// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { css, injectGlobal } from 'styled-components';

const theme = {
  colors: {
    black: '#000000',
    navigationMenu: '#48a942',
    navigationMenuHover: 'cornflowerblue',
    primary: '#347CFF',
    primaryButton: '#347CFF',
    loginField: '#AAA7AC',
    placeHolder: '#909090',
    loginBoxColor: '#434149',
    open: '#48a942',
    close: 'red',
    footer: '#48a942',
    textGrey: '#505050',
    paymentSuccessTitle: '#505050',
    inputBottomBorder: 'lightgray',
    backgroundGrey: '#E6E6E6',
    text: 'black',
    primaryText: '#383838',
    secondaryText: '#a6a6a6',
    hint: '#a6a6a6',
    light: 'white',
    error: '#cc0000',
    tile: '#505050',
    addToCart: '#347CFF',
    itemTile: '#3C474C0',
    darkGrey: '#464646',
    itemBorder: 'lightgrey',
    addOnTab: '#347CFF',
    validationError: '#cc0000',
    loginBackground: '#303030',
    loginFormBackground: '#484848',
    disableBackground: '#E4E4E4',
    addonBg: '#EEEEEE',
    glutenFree: '#8d7356',
    spicy: '#ed1c24',
    vegan: '#0d4a22',
    vegetarian: '#0d4a22',
    new: '#ff6000',
    healthy: '#359919',
    contextBackground: '#f0f0f3',
    loader: '#ababab',
    disableButton: '#D1D1D1'
  },
  fontFamily: 'Roboto',
  receiptFontFamily: 'Roboto',
  fontSize: {
    xl: '2.4rem',
    lg: '1.8rem',
    md: '1.3rem',
    nm: '1rem',
    sm: '0.75rem'
  },
  fontSizeFromProps: (props) => {
    if (props.xl) return props.theme.fontSize.xl;
    if (props.lg) return props.theme.fontSize.lg;
    if (props.md) return props.theme.fontSize.md;
    if (props.nm) return props.theme.fontSize.nm;
    if (props.sm) return props.theme.fontSize.sm;
    return 'inherit';
  },
  spacing: {
    xl: '8em',
    lg: '4em',
    md: '2em',
    nm: '1em',
    sm: '0.5em',
    none: '0em'
  },
  mediaBreakpoints: {
    mobile: (...args) => css`@media (max-width: 32em) {${css(...args)}}`,
    tablet: (...args) => css`@media (max-width: 72em) {${css(...args)}}`,
    desktop: (...args) => css`@media (min-width: 72em) {${css(...args)}}`
  },
  shadow: '#cfcfcf 0.1px 0.1px 3px 0px',
  nav: {
    height: '70px'
  }
};

injectGlobal`
  .agilysys-icon-new {
    color: ${theme.colors.new}
  }
  .agilysys-icon-healthy {
    color: ${theme.colors.healthy}
  }
  .agilysys-icon-vegetarian {
    color: ${theme.colors.vegetarian}
  }
  .agilysys-icon-vegan {
    color: ${theme.colors.vegan}
  }
  .agilysys-icon-spicy {
    color: ${theme.colors.spicy}
  }
  .agilysys-icon-gluten-free {
    color: ${theme.colors.glutenFree}
  }
  @media print {
    @-moz-document url-prefix() {
      .appContainer, .appContainer>div, .appContainer .parent, .appContainer .BottomContainer {
        display: block !important;
      }
    }
  }
`;

export default theme;
