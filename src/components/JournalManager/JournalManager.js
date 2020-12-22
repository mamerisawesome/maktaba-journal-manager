import React, { useState, useEffect } from "react";
import { Typography, Empty, Row, Tooltip, notification } from "antd";
import { EditOutlined, BarsOutlined, PlusOutlined } from "@ant-design/icons";

import { EntryTimeline } from "./JournalEntriesList";
import { getQuote } from "utils/extractor/quote";
import { formatDate } from "utils";

import { useMood, constants } from "stores/mood";
import { useJournal } from "stores/journal";

import {
    AddEntrySpace,
    EntryTextareaInput,
    AddEntryButton,
    MoodRadioGroup,
    MoodRadioButton,
    JournalTabs,
    JournalTabPane,
} from "./styled";

const notifySuccessSave = () => {
    notification.success({
        message: "Saving done",
        description: `✨ ${getQuote()}`,
        duration: 8,
    });
};

const JournalManager = ({ sheetId = "" }) => {
    const { setMood } = useMood.getState();
    const currentMood = useMood((state) => state.mood);

    const { addEntry, getEntries } = useJournal.getState();
    const entries = useJournal((state) => state.entries);

    const [entryInput, setEntryInput] = useState("");

    const handleSubmit = () => {
        notifySuccessSave();
        setEntryInput("");
        addEntry({
            entry: entryInput,
            mood: currentMood,
            dateCreated: formatDate(),
        })
    };

    useEffect(() => {
        if (entries !== undefined) {
            return;
        }
        getEntries();
    }, [entries, getEntries]);

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
                        <MoodRadioGroup
                            name="radiogroup"
                            value={currentMood}
                            defaultValue={"Normal"}
                        >
                            {constants.moods.map((mood, moodIdx) => {
                                return (<MoodRadioButton
                                    color={mood[1]}
                                    key={moodIdx}
                                    onClick={() => setMood(mood[0])}
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
                                onClick={handleSubmit}
                                icon={<PlusOutlined />}
                            />
                        </Tooltip>
                    }
                </AddEntrySpace>
            </JournalTabPane>
            <JournalTabPane
                tab={<span><BarsOutlined />Entries</span>}
                key="2"
            >
                <Typography.Title level={2}>My entries</Typography.Title>
                <div>
                    {entries?.length
                        ? <EntryTimeline moodConstants={constants.moods} entries={entries} />
                        : <Empty />
                    }
                </div>
            </JournalTabPane>
        </JournalTabs>
    );
};

export default JournalManager;
