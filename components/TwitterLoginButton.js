import React from 'react';
import { TwitterLoginButton } from 'react-twitter-widgets';

const TwitterLoginButtonfun = ({ onLogin }) => {
  const handleTwitterLogin = (authData) => {
    // Callback function to handle the Twitter login response
    if (authData && authData.oauth_token && authData.oauth_token_secret) {
      // Handle successful Twitter login, you can fetch user details here
      console.log('Twitter login successful:', authData);
      onLogin(authData);
    } else {
      // Handle Twitter login failure
      console.error('Twitter login failed');
    }
  };

  return (
    <TwitterLoginButton
      onSuccess={handleTwitterLogin}
      onFailure={handleTwitterLogin}
    />
  );
};

export default TwitterLoginButtonfun;
