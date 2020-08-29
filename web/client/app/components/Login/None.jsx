// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import theme from 'web/client/theme';
import { Flex, Provider } from 'rebass';
import config from 'app.config';
import auth from 'web/client/auth';
import Loading from 'web/client/app/components/Loader/loading';
import styled, { css, ThemeProvider } from 'styled-components';
import SiteDown from './SiteDown';

const loadingTheme = {
  colors: {
    ...theme.colors,
    light: theme.colors.loginFormBackground,
    tertiary: theme.colors.light
  },
  mediaBreakpoints: {
    mobile: (...args) => css`@media (max-width: 32em) {${css(...args)}}`,
    tablet: (...args) => css`@media (max-width: 72em) {${css(...args)}}`,
    desktop: (...args) => css`@media (min-width: 72em) {${css(...args)}}`
  }
};

const logger = config.logger.child({ childName: 'login-none' });

const Container = styled(Flex)`
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  margin: 0;
  padding: 0;
  opacity: 0.99;
`;

const SiteDownBox = styled(Flex)`
  display: ${props => {
    if (props.error) return 'block';
    return 'none';
  }};
`;

export default class None extends Component {
  constructor (props) {
    super(props);
    this.state = {
      authenticated: false,
      loading: false,
      error: undefined
    };
  }
  componentDidMount () {
    axios.put(`${config.webPaths.api}login/anonymous/${this.props.tenantId}`)
      .then((results) => {
        this.setState({ authenticated: true, loading: false, error: undefined });
        auth.login(results.headers);
      })
      .catch(error => {
        logger.error(`${error.response.status}: ${error.response.data.message}`);
        this.setState({ authenticated: false, error: `${error.response.data.message}`, loading: false });
      });
  }
  render () {
    const { error, authenticated, loading } = this.state;
    return (
      <Provider theme={theme} style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
        {window.localStorage.getItem(config.auth.apiHeader) && <Redirect to='/' />}
        <Container>
          <Flex
            width={[1, 2 / 3, 2 / 5]}
            px={[30, 0]}
            flexDirection='column'
            style={{ padding: 0, maxWidth: '30em' }}
          >
            <SiteDownBox error={error}>
              <SiteDown />
            </SiteDownBox>
            {!authenticated && loading && <ThemeProvider theme={loadingTheme}><Loading /></ThemeProvider>}
          </Flex>
        </Container>
      </Provider>
    );
  }
}
