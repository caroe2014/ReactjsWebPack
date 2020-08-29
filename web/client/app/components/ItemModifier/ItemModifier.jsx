// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Flex, Tab, Text } from 'rebass';
import PropTypes from 'prop-types';
import theme from 'web/client/theme.js';
import ArrowHorizontalScroll from 'web/client/app/components/ArrowHorizontalScroll';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width:100%;
  .sticky {
    position: fixed;
    top: 120px;
    width: 100%;
    max-width: ${props => props['max-width']}px;
    background-color: white;
  }
`;

const StyledTabs = styled.div`
  color: ${props => props.theme.colors.white};
  z-index: 110;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StyledTab = styled(Tab)`
  cursor: pointer;
  display: flex;
  flex: 0 0 120px;
  justify-content: center;
  align-items: flex-start;
  padding-top: 21px;
  min-height: 100px;
  position:relative;
  border: none;
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    height:59px;
    flex: 0 0 auto;
  }
  ${props => props.theme.mediaBreakpoints.desktop`
    padding-left: 1em;
    padding-right: 1em;
  `};
  ${props => props.theme.mediaBreakpoints.mobile`
    padding-left: 0.5em;
    padding-right: 0.5em;
  `};
  &.active {
    color: ${props => props.theme.colors.addOnTab};
    &::after {
      transform: scaleX(1);
    }
  }
  &:hover { color: ${props => props.theme.colors.addOnTab}; }
  &::after {
    position:absolute;
    content: '';
    width: 100%;
    height: 0px;
    bottom: 40px;
    border-bottom: solid 2px ${props => props.theme.colors.buttonControlColor};
    transform: scaleX(0);
    transition: transform 250ms ease-in-out;
    @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
      left: 0;
    }
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TabBorder = styled.div`
  position: absolute;
  border: 0.5px solid lightgrey;
  width: 100%;
  margin: auto;
  top: 60px;
`;

const TabText = styled(Text)`
  color: ${props => props.theme.colors.buttonControlColor};
  display: inline-block;
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: 500;
  padding: 0px 10px;
  &.active {
    font-weight: 500;
  }
`;

const StyledTile = styled(Flex)`
  flex-direction: column;
  width: 100%
  min-height: 48px;
  justify-content: center;
  border-bottom: 0.5px solid ${props => props.theme.colors.itemBorder};
`;

const SubTile = styled(Flex)`
  font-size: ${props => props.theme.fontSize.nm};
  height: 40px;
  padding: 0.5em 1em;
  border: 0.5px solid ${props => props.theme.colors.tile};
  border-radius: 20px;
  margin-top: 16px;
  margin-bottom: 16px;
  &.active {
    border: 2px solid ${props => props.theme.colors.buttonControlColor};
    color: ${props => props.theme.colors.buttonControlColor};
  }
  color: ${props => props.theme.colors.tile};
  margin-left: 20px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:first-child {
    margin-left : 55px;
  }
  flex: 0 0 auto;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const SubTileText = styled(Text)`
  font-size: 14px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StyledTileTop = styled(Flex)`
  flex-direction: row;
  width: 100%
  cursor: pointer;
  justify-content: space-between;
  ${props => props.theme.mediaBreakpoints.desktop`padding: 10px 20px 10px 20px`};
  ${props => props.theme.mediaBreakpoints.tablet`padding: 10px 0 10px 20px`};
  align-items: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StyledText = styled(Text)`
  margin-left: 20px;
  color: ${props => props.theme.colors.secondaryTextColor};
  display: inline-block;
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: 400;
  &.active {
    font-weight: 500;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const AddonLimitText = styled(Text)`
  margin-left: 10px;
  color: grey;
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 400;
  color: ${props => props.theme.colors.secondaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StyledAmount = styled(Text)`
  ${props => props.theme.mediaBreakpoints.desktop`margin-right: 0px;`};
  margin-right: 20px;
  color: ${props => props.theme.colors.secondaryTextColor};
  display: inline-block;
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: 400;
  &.active {
    display: inline-block;
    font-weight: 500;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const RequiredText = styled(Text)`
  min-height: 30px;
  position: absolute;
  color: ${props => props.error === 'true' ? props.theme.colors.validationError : props.theme.colors.textGrey};
  opacity: 0.75
  font-size: 14px;
  left: 0;
  right: 0;
  bottom: 0px;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const arrowStyle = {
  alignItems: 'center',
  fontSize: theme.fontSize.nm,
  display: 'inline-block',
  alignSelf: 'center'
};

const marginStyle = {
  marginTop: '16px'
};

const StyledDiv = styled(Flex)`
  flex-direction: column;
`;

const tabStyle = {
  minHeight: '60px',
  width: '100%'
};

const ScrollArrow = styled(Flex)`
  align-items: center;
  justify-content: center;
  box-shadow: -1px 0 2px rgba(0, 0, 0, 0.5);
  background-color: rgba(0, 0, 0, .5);
  width: 40px;
  height: 100%;
  max-height: 60px;
  & > i {
    color : white;
    font-size: 30px;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TabRightArrow = styled(ScrollArrow)`
  border-bottom-left-radius: 30px;
  border-top-left-radius: 30px;
  background-color: rgba(0, 0, 0, .45);
  & > i {
    padding-left: 10px;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TabLeftArrow = styled(ScrollArrow)`
  border-bottom-right-radius: 30px;
  border-top-right-radius: 30px;
  background-color: rgba(0, 0, 0, .45);
  & > i {
    padding-right: 10px;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const IconParent = styled.div`
  display: flex;
  align-items: center;
  & > i {
    color: ${props => props.theme.colors.buttonControlColor};
  }
`;

const SubTabRightArrow = styled(TabRightArrow)`
  margin-top: 5px;
  background-color: rgba(0, 0, 0, .5);
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const SubTabLeftArrow = styled(TabLeftArrow)`
  margin-top: 5px;
  background-color: rgba(0, 0, 0, .5);
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModifierHeader = styled(Flex)`
  min-height: 40px;
  overflow-y: hidden;
  background-color: ${props => props.theme.colors.addonBg};
  align-items: center;
  padding-left:20px;
  margin : 0px 20px 0px 20px;
  color:${props => props.theme.colors.secondaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const toolbarHeight = 120;

class ItemModifier extends Component {
  constructor (props) {
    super(props);
    let modifiers = JSON.parse(JSON.stringify(this.props.modifiers));
    // sort required modifiers to the top.
    modifiers.modifiers.sort((a, b) => (b.minimum - a.minimum));
    this.state = {
      selectedTab: modifiers.modifiers[0].id,
      modifierObject: modifiers.modifiers[0],
      modifiers: modifiers,
      tabWidth: 0
    };
    this.switchTab = this.switchTab.bind(this);
    this.handleKeyDownSwitchTab = this.handleKeyDownSwitchTab.bind(this);
    this.handleKeyDownUpdateModifier = this.handleKeyDownUpdateModifier.bind(this);
    this.handleKeyDownUpdateSubOption = this.handleKeyDownUpdateSubOption.bind(this);
    this.updateModifierOption = this.updateModifierOption.bind(this);
    this.updateSubOption = this.updateSubOption.bind(this);
    this.getAddonAmount = this.getAddonAmount.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.validateModifiers = this.validateModifiers.bind(this);
  }
  componentWillMount () {
    window.addEventListener('scroll', this.handleScroll, true);
    window.addEventListener('resize', this.onWindowResize, true);
  }
  componentDidMount () {
    this.stickyPosition = this.modifierRef ? this.modifierRef.offsetTop : 0;
    this.setState({ tabWidth: this.modifierParent ? this.modifierParent.offsetWidth : 0 });
    this.validateModifiers(this.state.modifiers);
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll, true);
    window.removeEventListener('resize', this.onWindowResize, true);
  }
  handleScroll (event) {
    if (event.target.id !== 'scroll-content' && this.modifierRef !== null) {
      let tabHeight = this.modifierRef.clientHeight;
      let currentPosition = this.modifierRef.classList.contains('sticky') ? this.stickyPosition - tabHeight : this.stickyPosition; // eslint-disable-line max-len
      if (window.pageYOffset + toolbarHeight > currentPosition) {
        this.modifierRef.classList.add('sticky');
      } else {
        this.modifierRef.classList.remove('sticky');
      }
    }
  }
  onWindowResize () {
    let tabWidth = this.modifierParent ? this.modifierParent.offsetWidth : 0;
    if (this.state.tabWidth !== tabWidth) {
      this.setState({ tabWidth: tabWidth });
    }
  }
  updateModifierOption (modifierCategory, type, selectedOption) {
    let { modifiers } = this.state.modifiers;
    let modifierTypes = modifiers.find(modifier => modifier.id === modifierCategory.id);
    let selectedOptions = modifierTypes.options.filter(option => option.selected);
    let maximumOptions = modifierTypes.maximum;
    if (type === 'radio') {
      modifierTypes.options = modifierTypes.options.map((option) => {
        if (option.id === selectedOption && !option.selected) {
          option.selected = true;
          if (option.options && option.options.length > 0) {
            option.options[0].selected = true;
            option.suboption = [option.options[0]];
            if (option.options[0].amount) {
              option.amount = (Number(option.baseAmount) + Number(option.options[0].amount)).toFixed(2);
            }
          }
        } else {
          option.selected = false;
          option.amount = option.baseAmount;
          option.suboption = null;
          if (option.options) {
            option.options = option.options.map((subOption) => {
              if (subOption.selected) {
                subOption.selected = false;
              }
              return subOption;
            });
          }
        }
        return option;
      });
    }

    if (type === 'checkbox') {
      modifierTypes.options = modifierTypes.options.map((option) => {
        if (option.id === selectedOption) {
          // Can't select modifiers beyond the maximum limit
          if ((!option.selected && selectedOptions.length < maximumOptions) || option.selected) {
            option.selected = !option.selected;
          } else {
            this.props.onNotify(i18n.t('ITEM_MODIFIERS_MAX_LIMIT', { maximumOptions: maximumOptions }));// eslint-disable-line max-len
          }

          if (option.options) {
            if (option.selected) {
              if (option.options && option.options.length > 0) {
                option.options[0].selected = true;
                option.suboption = [option.options[0]];
                if (option.options[0].amount) {
                  option.amount = (Number(option.baseAmount) + Number(option.options[0].amount)).toFixed(2);
                }
              }
            } else {
              option.amount = option.baseAmount;
              option.suboption = null;
              option.options = option.options.map((subOption) => {
                if (subOption.selected) {
                  subOption.selected = false;
                }
                return subOption;
              });
            }
          }
        }
        return option;
      });
    }
    let modifiersList = Object.assign({}, this.state.modifiers);
    let selectedModifiers = this.getSelectedModifiers(modifiersList);
    modifiersList.addOnAmount = this.getAddonAmount(modifiersList);
    this.setState({ modifiers: modifiersList, modifierObject: modifierTypes });
    this.validateModifiers(modifiersList);
    this.props.handlerFromParent({ modifiersList, selectedModifiers });
  }

  validateModifiers (modifiersList) {
    let isValid = true;
    let invalidModifiers = [];
    modifiersList.modifiers.filter(i => i.minimum > 0).forEach(i => {
      if (!(i.options.filter(e => e.selected).length >= i.minimum)) {
        isValid = false;
        invalidModifiers.push(i);
      }
    });
    if (typeof this.props.onValidate === 'function') {
      this.props.onValidate(isValid, invalidModifiers);
    }
    return invalidModifiers;
  }

  getSelectedModifiers (modifiers) {
    let selectedModifiers = [];
    modifiers.modifiers.map((tabs) => tabs.options.map(item => {
      item.selected && selectedModifiers.push({ ...item });
    }));
    return selectedModifiers;
  }

  getAddonAmount (modifiers) {
    let totalAddOnAmount = 0;
    modifiers.modifiers.map((tabs) => {
      const selectedOptions = tabs.options.filter(item => (item.selected === true && item.amount));
      selectedOptions.map((option) => {
        totalAddOnAmount = totalAddOnAmount + Number(option.amount);
      });
    });

    return totalAddOnAmount;
  }

  switchTab (tabKey) {
    const modifierObject = this.state.modifiers.modifiers.find(item => item.id === tabKey);
    this.setState({ selectedTab: tabKey, modifierObject: modifierObject });
    if (tabKey === modifierObject.id && document.getElementById('modifiers-choose')) {
      document.getElementById('modifiers-choose').focus();
    }
  }

  handleKeyDownSwitchTab (event, tabKey) {
    // TODO: make this usable by all clickable elements,
    //  pass in caller's onclickhandler (13 is keycode for enter key, 32 is spacebar)
    if (event.which === 13 || event.which === 32) {
      const modifierObject = this.state.modifiers.modifiers.find(item => item.id === tabKey);
      this.setState({ selectedTab: tabKey, modifierObject: modifierObject });
      if (tabKey === modifierObject.id && document.getElementById('modifiers-choose')) {
        document.getElementById('modifiers-choose').focus();
      }
    }
  }

  handleKeyDownUpdateModifier (event, modifierObject, modifierObjectType, id) {
    // TODO: make this usable by all clickable elements,
    //  pass in caller's onclickhandler (13 is keycode for enter key, 32 is spacebar)
    if (event.which === 32) {
      this.updateModifierOption(modifierObject, modifierObjectType, id);
    }
  }

  handleKeyDownUpdateSubOption (event, modifierObject, modifierObjectType, itemId, subItemId) {
    // TODO: make this usable by all clickable elements,
    //  pass in caller's onclickhandler (13 is keycode for enter key, 32 is spacebar)
    if (event.which === 13 || event.which === 32) {
      this.updateSubOption(modifierObject,
        modifierObjectType, itemId, subItemId);
    }
  }

  updateSubOption (object, type, optionId, subOptionId) {
    let { modifiers } = this.state.modifiers;
    let modifierTypes = modifiers.find(modifier => modifier.id === object.id);
    let selectedOptions = modifierTypes.options.filter(option => option.selected);
    let maximumOptions = modifierTypes.maximum;
    let modAmount = Number(this.state.totalAmount);
    if (type === 'radio') {
      modifierTypes.options = modifierTypes.options.map((option) => {
        if ((!option.selected && selectedOptions.length < maximumOptions) || option.selected) {
          if (option.id === optionId) {
            option.options = this.subOptionCheck(option, subOptionId);
            option.selected = option.suboption && option.suboption.length > 0;
          } else {
            option.selected = false;
            option.suboption = null;
            option.amount = option.baseAmount;
            option.options && option.options.map((subOption) => { subOption.selected = false; });
          }
        } else {
          this.props.onNotify(i18n.t('ITEM_MODIFIERS_MAX_LIMIT', { maximumOptions: maximumOptions }));// eslint-disable-line max-len
        }
        return option;
      });
    }

    if (type === 'checkbox') {
      modifierTypes.options = modifierTypes.options.map((option) => {
        if (option.id === optionId) {
          if ((!option.selected && selectedOptions.length < maximumOptions) || option.selected) {
            option.options = this.subOptionCheck(option, subOptionId);
            option.selected = option.suboption && option.suboption.length > 0;
          } else {
            this.props.onNotify(i18n.t('ITEM_MODIFIERS_MAX_LIMIT', { maximumOptions: maximumOptions }));// eslint-disable-line max-len
          }
        }
        return option;
      });
    }
    let modifiersList = Object.assign({}, this.state.modifiers);
    let selectedModifiers = this.getSelectedModifiers(modifiersList);
    modifiersList.addOnAmount = this.getAddonAmount(modifiersList);
    this.setState({ modifiers: modifiersList, modifierObject: modifierTypes, totalAmount: modAmount });
    this.validateModifiers(modifiersList);
    this.props.handlerFromParent({ modifiersList, selectedModifiers });
  }

  subOptionCheck (option, subOptionId) {
    return option.options.map((subOption) => {
      if (subOption.id === subOptionId) {
        option.suboption = option.suboption || [];
        if ((!subOption.selected && option.suboption.length < option.maximum) || subOption.selected || option.type === 'radio') { // eslint-disable-line max-len
          subOption.selected = !subOption.selected;
          if (subOption.selected) {
            option.amount = (Number(option.amount) + Number(subOption.amount)).toFixed(2);
            if (option.type === 'radio') {
              option.suboption = [];
            }
            option.suboption.push(subOption);
          } else {
            option.amount = (Number(option.amount) - Number(subOption.amount)).toFixed(2);
            if (option.type === 'radio') {
              option.suboption = [];
            } else {
              option.suboption.splice(option.suboption.findIndex(c => c.id === subOptionId), 1);
            }
          }
        } else {
          this.props.onNotify(i18n.t('ITEM_MODIFIERS_MAX_LIMIT', { maximumOptions: option.maximum }));// eslint-disable-line max-len
        }
      } else {
        if (option.type === 'radio' && subOption.selected) {
          subOption.selected = false;
          option.amount = (Number(option.amount) - Number(subOption.amount)).toFixed(2);
        }
      }
      return subOption;
    });
  }

  render () {
    const { modifiers, selectedTab } = this.state;
    const { showValidationState, currencyDetails } = this.props;
    const chooseTag = (strs, ...keys) => {
      let min = parseInt(keys[0]);
      const max = parseInt(keys[1]);
      if (min <= 0) {
        return i18n.t('ITEM_MODIFIERS_ADDON_UP_TO', { min: min, max: max });
      } else if (max === 1) {
        return i18n.t('ITEM_MODIFIERS_ADDON_ANY', { min: min, max: max });
      }
      return i18n.t('ITEM_MODIFIERS_ADDON_MIN_MAX', { min: min, max: max });
    };

    return (
      <ThemeProvider className='item-modifier-block' theme={theme}>
        <Container className='modifiers' max-width={this.state.tabWidth} innerRef={modifierParent => { this.modifierParent = modifierParent; }}> {/* eslint-disable-line max-len */}
          <StyledTabs className='modifier-tabs' role='tablist' tabIndex={0}
            innerRef={modifierRef => { this.modifierRef = modifierRef; }}>
            <ArrowHorizontalScroll
              classContext='modifier-tabs-list'
              leftArrow={<TabLeftArrow tabIndex={0}><i className='fa fa-angle-left' /></TabLeftArrow>}
              rightArrow={<TabRightArrow tabIndex={0}><i className='fa fa-angle-right' /></TabRightArrow>}
              contentStyle={tabStyle}>
              {modifiers.modifiers && modifiers.modifiers.map((item, index) => (
                <React.Fragment key={item.id}>
                  <StyledTab
                    id='tab-list'
                    role='tab'
                    className={`tab_${index + 1} ${item.id} ${selectedTab === item.id ? 'active' : ''}`}
                    onClick={() => { this.switchTab(item.id); }}
                    onKeyDown={(e) => {
                      this.handleKeyDownSwitchTab(e, item.id);
                    }}
                    tabIndex={0}
                    aria-selected={selectedTab === item.id}
                    aria-label={item.minimum > 0 ? `${item.description} ${i18n.t('ITEM_DETAILS_REQUIRED')}`
                      : item.description}
                  >
                    <TabText>{item.description}</TabText>
                    { item.minimum > 0 &&
                      <RequiredText className='required-text'
                        error={(!(item.options.filter(i => i.selected).length >= item.minimum) &&
                        showValidationState).toString()}>
                        <Trans i18nKey='ITEM_DETAILS_REQUIRED'/>
                      </RequiredText>
                    }
                  </StyledTab>
                  <TabBorder />
                </React.Fragment>
              ))}
            </ArrowHorizontalScroll>
          </StyledTabs>
          <StyledDiv>
            <ModifierHeader
              className='header-text'
              id='modifiers-choose'
              children={chooseTag`Choose ${this.state.modifierObject.minimum} to ${this.state.modifierObject.maximum} add-ons`} // eslint-disable-line max-len
              tabIndex={0}
              aria-label={chooseTag`Choose ${this.state.modifierObject.minimum} to ${this.state.modifierObject.maximum} add-ons`} // eslint-disable-line max-len
            />
            {modifiers.modifiers &&
              this.state.modifierObject.options.map((item, index) => (
                <React.Fragment key={item.id}>
                  <StyledTile className={`option modifier_0ption_${index + 1}`}>
                    <StyledTileTop
                      className={`option_id_${item.id}`}
                      onClick={() => {
                        this.updateModifierOption(this.state.modifierObject, this.state.modifierObject.type, item.id);
                      }}
                      onKeyDown={(e) => {
                        this.handleKeyDownUpdateModifier(e, this.state.modifierObject,
                          this.state.modifierObject.type, item.id);
                      }}
                      tabIndex={0}
                      role={this.state.modifierObject.type}
                      aria-checked={item.selected}
                      style={item.options && marginStyle}
                      pl={[20, 20, 0]}
                    >
                      <IconParent>
                        {this.state.modifierObject.type === 'radio' &&
                          <i
                            className={`${!item.selected ? 'fa fa-circle-thin' : 'fa fa-check-circle'}`}
                            style={arrowStyle}
                          />}
                        {this.state.modifierObject.type === 'checkbox' &&
                          <i
                            className={`${!item.selected ? 'fa fa-square-o' : 'fa fa-check-square'}`}
                            style={arrowStyle}
                          />}
                        <StyledText className={`option_desc ${item.selected ? 'active' : ''}`}>
                          {item.description}
                        </StyledText>
                        {item.options && item.maximum > 1 &&
                        <AddonLimitText tabIndex={0}
                          aria-label={`(${i18n.t('CHOOSE_ANY')} ${item.minimum || '1'}-${item.maximum})`}>
                          {`(${i18n.t('CHOOSE_ANY')} ${item.minimum || '1'}-${item.maximum})`}
                        </AddonLimitText>
                        }
                      </IconParent>
                      {item.amount &&
                      <StyledAmount className={`option_amount ${item.selected ? 'active' : ''}`}>
                        {currencyLocaleFormat(item.amount, currencyDetails)}
                      </StyledAmount>
                      }
                    </StyledTileTop>
                    {item.options &&
                      <ArrowHorizontalScroll
                        classContext={`SubOptionsList${item.id}`}
                        key={index}
                        leftArrow={<SubTabLeftArrow><i className='fa fa-angle-left' /></SubTabLeftArrow>}
                        rightArrow={<SubTabRightArrow><i className='fa fa-angle-right' /></SubTabRightArrow>}
                        contentStyle={tabStyle}
                        tabIndex={item.selected ? 0 : -1}
                      >
                        { item.options.map((subItem) => (
                          <React.Fragment key={subItem.id}>
                            <SubTile
                              className={`subitem_${subItem.id} ${subItem.selected ? ' active' : ''}`}
                              onClick={() => {
                                this.updateSubOption(this.state.modifierObject,
                                  this.state.modifierObject.type, item.id, subItem.id);
                              }}
                              onKeyDown={(e) => {
                                this.handleKeyDownUpdateSubOption(e, this.state.modifierObject,
                                  this.state.modifierObject.type, item.id, subItem.id);
                              }}
                              tabIndex={item.selected ? 0 : -1}
                              role='tab'
                              aria-selected={subItem.selected}
                              aria-label={`${i18n.t('SUB_OPTION')} ${subItem.description}`}
                            >
                              <SubTileText className='subitem-text'>
                                {subItem.description}  {item.options && subItem.amount &&
                                  currencyLocaleFormat(subItem.amount, currencyDetails)}
                              </SubTileText>
                            </SubTile>
                          </React.Fragment>
                        ))}
                      </ArrowHorizontalScroll>
                    }
                  </StyledTile>
                </React.Fragment>
              )
              )}
          </StyledDiv>
        </Container>
      </ThemeProvider>
    );
  }
}

ItemModifier.propTypes = {
  modifiers: PropTypes.shape({
    id: PropTypes.number,
    modifiers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            selected: PropTypes.bool.isRequired,
            options: PropTypes.arrayOf(
              PropTypes.shape({
                id: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                selected: PropTypes.bool.isRequired,
                amount: PropTypes.string.isRequired
              }))
          })).isRequired
      }))
  }),
  currencyDetails: PropTypes.object.isRequired
};

export default ItemModifier;
