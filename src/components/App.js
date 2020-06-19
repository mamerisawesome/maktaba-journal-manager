import React, { useState } from 'react';
import {
    Layout,
    Row,
    Col,
    Space,
    Menu,
    PageHeader,
    notification,
} from 'antd';
import { green } from '@ant-design/colors';
import { BookFilled, BulbOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import '../css/style.css';
import GSheetConnector from './GSheetConnector';
import JournalManager from './JournalManager';
import { getQuote } from './JournalManager/helpers/extractor/quoteExtractionHelper';

const PROJECT_NAME = "Maktaba";
const PROJECT_AUTHOR = "Almer Mendoza";
const PROJECT_YEAR = "2020";

const { Header, Content, Footer } = Layout;

const SiteHeader = styled(Header)`
    z-index: 10;
    background-color: ${green[9]};
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 10px 0 rgba(0, 0, 0, 0.19);
`;

const HeaderMenu = styled(Menu)`
    background-color: transparent;
    border: none;
`;

const HeaderMenuItem = styled(Menu.Item)`
    float: right;
    color: ${green[1]} !important;

    &.ant-menu-item-selected, &:hover {
        color: ${green[0]} !important;
        border-bottom: 2px solid ${green[1]} !important;
        height: 65px;
    }
`;

const SiteContent = styled(Content)`
    @media (max-width: 900px) {
        padding: 0px 0px;
        margin-top: -15px;
    }

    @media (min-width: 901px) {
        padding: 0 80px;
        padding-top: 60px;
        padding-bottom: 50px;
    }
`;

const SiteFooter = styled(Footer)`
    background-color: #434343;
    color: #f5f5f5;
    text-align: center;
    padding: 15px;
`;

const LogoLink = styled.a`
    font-size: 25px;
    color: ${green[1]};
    &:hover {
        color: ${green[0]};
    }
`;

const LogoLinkSpace = styled(Space)`
    @media (max-width: 768px) {
        margin: 0px -30px;
    }

    @media (min-width: 769px) {
        margin: 0px 30px;
    }
`;

const SitePageHeader = styled(PageHeader)`
    margin-left: -25px;
`;

const App = () => {
    const useAuthenticated = useState(false);
    const onLogout = () => {
        useAuthenticated[1](false);
    };

    return (
        <Layout id="main" className="layout">
            <SiteHeader>
                <Row>
                    <Col span={8}>
                        <LogoLinkSpace className="logo">
                            <LogoLink href="/">
                                <BookFilled />
                                <span>{PROJECT_NAME}</span>
                            </LogoLink>
                        </LogoLinkSpace>
                    </Col>
                    <Col span={16}>
                        <HeaderMenu mode="horizontal">
                            {useAuthenticated[0] &&
                                <HeaderMenuItem onClick={onLogout}>Logout</HeaderMenuItem>
                            }
                        </HeaderMenu>
                    </Col>
                </Row>
            </SiteHeader>

            <SiteContent className="App">
                <div className="site-content">
                    <div>
                        <SitePageHeader
                            backIcon={<BulbOutlined />}
                            onBack={() => notification.success({
                                message: "To brighten your day",
                                description: `✨ ${getQuote()}`,
                                duration: 8,
                            })}
                            title="Journal Entries"
                            subTitle="Manager and List"
                        />
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
