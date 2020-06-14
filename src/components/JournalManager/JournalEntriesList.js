import React from 'react';
import {
    Space,
    List,
    Avatar,
    Timeline
} from 'antd';
import styled from 'styled-components';
import { getCatImageUrl } from './helpers/extractor/catExtractionHelper';
import { getQuote } from './helpers/extractor/quoteExtractionHelper';

const randomCat = () => {
    const cats = [
        "😸", "🐈", "😹", "😺", "😻",
        "😼", "😽", "😾", "😿", "🙀",
        "🐱",
    ];

    return cats[Math.round(Math.random() * 10)]
};

const presentDate = dateInput => {
    const formatted = dateInput.split(" ").join("T") + "Z";
    const d = new Date(formatted);

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
                title: `${randomCat()} ${presentDate(entry[1])}`,
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
    font-size: 0.6em;
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
                        <Space>
                            {randomCat()}
                            <TimelineDateSpan>
                                {presentDate(entry[1])}
                            </TimelineDateSpan>
                            <TimelineContentSpan>
                                {entry[0]}
                            </TimelineContentSpan>
                        </Space>
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
