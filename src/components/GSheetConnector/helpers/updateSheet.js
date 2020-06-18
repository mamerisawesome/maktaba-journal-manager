const DEFAULT_TAB_NAME = "Sheet1";

const updateSheet = (spreadsheetId, values, tabName) => {
    return window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: tabName || DEFAULT_TAB_NAME,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "OVERWRITE",
        resource: {
            values
        },
    });
};

export { updateSheet };
