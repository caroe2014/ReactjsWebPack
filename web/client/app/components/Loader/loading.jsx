// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import styled from 'styled-components';
import { LoadingComponent } from './ReusableLoader';

const LoadingContainer = styled.div`
  display:flex;
  flex-direction: column;
  width: 100%;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default (props) => <LoadingContainer className='loading-parent'><LoadingComponent/></LoadingContainer>;
