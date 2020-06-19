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
    line-height: 40px !important;
	padding-top: 45px;
	padding-bottom: 34px;
    font-size: 21px;
    background-image: url(${NotebookLines}), url(${NotebookPaper});
    background-size: 100% 40px;
	background-repeat:repeat-y, repeat;
    border-radius: 5px;

    @media (max-width: 768px) {
        padding-left: 50px;
        padding-right: 10px;
    }

    @media (min-width: 769px) {
        padding-left: 55px;
        padding-right: 20px;
    }

    @media (min-width: 1200px) {
        padding-left: 80px;
        padding-right: 30px;
    }

    @media (min-width: 1500px) {
        padding-left: 90px;
        padding-right: 30px;
    }

    @media (min-width: 1500px) {
        padding-left: 7%;
        padding-right: 30px;
    }

    & textarea:hover,
    & textarea:focus {
        border-color: ${green[6]} !important;
    }
`;

const AddEntryButton = styled(Button)`
    background-color: ${green[6]};
    border-color: ${green[5]};
    &:hover {
        background-color: ${green[5]};
        border-color: ${green[5]};
    }
`;

const MoodRadioButton = styled(Radio.Button)`
    &.ant-radio-button-wrapper-checked {
        background-color: ${green[0]} !important;
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
        }).then(response => {
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
                        <Radio.Group name="radiogroup" defaultValue={"Excited"}>
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
                        </Radio.Group>
                    </Row>
                    <AddEntryButton
                        type="primary"
                        onClick={addNewEntry}
                        icon={<PlusOutlined />}
                    >
                        Add Entry
                    </AddEntryButton>
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
