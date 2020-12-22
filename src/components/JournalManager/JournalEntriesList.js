import React from "react";
import {
    List,
    Avatar,
    Timeline,
    Row,
    Col,
} from "antd";
import styled from "styled-components";

import { getCatEmoji, getCatImageUrl } from "utils/extractor/cat";

import { constants } from "stores/mood";
import { useJournal } from "stores/journal";

import { getQuote } from "utils/extractor/quote";
import { presentDate } from "utils";

const EntryList = () => {
    const entries = useJournal((state) => state.mood);

    return (
        <List
            itemLayout="vertical"
            size="small"
            dataSource={entries.map(({ entry, mood, dateCreated }) => ({
                avatar: "https://thispersondoesnotexist.com/image",
                title: `${getCatEmoji(mood)} ${presentDate(dateCreated)}`,
                description: `${getQuote()}`,
                content: `${entry}`,
            }))}
            renderItem={({ title, avatar, href, description, content}) => (
                <List.Item
                    key={title}
                    extra={
                        <img
                            width={220}
                            alt="logo"
                            src={getCatImageUrl()}
                        />
                    }
                >
                    <List.Item.Meta
                        avatar={<Avatar src={avatar} />}
                        title={<a href={href}>{title}</a>}
                        description={description}
                    />
                    {content}
                </List.Item>
            )}
        />
    );
}

const TimelineDateSpan = styled.span`
    font-size: 0.8em;
    color: rgb(100, 100, 100);
`;

const TimelineContentSpan = styled.span`
    font-size: 1.0em;
    color: rgb(80, 100, 90);
`;

const EntryTimeline = () => {
    const entries = useJournal((state) => state.entries);

    if (!entries || !entries.length) {
        return (
            <p>No entries yet {getCatEmoji("Sad")}</p>
        );
    }

    const getColor = (mood) => {
        let color = "gray";
        for (let i = 0; i < constants.moods.length; i += 1) {
            if (mood === constants.moods[i][0]) {
                color = constants.moods[i][1];
            }
        }
        return color;
    };

    return (
        <Timeline>
            {
                entries.reverse().map((entry, entryIdx) => (
                    <Timeline.Item
                        color={getColor(entry.mood)}
                        key={entryIdx}
                    >
                        <Row>
                            <Col span={24}>
                                {getCatEmoji(entry.mood)}
                                <TimelineDateSpan>
                                    {presentDate(entry.dateCreated)}
                                </TimelineDateSpan>
                            </Col>
                            <Col span={24}>
                                <TimelineContentSpan>
                                    {entry.entry}
                                </TimelineContentSpan>
                            </Col>
                        </Row>
                    </Timeline.Item>
                ))
            }
        </Timeline>
    );
};

export {
    EntryTimeline,
    EntryList,
};
