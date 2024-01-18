import WalletConnectComponent from '../components/WalletConnectButton'
import SvgMotion from '../components/SvgMotion';
import React from 'react';
import TwitterLoginButton from '../components/TwitterLoginButton';


export default function Home() {

  const handleTwitterLogin = (authData: { user_id: any; }) => {
    // Implement logic to handle user data after successful Twitter login
    console.log('User details:', authData.user_id);
  };

  return (
    <>
    <WalletConnectComponent />
    {/* <SvgMotion /> */}
    <TwitterLoginButton onLogin={handleTwitterLogin} />
    </>
  )
}
