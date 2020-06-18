const createSheet = (title) => {
    window.gapi.client.sheets.spreadsheets.create({
        resource: {
            properties: {
                title: title,
            }
        },
        fields: "spreadsheetId",
    });
};

export { createSheet };
