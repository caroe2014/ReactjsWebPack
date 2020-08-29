// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Flex, Heading } from 'rebass';
import PropTypes from 'prop-types';
import theme from 'web/client/theme.js';
import Item from '../Item/Item';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';

const Container = styled(Flex)`
  flex-direction: column;
  margin: 120px auto 0px auto;
  height: fit-content;
  max-width: 75em;
  width: 100%;
  padding: 0px;
  &:after{
    content: '';
    margin: auto;
    width: 100%;
    max-width: 570px;
    }
  ${props => props.theme.mediaBreakpoints.mobile`
    justify-content: center;
    padding-left: 10px;
    padding-right: 10px;
  `}
  ${props => props.theme.mediaBreakpoints.tablet`
    justify-content: center;
  `}
  ${props => props.theme.mediaBreakpoints.desktop`
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
  `}
`;

const ListContainer = styled(Flex)`
  flex-direction: column;
  flex-flow: row wrap;
  height: fit-content;
  max-width: 75em;
  width: 100%;
  padding: 0px;
  &:after{
    content: '';
    margin: auto;
    width: 100%;
    max-width: 570px;
    }
  ${props => props.theme.mediaBreakpoints.mobile`
    justify-content: center;
  `}
  ${props => props.theme.mediaBreakpoints.tablet`
    justify-content: center;
  `}
  ${props => props.theme.mediaBreakpoints.desktop`
    justify-content: space-between;
  `}
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const Toptext = styled(Heading)`
  width: 100%;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
  font-weight: 700;
  ${props => props.theme.mediaBreakpoints.tablet`margin: 20px auto; max-width: 570px;`}
  ${props => props.theme.mediaBreakpoints.mobile`padding-left: 0px;`}
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class ItemList extends Component {

  render () {

    const { keyProps, showAddButton, addItemToCart, selectItem, currencyDetails, validList, digitalMenuId, itemDisplayList } = this.props; // eslint-disable-line max-len

    return (
      <ThemeProvider theme={theme}>
        <Container className='item-list' p={[1, 2, 3, 4]} m={[0, 2]}>

          <Toptext className='select-item-header' role='heading' tabIndex={0} aria-level='2'>
            {!digitalMenuId && <Trans i18nKey='ITEM_LIST_PAGE_LABEL' />}</Toptext>
          <ListContainer className='item-listcontainer'
            tabIndex={0}
            aria-label={`${(keyProps && keyProps.length > 1)
              ? `${i18n.t('ITEM_SELECT')} ${keyProps.length} ${i18n.t('ITEMS')}` : ``}`}>
            {keyProps && validList && keyProps.map((item, index) => (
              <React.Fragment key={`item-${item.id.toString()}`} >
                <Item
                  className={`tile item-${index + 1}`}
                  keyProps={item}
                  showAddButton={showAddButton}
                  addItemToCart={addItemToCart}
                  selectItem={selectItem}
                  digitalMenuId={digitalMenuId}
                  currencyDetails={currencyDetails}
                  ariaLabel={`item${index + 1} ${item.displayText}`}
                  tabIndex={0}
                  itemDisplayList={itemDisplayList}
                />
              </React.Fragment>
            ))}
          </ListContainer>
        </Container>
      </ThemeProvider>
    );
  }
}

ItemList.propTypes = {
  keyProps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      image: PropTypes.string,
      attributes: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired
        }))
    }).isRequired
  ).isRequired,
  currencyDetails: PropTypes.object,
  itemDisplayList: PropTypes.array
};

export default ItemList;
