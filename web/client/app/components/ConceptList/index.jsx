// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import PropTypes from 'prop-types';
import { Flex, Heading, Text } from 'rebass';
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

const DigitalMenuError = styled(Container)`
  padding-top: 100px;
  ${props => props.theme.mediaBreakpoints.mobile`
    padding-top: 60px;
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

const ErrorHeading = styled(Text)`
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  color: ${props => props.theme.colors.primaryTextColor};
`;

const ErrorText = styled(Text)`
  text-align: center;
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.colors.primaryTextColor};
`;

const OpenTextContainer = styled(Flex)`
  flex-direction: column;
  position: relative;
  font-size: 14px;
  margin-top: 8px;
  z-index: 10;
  font-weight: 500;
`;

const TitleContainer = styled(Flex)`
  flex-direction: column;
`;

const TimingParent = styled.span`
  margin: auto;
  text-align: center;
  padding-top: 8px;
`;

const TimingMessage = styled.span`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 14px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TimingText = styled.span`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 14px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const openIcon = {
  color: theme.colors.open,
  fontSize: '16px'
};

const closeIcon = {
  color: theme.colors.close,
  fontSize: '16px'
};

class ConceptList extends Component {
  constructor (props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }
  componentWillMount () {
    this.props.digitalMenuId && this.props.keyProps.length === 1 && this.handleOnClick(this.props.keyProps[0].id);
  }
  handleOnClick (conceptId) {
    if (this.props.selectConcept) {
      this.props.selectConcept(conceptId);
    }
  }
  getTimingMessage (availableAt, isOpen) {
    if (availableAt) {
      let hour = parseInt(availableAt.time / 60);
      let minutes = availableAt.time % 60;
      if (isOpen) {
        return hour === 0 ? i18n.t('CONCEPT_CLOSES_IN', { minutes: minutes }) : i18n.t('CONCEPT_AVAILABLE_NOW');
      } else {
        const conceptTag = 'CONCEPT_AVAILABLE';
        const hourTag = hour > 0 ? '_HRS' : '';
        const minuteTag = minutes > 0 ? '_MIN' : '';
        return i18n.t(`${conceptTag}${hourTag}${minuteTag}`, { hours: hour, minutes: minutes });
      }
    } else {
      return i18n.t('CLOSED_NOW');
    }
  }
  render () {
    const { keyProps, isScheduleOrderEnabled, showOperationTimes, digitalMenuId, siteList, digitalMenuError } = this.props;
    const closedScreenInfo = digitalMenuError && siteList && siteList.length === 1 && siteList[0].closedScreen;
    return (
      <ThemeProvider theme={theme}>
        <React.Fragment>
          {keyProps.length === 0 && digitalMenuError &&
          <DigitalMenuError>
            <ErrorHeading
              tabIndex={0}
              aria-label={(closedScreenInfo && closedScreenInfo.headerText) || i18n.t('DIGITAL_MENU_NO_MENU_TITLE')}>
              {(closedScreenInfo && closedScreenInfo.headerText) || i18n.t('DIGITAL_MENU_NO_MENU_TITLE')}
            </ErrorHeading>
            <ErrorText
              tabIndex={0}
              aria-label={(closedScreenInfo && closedScreenInfo.instructionText) || i18n.t('DIGITAL_MENU_NO_MENU_INSTN')}>
              {(closedScreenInfo && closedScreenInfo.instructionText) || i18n.t('DIGITAL_MENU_NO_MENU_INSTN')}
            </ErrorText>

          </DigitalMenuError>
          }
          {keyProps.length > 0 &&
          <Container className='concept-list' p={[1, 2, 3, 4]}>
            <Toptext className='select-concept-header' role='heading' tabIndex={0} aria-level='2'>
              {!digitalMenuId && <Trans i18nKey='CONCEPT_LIST_PAGE_LABEL' />}</Toptext>
            <ListContainer className='concept-list-container'
              tabIndex={0}
              aria-label={`${(keyProps && keyProps.length > 1)
                ? `${i18n.t('CONCEPT_SELECT')} ${keyProps.length} ${i18n.t('CONCEPTS')}` : ``}`}>
              {keyProps && keyProps.map((item, index) => {
                let title = <TitleContainer>
                  <Text>{item.name}</Text>
                  <OpenTextContainer className='opens-text'>
                    {!digitalMenuId && !isScheduleOrderEnabled && showOperationTimes &&
                    <TimingMessage className='custom-title'>
                      {this.getTimingMessage(item.availableAt, item.availableNow)}
                    </TimingMessage>
                    }
                    {!digitalMenuId && showOperationTimes && item.availableAt && <TimingParent>
                      <i className='fa fa-clock-o'
                        style={item.availableNow ? openIcon : closeIcon}
                        alt=''
                      />
                      <TimingText
                        isopen={item.availableNow}
                        className='custom-time'
                        tabIndex={0}
                        aria-label={item.availableNow ? `${i18n.t('AVAILABLE_FROM')} ${item.availableAt.open} ${i18n.t('TO_LABEL')} 
                      ${item.availableAt.close}` : `${i18n.t('NOT_AVAILABLE_FROM')} ${item.availableAt.open} ${i18n.t('TO_LABEL')}
                      ${item.availableAt.close}`}
                      >
                        {` ${item.availableAt.open} - ${item.availableAt.close}`}
                      </TimingText>
                    </TimingParent>}
                  </OpenTextContainer>
                </TitleContainer>;

                return <React.Fragment key={`concept-${item.id}`}>
                  <Tile
                    classContext={`tile concept-${index + 1} concept_${item.id}`}
                    className='tile'
                    imageresponsive='true'
                    title={title}
                    titleStyle={{ width: '100%', textAlign: 'center' }}
                    image={item.image}
                    id={item.id}
                    handleClick={this.handleOnClick}
                    isEnabled={item.availableNow}
                    closedoverlay={!digitalMenuId}
                    ariaLabel={`concept${index + 1} ${item.name}`}
                    tabIndex={0}
                  />
                </React.Fragment>;
              })}
            </ListContainer>
          </Container>
          }
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

ConceptList.propTypes = {
  selectConcept: PropTypes.func,
  keyProps: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      id: PropTypes.any.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  )
};
export default ConceptList;
