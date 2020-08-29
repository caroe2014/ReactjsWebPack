// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
import React, { Component } from 'react';
import { Flex, Fixed, Drawer, Toolbar, ButtonTransparent, Link, Image, Circle, Text } from 'rebass';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import config from 'app.config';
import PropTypes from 'prop-types';
import IconButton from 'web/client/app/components/IconButton';
import MenuData from './menu-data';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import axios from 'axios';
import get from 'lodash.get';
import CopyLinkModal from 'web/client/app/components/OrderAtTable/CopyLinkModal';
import { ConnectedCart, ConnectedCommunalCart, ConnectedCartNotification, ConnectedCommunalCartNotification, ConnectedGuestDetails } from 'web/client/app/reduxpages/ConnectedComponents'; // eslint-disable-line max-len
import { MULTI_PASS_ORDER_GUID } from 'web/client/app/utils/constants';

let menuData = new MenuData();

const Navbar = styled(Toolbar)`
background-color: ${props => {
    if (props.theme.colors.bannerAndFooter) return `${props.theme.colors.bannerAndFooter}`;
    return 'transparent';
  }};
  min-height: ${props => props.theme.nav.height};
  position:relative;
  width: 100%;
${props => props.theme.mediaBreakpoints.desktop`max-width: 1200px; padding-left: 20px; padding-right: 20px;`}
  padding-left: 0px;
  padding-right: 0px;
  margin: auto;
  @media print {
    display: none;
  }
`;

const NavMenu = styled(ButtonTransparent)`
  font-size: ${props => props.theme.fontSize.nm};
  cursor: pointer;
  margin-right: auto;
  padding-top: 10px;
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
${props => props.theme.mediaBreakpoints.desktop`display: none;`}
${props => props.theme.mediaBreakpoints.tablet`display: none;`}
${props => props.theme.mediaBreakpoints.mobile`display: block;`}
`;

const DrawerMenu = styled(Drawer)`
  background-color: ${props => props.theme.colors.bannerAndFooter};
  z-index: 10;
  margin-top: 8px;
  .concepts{
    padding-left: 10px;
  }
`;
DrawerMenu.displayName = 'DrawerMenu';

const DrawerCart = styled(Drawer)`
  border: 0.5px solid ${props => props.theme.colors.itemBorder};
  font-size: ${props => props.theme.fontSizeFromProps(props)};
  height: 100%;
  width: 100%;
  z-index: 10;
  left: auto;
  overflow: hidden;
  margin-top: ${props => props.open ? props.theme.nav.height : 0 - props.theme.nav.height};
  margin-left: auto;
  right: ${props => props.right ? `${props.right}px` : '0'};
  padding-bottom: ${props => props.open ? props.theme.nav.height : 0 - props.theme.nav.height};
  width: 25em;
${props => props.theme.mediaBreakpoints.tablet`right: 0em;`}
${props => props.theme.mediaBreakpoints.mobile`width: 100%; padding-bottom: 30px; height: calc(100% + 56px);`}
${props => props.theme.mediaBreakpoints.mobile`margin-top: 0;`};
${props => props.theme.mediaBreakpoints.mobile`right: 0; transition: none`};
`;

const DrawerProfile = styled(Drawer)`
  border: 0.5px solid ${props => props.theme.colors.itemBorder};
  font-size: ${props => props.theme.fontSizeFromProps(props)};
  height: 100%;
  width: 100%;
  z-index: 10;
  left: auto;
  overflow: hidden;
  max-height: 320px;
  margin-top: ${props => props.open ? props.theme.nav.height : 0 - props.theme.nav.height};
  right: ${props => props.right ? `${props.right}px` : '0'};
  padding-bottom: ${props => props.open ? props.theme.nav.height : 0 - props.theme.nav.height};
  width: 25em;
${props => props.theme.mediaBreakpoints.tablet`right: 0em;`}
${props => props.theme.mediaBreakpoints.mobile`width: 100%; padding-bottom: 30px; height: calc(100% + 56px);`}
${props => props.theme.mediaBreakpoints.mobile`margin-top: 0;`};
${props => props.theme.mediaBreakpoints.mobile`right: 0; max-height: 100%;`};
`;

const FixedLayout = styled(Fixed)`
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const DrawerNotification = styled(Drawer)`
  box-shadow: 1px 2px 16px 0px rgba(0,0,0,.2);
  border-radius: 20px;
  border: 0.5px solid ${props => props.theme.colors.itemBorder};
  font-size: ${props => props.theme.fontSizeFromProps(props)};
  height: auto;
  width: 100%;
  z-index: 10;
  left: auto;
  overflow: hidden;
  margin-top: ${props => props.open ? props.theme.nav.height : 0 - props.theme.nav.height};
  display: ${props => props.open ? 'block' : 'none'};
  margin-left: auto;
  right: ${props => props.right ? `${props.right}px` : '0'};
  width: 22em;
${props => props.theme.mediaBreakpoints.tablet`right: 0em;`}
${props => props.theme.mediaBreakpoints.mobile`width: 90%; right: 0;`};
`;

const SideMenuTop = styled(Flex)`
  width: 100%;
  justify-content: center;
  align-items: center;
  border-bottom: 0.5px solid white;
  font-weight: 300;
  text-decoration: none;
  color: ${props => props.theme.colors.light};
  padding: ${props => props.theme.spacing.nm};
  display: ${props => props.horizontal ? 'flex' : 'inline-flex'};
  font-size: ${props => props.theme.fontSizeFromProps(props)};
`;

const NavigationLink = styled(NavLink)`
  border-bottom: 0.5px solid white;
  align-items: baseline;
  cursor: pointer;
  font-weight: 300;
  text-decoration: none;
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
  padding: ${props => props.theme.spacing.nm};
  display: ${props => props.horizontal ? 'flex' : 'inline-flex'};
  font-size: ${props => props.theme.fontSizeFromProps(props)};
  &:hover {
    background: ${props => props.theme.colors.navigationMenuHover};
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const NavigationHomeLink = styled(Link)`
  border-bottom: 0.5px solid white;
  align-items: baseline;
  cursor: pointer;
  font-weight: 300;
  text-decoration: none;
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
  padding: ${props => props.theme.spacing.nm};
  display: ${props => props.horizontal ? 'flex' : 'inline-flex'};
  font-size: ${props => props.theme.fontSizeFromProps(props)};
  &:hover {
    background: ${props => props.theme.colors.navigationMenuHover};
  }
  &.active {
    background: ${props => props.theme.colors.navigationMenuHover};
    color: ${props => props.theme.colors.light};
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const BackLinkContainer = styled(Flex)`
  & > a {
    text-decoration: none;
    color: ${props => props.theme.colors.light};
    font-size: ${props => props.theme.fontSize.md};
    cursor: pointer;
    & > div > i {
      -webkit-text-stroke: 1px ${props => props.theme.colors.bannerAndFooter};
    }
  }
  ${props => props.theme.mediaBreakpoints.desktop`display: none;`};
  ${props => props.theme.mediaBreakpoints.tablet`display: block;`};
  ${props => props.theme.mediaBreakpoints.mobile`display: block;`};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const Logo = styled(Image)`
  top: 0px;
  bottom: 0px;
  margin: auto;
  left: 50%;
  cursor: ${props => props.enablecursor ? 'pointer' : 'cursor'}
  transform: translate(-50%, 0);
  position: absolute;
  max-width: 300px;
  max-height: calc(${props => props.theme.nav.height} - 15px);
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const SideMenuLogo = styled(Image)`
  margin-left: auto;
  display: block;
  max-width: 100%;
  height: auto;
  max-height: 32px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const HomeLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  flex-direction: row;
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
  font-size: ${props => props.theme.fontSize.nm};
  ${props => props.theme.mediaBreakpoints.mobile`display: none;`};
  ${props => props.theme.mediaBreakpoints.tablet`margin-left: 8px;`};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
HomeLink.displayName = 'HomeLink';

const InviteLink = styled(HomeLink)`
  ${props => props.theme.mediaBreakpoints.mobile`display: flex;`};
  .invite-text {
    padding-left: 5px;
    padding-top: 2px;
    display: block;
  }
`;

const CartLink = styled(Link)`
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  margin-left: ${props => props.theme.spacing.nm};
  text-decoration: none;
  display: flex;
  flex-direction: row;
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
  font-size: ${props => props.theme.fontSize.nm};
  ${props => props.theme.mediaBreakpoints.tablet`margin-right: 16px;`}
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const SearchLink = styled(Link)`
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
  font-size: ${props => props.theme.fontSize.nm};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
SearchLink.displayName = 'SearchLink';

const ProfileLink = styled(Link)`
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
  font-size: 18px;
  ${props => props.theme.mediaBreakpoints.tablet`margin-left: 0px;`};
  ${props => props.theme.mediaBreakpoints.mobile`margin-left: 0px;`};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
ProfileLink.displayName = 'ProfileLink';

const SignInLink = styled(Link)`
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
  font-size: ${props => props.theme.fontSize.nm};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
SignInLink.displayName = 'SignInLink';

const LogOutLink = styled(Link)`
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  margin-left: ${props => props.theme.spacing.nm};
  text-decoration: none;
  display: flex;
  flex-direction: row;
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
  font-size: ${props => props.theme.fontSize.nm};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
LogOutLink.displayName = 'LogOutLink';

const NavText = styled(Text)`
  font-size: 1em;
${props => props.theme.mediaBreakpoints.mobile`display: none;`};
${props => props.theme.mediaBreakpoints.tablet`display: none;`};
`;

const SignInText = styled(Text)`
  margin-right: 16px;
  ${props => props.theme.mediaBreakpoints.desktop`margin-left: 16px;`};
`;

const CartIcon = styled(Text)`
  margin-right: 8px;
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
`;

const CloseMenuButton = styled(IconButton)`
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: 300;
  margin-left: auto;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CloseButton = styled(IconButton)`
  color: ${props => props.theme.colors.buttonControlColor};
  font-size: 22px;
  font-weight: 400;
  margin: 20px 16px 0 0;
  position: absolute;
  right: 8px;
  z-index: 1;
  &:hover {
    color: ${props => props.theme.colors.error};
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ProfileCloseButton = styled(CloseButton)`
  color: ${props => props.theme.colors.tile};
  font-size: 22px;
  font-weight: 400;
  margin: 16px 16px 0px 4px;
  width: auto;
  text-align: left;
  left: 8px;
  &:hover {
    color: ${props => props.theme.colors.error};
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CartBadge = styled(Circle)`
  position: absolute;
  display: flex;
  justify-content: center;
  left: 8px;
${props => props.theme.mediaBreakpoints.mobile`right: 0.1em;`};
${props => props.theme.mediaBreakpoints.tablet`right: -1em;`};
  top: -1em;
  font-size: 11px;
  padding: 3px;
  width: 18px;
  height: 18px;
  background-color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.darkGrey}`;
    return 'transparent';
  }};
  color: ${props => {
    if (props.theme.colors.reverseTextColor) return `${props.theme.colors.reverseTextColor}`;
    return 'transparent';
  }};
${props => {
    if (props['data-length'] > 99) {
      return `
        width: 23px;
        height: 23px;
        top: -1.3em;
      `;
    }
  }};
`;
CartBadge.displayName = 'CartBadge';

const FullMenu = styled(Flex)`
  position: relative;
  width: 100%;
  background-color: ${props => props.theme.colors.bannerAndFooter};
${props => props.theme.mediaBreakpoints.desktop`
  ${props => { return props.open ? `animation: cart-frame .2s;` : `z-index: 11`; }};
`};
${props => props.theme.mediaBreakpoints.tablet`
  ${props => { return props.open ? `animation: cart-frame .2s;` : `z-index: 11`; }};
`};
${props => props.theme.mediaBreakpoints.mobile`animation: none; z-index: 10`};
  @keyframes  cart-frame{
    0% {
      z-index: 11;
    }
    99% {
      z-index: 11;
    }
    100% {
      z-index: 9;
    }
  }
  .profile-parent {
    margin-left: 15px !important;
    ${props => props.theme.mediaBreakpoints.tablet`
    margin-left: 5px !important;
    margin-right: 10px`};
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StyledTriangle = styled(Flex)`
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 20px solid white;
  position: absolute;
  z-index: 999;
  right: ${props => {
    if (props.right) return `${props.right}px`;
    return '0';
  }};
  display: ${props => {
    if (props.open || props.notify) return `block`;
    return 'none';
  }};
  right: -4px;
  top: 25px;
  ${props => props.theme.mediaBreakpoints.tablet`right: -6px; top: 28px;`}
  ${props => props.theme.mediaBreakpoints.mobile`
    right: -4px; top: 28px;
    display: ${props => props.notify ? 'block' : 'none'};
    `}
`;

const StyledProfileTriangle = styled(props => <StyledTriangle {...props} />)`
  position: absolute;
  right: -3px;
  top: 25px;
  ${props => props.theme.mediaBreakpoints.tablet`top: 27px;`}
  ${props => props.theme.mediaBreakpoints.mobile`display: none;`}
`;

const homeButtonStyle = {
  marginRight: '8px',
  fontSize: '20px'
};

const cartNotificationWidth = 175;

class NavigationMenu extends Component {
  constructor (props) {
    super(props);
    this.state = {
      menuOpen: this.props.menuOpen || false,
      notifyCart: false,
      profileOpen: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleCart = this.toggleCart.bind(this);
    this.notifyCart = this.notifyCart.bind(this);
    this.closeNotifyCart = this.closeNotifyCart.bind(this);
    this.getRefrenceLinkOffsetRight = this.getRefrenceLinkOffsetRight.bind(this);
    this.getRefrenceTriangleOffsetRight = this.getRefrenceTriangleOffsetRight.bind(this);
    this.getCartCount = this.getCartCount.bind(this);
    this.redirectHome = this.redirectHome.bind(this);
    this.redirectNavLinkHome = this.redirectNavLinkHome.bind(this);
    this.notificationCartoffsetRight = this.notificationCartoffsetRight.bind(this);
    this.loadImage = this.loadImage.bind(this);
    this.cartNotificationTimeout = undefined;
    this.getHomeButtonEnabled = this.getHomeButtonEnabled.bind(this);
    this.redirectConcept = this.redirectConcept.bind(this);
    this.loginButton = this.loginButton.bind(this);
    this.logoutButton = this.logoutButton.bind(this);
    this.toggleProfile = this.toggleProfile.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.toggleMultiPassCopyLink = this.toggleMultiPassCopyLink.bind(this);
  }

  handleKeyDown (e, navigation) {
    // TODO: make this usable by all clickable elements,
    //  pass in caller's onclickhandler (13 is keycode for enter key, 32 is spacebar)
    if (e.which === 13 || e.which === 32) {
      if (navigation === 'home' || navigation === 'logo') {
        this.redirectHome();
      } else if (navigation === 'cart') {
        this.toggleCart(true);
      } else if (navigation === 'signin') {
        this.loginButton();
      } else if (navigation === 'profile') {
        this.toggleProfile();
      } else if (navigation === 'logout') {
        this.logoutButton();
      }
    }
  }

  loginButton () {
    this.props.showLoginPopup(true);
  }

  logoutButton () {
    if (this.props.loginMode === 'facebook') {
      window.FB.logout();
    }

    if (this.props.samlCookie) {
      this.setState({
        profileOpen: false
      });
      this.props.samlLogout();
    }

    this.props.history.push('/logout');
    this.props.setTimeoutFlag();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.ondToken && this.props.ondToken !== nextProps.ondToken) {
      this.cartPopupOffset = 65;
    } else {
      this.cartPopupOffset = 30;
    }
    const cartOpen = this.props.multiPassEnabled ? nextProps.communalCartOpen : nextProps.cartOpen;
    if (nextProps.cartOpen !== this.props.cartOpen || (this.props.multiPassEnabled && nextProps.communalCartOpen !== this.props.communalCartOpen)) {
      this.setState({ cartOpen });
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.closeFlag !== this.props.closeFlag) {
      this.closeNotifyCart();
    }
    if ((this.props.lastItemAdded !== null && prevProps.lastItemAdded !== this.props.lastItemAdded) ||
      (this.props.lastItemAddedCommunalCart !== null && prevProps.lastItemAddedCommunalCart !== this.props.lastItemAddedCommunalCart)) {
      this.notifyCart();
    }
    if (prevProps.closeNotificationFlag !== this.props.closeNotificationFlag) {
      this.closeNotifyCart();
    }
    this.loadImage();
  }

  toggleMenu () {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  toggleCart = (flag) => {
    const { multiPassEnabled, toggleCommunalCart, toggleCart } = this.props;
    multiPassEnabled ? toggleCommunalCart(flag) : toggleCart(flag);
    this.setState({ notifyCart: false, cartOpen: !this.state.cartOpen });
  }

  notifyCart () {
    if (this.state.notifyCart) {
      clearTimeout(this.cartNotificationTimeout);
      setTimeout(
        function () {
          this.setState({ notifyCart: true });
        }
          .bind(this),
        200
      );
    } else {
      this.setState({ notifyCart: true });
    }
    this.cartNotificationTimeout = setTimeout(
      function () {
        this.setState({ notifyCart: false });
      }.bind(this),
      2000
    );
  }

  closeNotifyCart () {
    this.setState({ notifyCart: false });
    clearTimeout(this.cartNotificationTimeout);
  }

  getRefrenceLinkOffsetRight (refrence, offsetRight = 30) {
    return refrence && refrence.getBoundingClientRect
      ? window.innerWidth - (refrence.getBoundingClientRect().right + offsetRight)
      : 0;
  }

  getRefrenceTriangleOffsetRight (refrence, offsetRight = 0) {
    return refrence && refrence.getBoundingClientRect
      ? window.innerWidth - (refrence.getBoundingClientRect().right - offsetRight)
      : 0;
  }

  notificationCartoffsetRight () {
    return this.cartLink && this.cartLink.getBoundingClientRect &&
      (window.innerWidth - cartNotificationWidth) > this.cartLink.getBoundingClientRect().right
      ? window.innerWidth - (this.cartLink.getBoundingClientRect().right + 130)
      : 0;
  }

  getCartCount () {
    const { cartItems, multiPassEnabled, communalCartItems } = this.props;
    const cartItemsToCount = multiPassEnabled ? communalCartItems : cartItems;
    if (cartItemsToCount && cartItemsToCount.length > 0) {
      return cartItemsToCount.length;
    } else {
      return 0;
    }
  }

  redirectHome () {
    if (this.props.digitalMenuId) {
      this.props.history.replace(`/concepts/${this.props.digitalMenuId}/${this.props.displayProfileId}`);
    } else {
      this.props.history.replace('/');
      this.props.setHideScheduleTime(false);
      this.props.location.pathname === `/paymentSuccess` && this.props.resetSites();
    }
  }

  redirectConcept () {
    this.toggleMenu();
    if (this.props.selectedId !== -1) {
      this.props.history.replace(`/concepts/${this.props.selectedId}/${this.props.displayProfileId}`);
    } else {
      this.props.history.replace('/');
    }
  }

  redirectNavLinkHome () {
    this.toggleMenu();
    this.redirectHome();
  }

  loadImage () {
    const logo = get(this.props, 'cboConfig.theme.logoImage');
    const { isLogoDisplay, logoFetching } = this.state;
    if (logo && !logoFetching && !isLogoDisplay) {
      this.setState({logoFetching: true});
      axios.get(`${config.getPOSImageURL(this.props.cboConfig.contextID, this.props.cboConfig.theme.logoImage, this.props.cboConfig.tenantID)}`,
        { responseType: 'blob' })
        .then((response) => {
          var reader = new window.FileReader();
          reader.readAsDataURL(response.data);
          reader.onload = function () {
            const url = reader.result;
            if (this.desktopLogo) { this.desktopLogo.attrs.src = url; }
            if (this.mobileLogo) { this.mobileLogo.attrs.src = url; };
            this.setState({isLogoDisplay: true, logoFetching: false});
          }.bind(this);
        }).catch(() => {
          this.setState({isLogoDisplay: true, logoFetching: false});
        });
    }
  }

  getHomeButtonEnabled () {

    const {showHomeLink, location, hideScheduleTime, isScheduleOrderEnabled, digitalMenuId, section, match, menu, conceptList, multiPassEnabled} = this.props;
    if (digitalMenuId) {
      let showHomeLink = false;
      switch (section) {
        case 'item':
          showHomeLink = true;
          break;
        case 'menu':
          let category = match.params.categoryId && menu.current.categories
            ? menu.current.categories.find(category => category.id === match.params.categoryId)
            : {};
          showHomeLink = digitalMenuId
            ? category.name ? true : (conceptList && conceptList.length > 1)
            : true;
          break;
      }
      return showHomeLink;
    } else {
      if (showHomeLink && (location.pathname !== '/' || hideScheduleTime) && location.pathname !== '/404' &&
      (!multiPassEnabled || (multiPassEnabled && location.pathname !== `/`))) {
        return (isScheduleOrderEnabled && hideScheduleTime) || ((isScheduleOrderEnabled || multiPassEnabled) && location.pathname === `/concepts/${this.props.selectedId}`) ||
      location.pathname !== `/concepts/${this.props.selectedId}`;
      } else {
        return false;
      }
    }
  }

  toggleProfile () {
    this.setState({profileOpen: !this.state.profileOpen});
  }

  toggleMultiPassCopyLink () {
    this.setState({showCopyLinkModal: !this.state.showCopyLinkModal});
  }

  getInviteLinkAddress () {
    const orderGuid = sessionStorage.getItem(MULTI_PASS_ORDER_GUID); // eslint-disable-line
    return `${window.location.href}?orderGuid=${orderGuid}`;
  }

  render () {
    const {
      showBackLink,
      showCartLink,
      showLogOutLink,
      backLink,
      location,
      fetching,
      isScheduleOrderEnabled,
      ondToken,
      cboConfig,
      isLoyaltyEnabled,
      samlCookie,
      skipSitesPage,
      history,
      digitalMenuId,
      multiPassEnabled,
      siteFetch } = this.props;
    const { menuOpen, notifyCart, profileOpen, cartOpen, showCopyLinkModal } = this.state;
    const cartCount = this.getCartCount();
    const showDrawerIcon = (isScheduleOrderEnabled && location.pathname !== '/') ||
    (((!isScheduleOrderEnabled && !isLoyaltyEnabled) || !multiPassEnabled) && location.pathname !== '/' && location.pathname !== `/concepts/${this.props.selectedId}`) ||
    (!isScheduleOrderEnabled && !multiPassEnabled && location.pathname !== '/' && location.pathname !== `/loyalty/${this.props.selectedId}`);
    const isHomeEnabled = this.getHomeButtonEnabled();
    const showCartIcon = location.pathname === `/paymentSuccess` || location.pathname === `/paymentComponent` || location.pathname === `/payment` ||
      location.pathname === `/deliveryLocation` || location.pathname === `/tip` || location.pathname === `/smsNotification` ||
      location.pathname === `/nameCapture`;
    const showConceptIcon = location.pathname !== '/' && location.pathname !== `/loyalty/${this.props.selectedId}` &&
      location.pathname !== `/concepts/${this.props.selectedId}`;
    const cartLinkOffsetRight = this.getRefrenceLinkOffsetRight(this.cartLink, this.cartPopupOffset);
    const notificationCartoffsetRight = this.notificationCartoffsetRight();
    const profileLinkOffsetRight = this.getRefrenceLinkOffsetRight(this.profileLink);
    menuData.getItem('sign-out').hidden = !showLogOutLink;
    const closeIcon = <div>&#10005;</div>;
    const guestProfileEnabled = cboConfig && cboConfig.siteAuth && cboConfig.siteAuth.type === 'socialLogin';
    const atriumEnabled = cboConfig && cboConfig.siteAuth && cboConfig.siteAuth.type === 'atrium';
    const siteAuthType = cboConfig && cboConfig.siteAuth && cboConfig.siteAuth.type;
    const removeBackLinkFromConceptsPage = skipSitesPage && !isScheduleOrderEnabled && location.pathname === `/concepts/${this.props.selectedId}`;
    menuData.getItem('locations').hidden = skipSitesPage || !menuOpen || multiPassEnabled;
    const showDrawerMenu = showDrawerIcon && menuData.data.filter(data => !data.hidden).length > 0 && !digitalMenuId;
    const showInviteIcon = multiPassEnabled && location.pathname === '/';
    const linkAddress = this.getInviteLinkAddress();
    return (
      <React.Fragment>
        <FullMenu className='full-menu-bar' aria-label={window.document.title} tabIndex={0} id='top-container' open={cartOpen || profileOpen}>
          <Navbar className='nav-menu-bar' style={this.props.style} >

            {
              showBackLink && !removeBackLinkFromConceptsPage &&
              <BackLinkContainer>
                {backLink}
              </BackLinkContainer>
            }
            {
              showInviteIcon && (
                <Flex className='invite-link-container'>
                  <InviteLink className='invite-button-link' onClick={this.toggleMultiPassCopyLink}>
                    <i className='fa fa-user-plus' aria-hidden='true' />
                    <NavText className='invite-text'><Trans i18nKey='NAVIGATION_INVITE'/></NavText>
                  </InviteLink>
                </Flex>
              )
            }
            {
              isHomeEnabled && !siteFetch && (
                <Flex className='home-link-container'>
                  <HomeLink className='home-button-link' role='button'
                    aria-label={i18n.t('NAVIGATE_HOME_PAGE')}
                    onKeyDown={(e) => {
                      this.handleKeyDown(e, 'home');
                    }}
                    tabIndex={0} onClick={this.redirectHome} >
                    <i style={homeButtonStyle} className='fa fa-home' />
                    <NavText><Trans i18nKey='NAVIGATION_HOME'/></NavText>
                  </HomeLink>
                </Flex>
              )
            }
            {
              showDrawerMenu &&
              <NavMenu className='menu-button' tabIndex={0} role='button' aria-label={i18n.t('MENU_BUTTON')} onClick={this.toggleMenu}>
                <i className='fa fa-bars' />
              </NavMenu>
            }
            {!fetching &&
              <Logo
                ref={imageLoadedElem => (this.desktopLogo = imageLoadedElem)}
                className='Logo'
                role='navigation'
                aria-label={i18n.t('NAVIGATE_HOME_PAGE')}
                alt=''
                enablecursor={isHomeEnabled ? 1 : 0}
                onClick={isHomeEnabled ? this.redirectHome : null}
                onKeyDown={(e) => {
                  this.handleKeyDown(e, 'logo');
                }}
                tabIndex={isHomeEnabled ? 0 : -1}
              />
            }
            {/* TODO: Uncomment when Search Feature becomes available */}
            <Flex style={{ marginLeft: 'auto' }}>
              {/* <SearchLink className='SearchLink'>
                <i style={{ marginRight: '8px' }} className='fa fa-search' /> <NavText><Trans i18nKey='NAVIGATION_SEARCH'/></NavText>
              </SearchLink> */}
            </Flex>
            {
              showCartLink && !showCartIcon && !digitalMenuId && !siteFetch &&
              <Flex className='cart-link-container'>
                <CartLink
                  tabIndex={0}
                  aria-label={i18n.t('NAVIGATION_CART')}
                  innerRef={(e) => { this.cartLink = e; }}
                  className={`CartLink ${cartOpen ? 'active' : ''}`}
                  onClick={() => this.toggleCart(true)}
                  onKeyDown={(e) => {
                    this.handleKeyDown(e, 'cart');
                  }}
                  role='button'
                >
                  <CartIcon><i className='fa fa-shopping-cart' /></CartIcon>
                  {cartCount > 0 && <CartBadge className='cart-badge' data-length={cartCount}>
                    {cartCount}
                  </CartBadge>}
                  {/* <NavText><Trans i18nKey='NAVIGATION_CART'/></NavText> */}
                  <StyledTriangle open={cartOpen ? 1 : 0} notify={notifyCart ? 1 : 0} className='act' />
                </CartLink>
              </Flex>
            }
            {!showCartIcon && !multiPassEnabled && !digitalMenuId && siteAuthType !== 'none' && (((guestProfileEnabled && !ondToken) || (atriumEnabled && !samlCookie))
              ? <Flex>
                <SignInLink className='SignInLink' onClick={() => this.loginButton()}
                  onKeyDown={(e) => {
                    this.handleKeyDown(e, 'signin');
                  }}
                  role='navigation'
                  tabIndex={cartOpen ? 1 : 0} aria-label={i18n.t('NAVIGATION_SIGN_IN')}>
                  <SignInText><Trans i18nKey='NAVIGATION_SIGN_IN'/></SignInText>
                </SignInLink>
              </Flex>
              : <Flex className='profile-parent' style={{marginLeft: '15px'}}>
                <ProfileLink
                  innerRef={(e) => { this.profileLink = e; }}
                  className='ProfileLink'
                  tabIndex={cartOpen ? 1 : 0}
                  aria-label={i18n.t('PROFILE_LINK')}
                  onClick={this.toggleProfile}
                  onKeyDown={(e) => {
                    this.handleKeyDown(e, 'profile');
                  }}
                >
                  <i style={{ marginRight: '8px' }} className='fa fa-user-circle' />
                  <StyledProfileTriangle open={profileOpen ? 1 : 0} className='act' />
                </ProfileLink>
              </Flex>)
            }
            { showLogOutLink && !digitalMenuId &&
            <Flex className='logout-link-container'>
              <LogOutLink className='logout-link' onClick={() => this.logoutButton()}
                role='navigation'
                tabIndex={cartOpen ? 1 : 0}
                aria-label={i18n.t('NAVIGATION_SIGN_OUT')}
                onKeyDown={(e) => {
                  this.handleKeyDown(e, 'logout');
                }}>
                <i
                  style={{ marginRight: '8px' }}
                  className='fa fa-power-off'
                /> <NavText><Trans i18nKey='NAVIGATION_SIGN_OUT'/></NavText>
              </LogOutLink>
            </Flex>
            }
          </Navbar>
        </FullMenu>
        {
          menuOpen && (
            <FixedLayout
              className='menu-open'
              onClick={this.toggleMenu}
            />
          )
        }
        {
          cartOpen && (
            <FixedLayout
              style={{zIndex: '10'}}
              className='cart-open'
              onClick={() => this.toggleCart(false)}
            />
          )
        }
        {
          profileOpen && (
            <FixedLayout
              style={{zIndex: '10'}}
              className='profile-open'
              onClick={this.toggleProfile}
            />
          )
        }
        {showDrawerIcon && !digitalMenuId && <DrawerMenu className='drawer-menu' open={menuOpen} side='left' p={0}>
          <SideMenuTop>
            <SideMenuLogo
              ref={imageLoadedElem => (this.mobileLogo = imageLoadedElem)}
              className='mobile-logo'
              role='navigation'
              alt=''
              onClick={this.redirectNavLinkHome}
            />
            <CloseMenuButton aria-label={i18n.t('CLOSE_MENU')} tabIndex={menuOpen ? 0 : -1}
              style={{display: menuOpen ? 'block' : 'none'}}
              className='mobile-close-menu-button' children='&#10005;' onClick={this.toggleMenu} />
          </SideMenuTop>
          {
            menuData && menuData.data.map((menu, index) => {
              if (menu.isHome && isHomeEnabled && isScheduleOrderEnabled) {
                return (
                  <NavigationHomeLink
                    className={menu.id}
                    exact='true'
                    horizontal='true'
                    key={index}
                    target={menu.target}
                    onClick={this.redirectNavLinkHome}
                    style={{ display: menuOpen ? 'block' : 'none' }}
                    tabIndex={menuOpen ? 0 : -1}
                    aria-label={i18n.t(menu.primaryText)}
                  >
                    <i style={{ marginRight: '8px' }} className={menu.icon} />
                    {i18n.t(menu.primaryText)}
                  </NavigationHomeLink>);
              } else if (menu.id === 'concepts') {
                if (showConceptIcon) {
                  return (
                    <NavigationHomeLink
                      className={`${menu.id} conceptID`}
                      exact='true'
                      horizontal='true'
                      key={index}
                      target={menu.target}
                      onClick={this.redirectConcept}
                      style={{ display: menuOpen ? 'block' : 'none' }}
                      tabIndex={menuOpen ? 0 : -1}
                      aria-label={i18n.t(menu.primaryText)}
                    >
                      <i style={{ marginRight: '8px' }} className={menu.icon} />
                      {i18n.t(menu.primaryText)}
                    </NavigationHomeLink>
                  );
                }
              } else if (!menu.isHome && !menu.hidden) {
                return (
                  <NavigationLink
                    className={menu.id}
                    exact
                    horizontal='true'
                    key={index}
                    target={menu.target}
                    to={menu.path}
                    onClick={this.toggleMenu}
                    style={{ display: menuOpen ? 'block' : 'none' }}
                    tabIndex={menuOpen ? 0 : -1}
                    aria-label={i18n.t(menu.primaryText)}
                  >
                    <i style={{ marginRight: '8px' }} className={menu.icon} />
                    {i18n.t(menu.primaryText)}
                  </NavigationLink>
                );
              }
            })
          }
        </DrawerMenu>
        }
        { !showCartIcon &&
        <DrawerCart
          className='cart-popup'
          open={cartOpen}
          side='top'
          p={0}
          color='dark'
          bg='white'
          right={cartLinkOffsetRight}
          zIndex={100}
        >
          <CloseButton className='cart-close-button' tabIndex={cartOpen ? 0 : -1} role='button'
            style={{ display: cartOpen ? 'block' : 'none' }}
            aria-label={i18n.t('CLOSE_CART')} children={closeIcon} onClick={() => this.toggleCart(false)} />
          {cartOpen &&
            multiPassEnabled ? <ConnectedCommunalCart fillContent location={location} history={history} /> : cartOpen && <ConnectedCart fillContent location={location} history={history} />}
        </DrawerCart>
        }
        {!showCartIcon && <DrawerProfile
          className='profile-popup'
          open={profileOpen}
          side='top'
          p={0}
          color='dark'
          bg='white'
          right={profileLinkOffsetRight}
          zIndex={100}
        >
          <ProfileCloseButton className='profile-close-button' role='button'
            style={{ display: profileOpen ? 'block' : 'none' }}
            tabIndex={profileOpen ? 0 : -1} aria-label={i18n.t('EXIT_PROFILE')} children={closeIcon} onClick={this.toggleProfile} />
          {profileOpen && <ConnectedGuestDetails signOut={this.logoutButton}/>}
        </DrawerProfile>
        }
        { !showCartIcon &&
        <div ref={modifierRef => { this.modifierRef = modifierRef; }}>
          <DrawerNotification
            className='cart-notification'
            open={notifyCart}
            side='top'
            p={0}
            color='dark'
            bg='white'
            right={notificationCartoffsetRight}
            zIndex={100}
          >
            {multiPassEnabled ? <ConnectedCommunalCartNotification fillContent toggleCart={this.toggleCart} />
              : <ConnectedCartNotification fillContent toggleCart={this.toggleCart} />}
          </DrawerNotification>
        </div>
        }
        {showCopyLinkModal && <CopyLinkModal linkAddress={linkAddress} toggleMultiPassCopyLink={this.toggleMultiPassCopyLink} />}
      </React.Fragment>
    );
  }
}

NavigationMenu.propTypes = {
  showBackLink: PropTypes.bool,
  showCartLink: PropTypes.bool,
  showHomeLink: PropTypes.bool
};

export default NavigationMenu;
