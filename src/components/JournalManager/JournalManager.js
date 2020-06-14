import React, { useState } from 'react';
import {
    Typography,
    Button,
    Divider,
    Input,
    Space,
} from 'antd';
import styled from 'styled-components';

import JournalEntriesContainer from './JournalEntriesList';

const AddEntrySpace = styled(Space)`
    padding-top: 5px;
`;

const JournalManager = ({ sheetId = "" }) => {
    const FETCH_TIMEOUT = 10; // try to load data for N seconds

    const [showAddEntry, setShowAddEntry] = useState(false);
    const [entryInput, setEntryInput] = useState("");
    const [data, setData] = useState([]);

    const updateCell = (colLetter, rowNumber, value) => {
        window.gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: sheetId || process.env.REACT_APP_API_SPREADSHEETID,
            range: 'Sheet1!' + colLetter + rowNumber,
            valueInputOption: 'USER_ENTERED',
            values: [
                [value]
            ]
        }).then(response => {
            console.log(response)
        })
    };

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
            setShowAddEntry(false);
            return;
        }

        fetchedData.then(data => {
            setData(data);
            setShowAddEntry(false);
        });

        return;
    };

    const updateSingleCell = () => {
        const randomRow = Math.floor((Math.random() * 4) + 1);
        updateCell('D', randomRow, 'RandomExample' + randomRow.toString());
    };

    const addNewEntry = () => {};

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
            range: 'A:B',
        }).then((response) => {
            const contents = response.result.values.slice();
            contents.splice(0, 1); // remove column header
            return contents;
        });
    };

    return (
        <div>
            <Space>
                <Button onClick={loadData}>
                    Load data
                </Button>
                <Button onClick={() => setShowAddEntry(true)}>
                    Add new entry
                </Button>
            </Space>
            <Divider />
            <div>
                {showAddEntry
                    ? <AddEntrySpace direction="vertical">
                        <Typography.Title level={2}>Add new journal entry</Typography.Title>
                        <Input.TextArea
                            value={entryInput}
                            onChange={e => setEntryInput(e.target.value)}
                            allowClear={true}
                        />
                        <Button type="primary" onClick={addNewEntry}>Add Entry</Button>
                    </AddEntrySpace>
                    : <div>
                        <JournalEntriesContainer entries={data} />
                    </div>
                }
            </div>
        </div>
    );
};

export default JournalManager;
