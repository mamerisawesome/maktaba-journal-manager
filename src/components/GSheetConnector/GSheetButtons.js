import React from 'react';
import { Button } from 'antd';

const GoogleConnectButton = ({
    authParams = {},
    checkAuth,
    handleAuth
}) => {
    const authenticate = e => {
        e.preventDefault();
        checkAuth(false, authParams, handleAuth);
    };

    return(
        <Button onClick={authenticate}>
          Connect with Google
        </Button>
    )
};

export {
    GoogleConnectButton,
};
