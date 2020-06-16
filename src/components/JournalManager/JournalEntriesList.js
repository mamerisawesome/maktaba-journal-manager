import React from 'react';
import {
    List,
    Avatar,
    Timeline,
    Row,
    Col,
} from 'antd';
import styled from 'styled-components';
import { getCatImageUrl } from './helpers/extractor/catExtractionHelper';
import { getQuote } from './helpers/extractor/quoteExtractionHelper';

const getCatEmoji = (mood) => {
    const cats = [
        "😸", "🐈", "😹", "😺", "😻",
        "😼", "😽", "😾", "😿", "🙀",
        "🐱",
    ];

    switch(mood) {
        case "Excited": return "🙀";
        case "Happy": return "😸";
        case "Normal": return "😺";
        case "Sad": return "😿";
        case "Angry": return "😾";
        default: return cats[Math.round(Math.random() * 10)];
    }
};

const presentDate = dateInput => {
    const formatted = dateInput
        .split("/").join("-")
        .split(" ").join("T");
    const d = new Date(formatted + "Z");

    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d)
    const mo = new Intl.DateTimeFormat("en", { month: "long" }).format(d)
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d)
    // TODO fixed wrong time display of time
    // const time = new Intl.DateTimeFormat("en", {
    //     hour: "numeric",
    //     minute: "numeric",
    // }).format(d)

    return `${mo} ${da}, ${ye}`;
};

const EntryList = ({ entries, moodConstants }) => {
    return (
        <List
            itemLayout="vertical"
            size="small"
            dataSource={entries.map(entry => ({
                avatar: "https://thispersondoesnotexist.com/image",
                title: `${getCatEmoji(entry[2])} ${presentDate(entry[1])}`,
                description: `${getQuote()}`,
                content: `${entry[0]}`,
            }))}
            renderItem={item => (
                <List.Item
                    key={item.title}
                    extra={
                        <img
                            width={220}
                            alt="logo"
                            src={getCatImageUrl()}
                        />
                    }
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a href={item.href}>{item.title}</a>}
                        description={item.description}
                    />
                    {item.content}
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

const EntryTimeline = ({ entries = [], moodConstants }) => {
    return (
        <Timeline>
            {
                entries.map((entry, entryIdx) => (
                    <Timeline.Item
                        color={(mood => {
                            let color = "gray";
                            for (let i = 0; i < moodConstants.length; i += 1) {
                                if (mood === moodConstants[i][0]) {
                                    color = moodConstants[i][1];
                                }
                            }
                            return color;
                        })(entry[2])}
                        key={entryIdx}
                    >
                        <Row>
                            <Col md={24} lg={2}>
                                {getCatEmoji(entry[2])}
                                <TimelineDateSpan>
                                    {presentDate(entry[1])}
                                </TimelineDateSpan>
                            </Col>
                            <Col md={24} lg={22}>
                                <TimelineContentSpan>
                                    {entry[0]}
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
