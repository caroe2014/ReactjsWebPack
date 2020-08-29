// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import ReactDOM from 'react-dom';
import auth from 'web/client/auth';
import Login from 'web/client/app/components/Login';

// Redirect to app when the user has an authenticated session.
const authCheck = async () => {
  if (await auth.checkAuth(false)) {
    auth.login(null);
  }
};
authCheck();

const siteAuth = document.getElementById('siteAuth').value;

if (siteAuth === 'email') {
  ReactDOM.render(
    <Login.Email
      emailAddress={document.getElementById('emailAddress').value}
      loginToken={document.getElementById('loginToken').value}
    />,
    document.getElementById('appContainer')
  );
}
if (siteAuth === 'ldap') {
  ReactDOM.render(
    <Login.LDAP tenantId={document.getElementById('tenantId').value}
      cboConfig={JSON.parse(document.getElementById('cboConfig').value)}/>,
    document.getElementById('appContainer')
  );
}
if (siteAuth === 'none') {
  ReactDOM.render(
    <Login.None tenantId={document.getElementById('tenantId').value} />,
    document.getElementById('appContainer')
  );
}
if (siteAuth === 'socialLogin') {
  ReactDOM.render(
    <Login.None tenantId={document.getElementById('tenantId').value} />,
    document.getElementById('appContainer')
  );
}
if (siteAuth === 'atrium') {
  ReactDOM.render(
    <Login.None tenantId={document.getElementById('tenantId').value} />,
    document.getElementById('appContainer')
  );
}
if (siteAuth === 'invalid') {
  ReactDOM.render(
    <Login.SiteDown />,
    document.getElementById('appContainer')
  );
}
