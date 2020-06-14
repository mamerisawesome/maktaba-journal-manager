import React from 'react';
import { List, Avatar } from 'antd';
import { getCatImageUrl } from './catExtractionHelper';
import { getQuote } from './quoteExtractionHelper';

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
    const time = new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "numeric",
    }).format(d)

    return `${mo} ${da}, ${ye}, ${time}`;
};

const JournalEntriesList = ({ entries }) => {
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

const JournalEntriesContainer = ({ entries = [] }) => {
    return (
        <div>
            <JournalEntriesList entries={entries} />
            {/* {entries.map((entry, entry_idx) => {
                return (
                    <div key={entry_idx}>
                        <EntryDate>{presentDate(entry[1])}</EntryDate>
                        <EntryContent>{} {entry[0]}</EntryContent>
                    </div>
                );
            })} */}
        </div>
    );
};

export default JournalEntriesContainer;
