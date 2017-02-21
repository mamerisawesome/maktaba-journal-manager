/**
 * Load the quotes from the spreadsheet
 * Embellish them with user own likes
 */
export function loadSheet(callback) {
  window.gapi.client.load('sheets', 'v4')

}

export function updateCell(column, row, value, successCallback, errorCallback) {
  window.gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: process.env.REACT_APP_API_SPREADSHEETID,
    range: 'Sheet1!' + column + row,
    valueInputOption: 'USER_ENTERED',
    values: [ [value] ]
  }).then(successCallback, errorCallback);
}