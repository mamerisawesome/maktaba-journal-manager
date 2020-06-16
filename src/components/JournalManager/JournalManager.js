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
import { EditOutlined, BarsOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { EntryTimeline } from './JournalEntriesList';
import { getQuote } from './helpers/extractor/quoteExtractionHelper';

const moods = [
    ["Excited", "yellow"],
    ["Happy", "green"],
    ["Normal", "gray"],
    ["Sad", "blue"],
    ["Angry", "red"]
];

const AddEntrySpace = styled(Space)`
    width: 100%;
`;

const EntryTextareaInput = styled(Input.TextArea)`
    width: 100%;
    min-height: 200px;
    resize: none;
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
                fetched.then(entries => setData(entries || []));
            }, 3000);
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
        <Tabs defaultActiveKey="1">
            <Tabs.TabPane
                tab={<span><EditOutlined />Write entry</span>}
                key="1"
            >
                <AddEntrySpace direction="vertical">
                    <Typography.Title level={2}>Add new journal entry</Typography.Title>
                    <EntryTextareaInput
                        value={entryInput}
                        onChange={e => setEntryInput(e.target.value)}
                        autoSize={false}
                        allowClear={true}
                        placeholder="Don't worry, this is between us. You can type anything."
                    />
                    <Row justify="center">
                        <Radio.Group name="radiogroup" defaultValue={"Ecstatic"}>
                            {moods.map((mood, moodIdx) => {
                                return (<Radio.Button
                                    key={moodIdx}
                                    onClick={() => setMoodInput(mood[0])}
                                    value={mood[0]}
                                >
                                    {mood[0]}
                                </Radio.Button>);
                            })}
                        </Radio.Group>
                    </Row>
                    <Button type="primary" onClick={addNewEntry}>Add Entry</Button>
                </AddEntrySpace>
            </Tabs.TabPane>
            <Tabs.TabPane
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
            </Tabs.TabPane>
        </Tabs>
    );
};

export default JournalManager;
