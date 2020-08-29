// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import PropTypes from 'prop-types';
import { Flex, Heading } from 'rebass';
import Tile from 'web/client/app/components/Tile';
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
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class CategoryList extends Component {

  render () {
    const { keyProps, selectCategory, digitalMenuId } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Container className='category-list' p={[1, 2, 3, 4]}>
          <Toptext className='select-category-header' role='header' tabIndex={0}
            aria-label={i18n.t('CATEGORY_LIST_PAGE_LABEL')}>
            {!digitalMenuId && <Trans i18nKey='CATEGORY_LIST_PAGE_LABEL' />}</Toptext>
          <ListContainer className='category-list-container'
            tabIndex={keyProps.length > 1 ? 0 : -1}
            aria-label={`${(keyProps.length > 1)
              ? `${i18n.t('CATEGORY_SELECT')} ${keyProps.length} ${i18n.t('CATEGORIES')}` : ``}`}>
            {keyProps && keyProps.map((item, index) => (
              <React.Fragment key={item.id}>
                <Tile
                  classContext={`tile category-${index + 1} category_${item.id}`}
                  imageresponsive='true'
                  className='tile'
                  title={item.name}
                  image={item.image}
                  id={item.id}
                  handleClick={selectCategory}
                  ariaLabel={`category${index + 1} ${item.name}`}
                  tabIndex={0}
                />
              </React.Fragment>
            ))}
          </ListContainer>
        </Container>
      </ThemeProvider>
    );
  }
}

CategoryList.propTypes = {
  selectCategory: PropTypes.func,
  keyProps: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  )
};
export default CategoryList;
