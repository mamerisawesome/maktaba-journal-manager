import { Button, Space, Tabs, Input, Radio } from "antd";
import { green } from "@ant-design/colors";
import styled, { css } from "styled-components";

import { constants } from "stores/mood";

import NotebookLines from "assets/NotebookLinesXL.png";
import NotebookPaper from "assets/NotebookPaper.png";

export const AddEntrySpace = styled(Space)`
    width: 100%;
`;

export const EntryTextareaInput = styled(Input.TextArea)`
    width: 100%;
    min-height: 200px;
    resize: none;
    font-family: Courier, monospace;
    padding-bottom: 34px;
    background-image: url(${NotebookLines}), url(${NotebookPaper});
    background-repeat:repeat-y, repeat;
    border-radius: 5px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;

    @media (max-width: 768px) {
        padding-left: 50px;
        padding-right: 10px;
        padding-top: 32px;
        line-height: 30px !important;
        background-size: 100% 30px;
        & textarea {
            font-size: 14px !important;
        }
    }

    @media (min-width: 769px) {
        padding-left: 55px;
        padding-right: 20px;
        padding-top: 38px;
        background-size: 100% 35px;
        line-height: 35px !important;
        & textarea {
            font-size: 15px !important;
        }
    }

    @media (min-width: 1200px) {
        padding-left: 80px;
        padding-right: 30px;
        padding-top: 38px;
        background-size: 100% 35px;
        line-height: 35px !important;
        & textarea {
            font-size: 18px !important;
        }
    }

    @media (min-width: 1500px) {
        padding-left: 7%;
        padding-right: 30px;
        padding-top: 40px;
        background-size: 100% 40px;
        line-height: 40px !important;
        & textarea {
            font-size: 20px !important;
        }
    }

    & textarea:hover,
    & textarea:focus {
        border-color: ${green[6]} !important;
    }
`;

export const AddEntryButton = styled(Button)`
    position: fixed;
    float: right;
    z-index: 11 !important;
    background-color: ${green[1]};
    border: 2px solid ${green[6]};
    box-shadow: 0px 2px 10px gray;

    @keyframes fadeIn {
        from { opacity: 0.0; }
        to { opacity: 1.0; }
    }

    animation-name: fadeIn;
    animation-duration: 2s;

    &:hover,
    &:focus {
        background-color: ${green[5]};
        border-color: ${green[5]};

        & svg {
            color: ${green[1]};
        }
    }

    & svg {
        color: ${green[6]}
    }

    @media (max-width: 768px) {
        right: 25px;
        bottom: 25px;
        box-shadow: 0px 1px 5px gray;
    }

    @media (min-width: 769px) {
        right: 25px;
        bottom: 25px;
        min-width: 43px !important;
        min-height: 43px !important;

        & svg {
            margin-top: 1px;
            width: 28px;
            height: 28px;
        }
    }
`;

export const MoodRadioGroup = styled(Radio.Group)`
    width: 100%;
    height: 40px;
    margin-top: -10px;
    & .ant-radio-button-wrapper:first-child {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 8px;
    }

    & .ant-radio-button-wrapper:last-child {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 8px;
    }
`;

export const MoodRadioButton = styled(Radio.Button)`
    width: ${100 / constants.moods.length}%;
    height: 100%;
    padding-top: 4.5px !important;
    text-align: center;
    &.ant-radio-button-wrapper-checked {
        background-color: ${green[0]} !important;
        font-weight: bold !important;
        ${props => css`
            color: ${props.color} !important;
        `}
        border-color: ${green[4]} !important;

        &::before {
            background-color: ${green[2]} !important;
        }
    }

    &:hover {
        ${props => css`
            color: ${props.color} !important;
        `}
    }
`;

export const JournalTabs = styled(Tabs)`
    & .ant-tabs-tab:hover,
    & .ant-tabs-tab-active {
        color: ${green[6]} !important;
    }

    & .ant-tabs-ink-bar {
        background-color: ${green[6]} !important;
    }
`;

export const JournalTabPane = styled(Tabs.TabPane)`
    & .ant-tabs-tab-active {
        background-color: ${green[6]} !important;
    }
`;
