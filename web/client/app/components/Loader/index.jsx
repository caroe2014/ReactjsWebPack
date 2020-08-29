// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import loading from './loading';
import theme from 'web/client/theme';
import styled from 'styled-components';

export default styled(loading)`
  margin-top: ${props => Number.parseInt(theme.nav.height)}px;
`;
