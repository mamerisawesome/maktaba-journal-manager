import React, { useState, useEffect } from 'react';
import { Spin, Row } from 'antd';
import styled from 'styled-components';

import { checkAuth } from '../../auth/auth';
import GSheetIdForm from './GSheetIdForm';

const LoaderContainer = styled(Row)`
    min-height: 50vh;
`;

const GSheetConnector = ({ children, useAuthenticated }) => {
    const [showContent, setShowContent] = useState(false);
    const [authenticated, setAuthenticated] = useAuthenticated;
    const useSheetId = useState("");

    useEffect(() => {
        if (!window || !window.gapi) {
            return;
        }

        window.gapi.load(
            "client:auth2",
            () => (
                checkAuth(true, {}, handleAuth)
            )
        )
    // eslint-disable-next-line
    }, []);

    const handleAuth = authResult => {
        setShowContent(false);
        if (authResult && !authResult.error) {
            setAuthenticated(true);
            loadSheetApi();
        } else {
            console.warn("Google Login cannot authenticate", authResult);
            setAuthenticated(false);
        }

        setShowContent(true);
    };

    const loadSheetApi = () => {
        window.gapi.client.load('sheets', 'v4')
    };

    return (
        <div>
            {showContent
                ? <div>
                    {authenticated
                        ? <div>{children(useSheetId[0])}</div>
                        : (
                            <GSheetIdForm
                                useSheetId={useSheetId}
                                handleAuth={handleAuth}
                                checkAuth={checkAuth}
                            />
                        )
                    }
                </div>
                : <LoaderContainer align="middle" justify="center">
                    <Spin size="large" />
                </LoaderContainer>
            }
        </div>
    );
}

export default GSheetConnector;
