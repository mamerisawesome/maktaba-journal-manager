import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    Space,
    Tabs,
    Empty,
    Input,
    Radio,
    Row,
    Tooltip,
    notification,
} from 'antd';
import {
    EditOutlined,
    BarsOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import {
    green,
    yellow,
    blue,
    red,
} from '@ant-design/colors';
import styled, { css } from 'styled-components';

import { EntryTimeline } from './JournalEntriesList';
import { getQuote } from './helpers/extractor/quoteExtractionHelper';

import NotebookLines from "./NotebookLinesXL.png";
import NotebookPaper from "./NotebookPaper.png";

const moods = [
    ["Excited", yellow[6]],
    ["Happy", green[6]],
    ["Normal", "#262626"],
    ["Sad", blue[6]],
    ["Angry", red[6]]
];

const AddEntrySpace = styled(Space)`
    width: 100%;
`;

const EntryTextareaInput = styled(Input.TextArea)`
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

const AddEntryButton = styled(Button)`
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

const MoodRadioGroup = styled(Radio.Group)`
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

const MoodRadioButton = styled(Radio.Button)`
    width: ${100 / moods.length}%;
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

const JournalTabs = styled(Tabs)`
    & .ant-tabs-tab:hover,
    & .ant-tabs-tab-active {
        color: ${green[6]} !important;
    }

    & .ant-tabs-ink-bar {
        background-color: ${green[6]} !important;
    }
`;

const JournalTabPane = styled(Tabs.TabPane)`
    & .ant-tabs-tab-active {
        background-color: ${green[6]} !important;
    }
`;

const processDateForSheet = () => {
    const d = new Date();

    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d)
    const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d)
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d)
    const time = new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }).format(d);

    return `${ye}-${mo}-${da} ${time}`
        .replace(" AM", "")
        .replace(" PM", "");
};

const notifySuccessSave = () => {
    notification.success({
        message: 'Saving done',
        description: `✨ ${getQuote()}`,
        duration: 8,
    });
};

const JournalManager = ({ sheetId = "" }) => {
    const FETCH_TIMEOUT = 10; // try to load data for N seconds

    const [entryInput, setEntryInput] = useState("");
    const [moodInput, setMoodInput] = useState("Happy");
    const [data, setData] = useState([]);
    const [savingStatus, setSavingStatus] = useState(0);

    useEffect(() => {
        if (data.length === 0) {
            setTimeout(() => {
                const fetched = fetchDataFromSheet();
                if (!fetched) {
                    return;
                }

                fetched.then(entries => setData(entries || []));
            }, 5000);
        }
    });

    useEffect(() => {
        if (savingStatus === 3) {
            notifySuccessSave();
            setEntryInput("");
            setSavingStatus(0);
        }
    }, [savingStatus]);

    const loadData = fetch_inc => {
        let fetchedData = undefined;

        if (!fetch_inc) {
            fetch_inc = 0;
        }

        fetchedData = fetchDataFromSheet();
        if (fetchedData === undefined || fetch_inc < FETCH_TIMEOUT) {
            setTimeout(() => {
                loadData(fetch_inc + 1);
            }, 1000);
            return;
        }

        if (fetch_inc === FETCH_TIMEOUT) {
            console.warn("Cannot load data");
            setData([]);
            return;
        }

        fetchedData.then(data => {
            setData(data);
        });

        return;
    };

    const fetchDataFromSheet = () => {
        if (
            !window ||
            !window.gapi ||
            !window.gapi.client.sheets
        ) {
            console.warn("Not authenticated");
            return;
        }

        return window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId || process.env.REACT_APP_API_SPREADSHEETID,
            range: 'A:C',
        }).then((response) => {
            const contents = response.result.values.slice();
            contents.splice(0, 1); // remove column header
            return contents;
        });
    };

    const updateCell = (colLetter, rowNumber, value) => {
        return window.gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: sheetId || process.env.REACT_APP_API_SPREADSHEETID,
            range: 'Sheet1!' + colLetter + rowNumber,
            valueInputOption: 'USER_ENTERED',
            values: [
                [value]
            ]
        }).then(() => {
            setSavingStatus((() => {
                let status = undefined;
                status = colLetter === "A" ? 1 : status;
                status = colLetter === "B" ? 2 : status;
                status = colLetter === "C" ? 3 : status;
                return status;
            })());
        })
    };

    const updateSingleCell = (colLetter, value) => {
        const rowNumber = data.length + 2;
        updateCell(colLetter, rowNumber, value);
    };

    const addNewEntry = () => {
        updateSingleCell("A", entryInput);
        updateSingleCell("B", processDateForSheet());
        updateSingleCell("C", moodInput);
    };

    return (
        <JournalTabs defaultActiveKey="1">
            <JournalTabPane
                tab={<span><EditOutlined />Write entry</span>}
                key="1"
            >
                <AddEntrySpace direction="vertical">
                    <Typography.Title level={2}>Add new journal entry</Typography.Title>
                    <EntryTextareaInput
                        value={entryInput}
                        onChange={e => setEntryInput(e.target.value)}
                        autoSize={{ minRows: 10, maxRows: 100 }}
                        allowClear={true}
                        placeholder="Don't worry, this is between us. You can type anything."
                    />
                    <Row justify="center">
                        <MoodRadioGroup name="radiogroup" defaultValue={"Normal"}>
                            {moods.map((mood, moodIdx) => {
                                return (<MoodRadioButton
                                    color={mood[1]}
                                    key={moodIdx}
                                    onClick={() => setMoodInput(mood[0])}
                                    value={mood[0]}
                                >
                                    {mood[0]}
                                </MoodRadioButton>);
                            })}
                        </MoodRadioGroup>
                    </Row>
                    {entryInput &&
                        <Tooltip placement="left" title="Add new entry">
                            <AddEntryButton
                                type="primary"
                                shape="circle"
                                size="large"
                                onClick={addNewEntry}
                                icon={<PlusOutlined />}
                            />
                        </Tooltip>
                    }
                </AddEntrySpace>
            </JournalTabPane>
            <JournalTabPane
                tab={<span onClick={loadData}><BarsOutlined />Entries</span>}
                key="2"
            >
                <Typography.Title level={2}>My entries</Typography.Title>
                <div>
                    {data.length
                        ? <EntryTimeline moodConstants={moods} entries={data} />
                        : <Empty />
                    }
                </div>
            </JournalTabPane>
        </JournalTabs>
    );
};

export default JournalManager;
