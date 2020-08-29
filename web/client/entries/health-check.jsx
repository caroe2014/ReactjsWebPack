// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import config from 'app.config';
import axios from 'axios';
import { Flex, Text, Box, Border, Pre, Link } from 'rebass';
import auth from 'web/client/auth';

const authrorized = auth.checkAuth();

const logger = config.logger.child({ childName: 'health-check' });
const serviceContext = `${config.webPaths.serviceContext}${config.webPaths.serviceContext ? `/` : ''}`;

const HealthCheckLink = styled(Link)`
  cursor: pointer;
`;

export class HealthCheck extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      frameContent: null
    };

    this.updateHeathCheckSummary = this.updateHeathCheckSummary.bind(this);
    this.updateManifest = this.updateManifest.bind(this);
  }

  componentDidMount () {
    this.updateHeathCheckSummary();
  }

  handleClick (fn) {
    this.setState({
      loading: false,
      error: false
    }, fn);
  }

  updateHeathCheckSummary () {
    axios.get(`${serviceContext}internal/healthchecks`)
      .then((results) => {
        this.setState({
          frameContent: JSON.stringify(results.data, null, 2),
          loading: false
        });
      })
      .catch(error => {
        logger.error(error);
        this.setState({ error: true });
      });
  }

  updateManifest () {
    axios.get(`${serviceContext}internal/manifest`)
      .then((results) => {
        this.setState({
          frameContent: JSON.stringify(results.data, null, 2),
          loading: false
        });
      })
      .catch(error => {
        logger.error(error);
        this.setState({ error: true });
      });
  }

  render () {

    const loading = this.state.loading && !this.state.error ? (<Text> Loading... </Text>) : null;
    const error = this.state.error ? (<Text color='red'> Error loading health check information </Text>) : null;

    const pre = (<Pre style={{ whiteSpace: 'pre-wrap' }} children={this.state.frameContent} />);

    const frame = !this.state.loading && !this.state.error ? pre : null;

    return (
      <Flex flexWrap='wrap' flexDirection={['column', 'row']} px={10} py={20} style={{ height: '100%' }}>
        <Box flex='0 1 auto' mr={20} pb={10}>
          <ul>
            <li>
              <HealthCheckLink
                className='health-check-link'
                onClick={() => this.handleClick(this.updateHeathCheckSummary)} children='Health Check Summary' />
            </li>
            <li>
              <HealthCheckLink
                className='health-check-link2'
                onClick={() => this.handleClick(this.updateManifest)}
                children='Manifest'
              />
            </li>
          </ul>
        </Box>
        <Flex flex='1 1'>
          <Border className='text-here' p={10} w={'100%'}>
            {error}
            {loading}
            {frame}
          </Border>
        </Flex>
      </Flex>);
  }
}
if (process.env.NODE_ENV !== 'test') {
  const renderHealthcheck = async () => {
    if (await authrorized) {
      ReactDOM.render(
        <HealthCheck />,
        document.getElementById('appContainer')
      );
    }
  };
  renderHealthcheck();
}
