import React, { useState } from 'react';
import { Layout, Space } from 'antd';
import { green } from '@ant-design/colors';
import { BookFilled } from '@ant-design/icons';
import styled from 'styled-components';

import '../css/style.css';
import GSheetConnector from './GSheetConnector';
import JournalManager from './JournalManager';

const PROJECT_NAME = "Maktaba Journal Manager";
const PROJECT_AUTHOR = "Almer Mendoza";
const PROJECT_YEAR = "2020";

const { Header, Content, Footer } = Layout;

const SiteHeader = styled(Header)`
    background-color: ${green[1]};
`;

const SiteContent = styled(Content)`
    padding: 50px 80px;
`;

const SiteFooter = styled(Footer)`
    text-align: center;
`;

const LogoLink = styled.a`
    font-size: 25px;
    color: ${green[9]};
    &:hover {
        color: ${green[7]};
    }
`;

const LogoLinkSpace = styled(Space)`
    margin: 0 30px;
`;

const App = () => {
    const useAuthenticated = useState(false);

    return (
        <Layout id="main" className="layout">
            <SiteHeader>
                <LogoLinkSpace className="logo">
                    <LogoLink href="/">
                        <BookFilled />
                        <span>{PROJECT_NAME}</span>
                    </LogoLink>
                </LogoLinkSpace>
            </SiteHeader>

            <SiteContent className="App">
                <div className="site-content">
                    <div>
                        <h1>Journal Entries</h1>
                    </div>

                    <GSheetConnector useAuthenticated={useAuthenticated}>
                        {sheetId => (
                            <JournalManager sheetId={sheetId} />
                        )}
                    </GSheetConnector>
                </div>
            </SiteContent>

            <SiteFooter>
                {PROJECT_NAME} ©{PROJECT_YEAR} Created by {PROJECT_AUTHOR}
            </SiteFooter>
        </Layout>
    );
}

export default App;
