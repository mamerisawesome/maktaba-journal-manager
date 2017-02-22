import React, { Component } from 'react';
import logo from '../../assets/img/logo.svg'
import '../css/style.css'
import { Link } from 'react-router-dom'

//material-ui components
import { RaisedButton } from 'material-ui/';

//theme related material-ui
import { MuiThemeProvider,
         getMuiTheme,
         darkBaseTheme } from 'material-ui/styles'

import { checkAuth } from './../auth/auth'
// import { updateCell, loadSheet } from './../auth/auth'

import JSONDebugger from './../utils/JSONDebugger'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
        authenticated: false,
        data: {}
    }

    this._authenticate = this._authenticate.bind(this)
    this._handleAuth = this._handleAuth.bind(this)

  }

  componentDidMount() {
    window.gapi.load(
      'client:auth2', 
      () => checkAuth(true, this._handleAuth) )
  }

  _authenticate(e) {
    e.preventDefault();
    checkAuth(false, this._handleAuth);
  }

  _handleAuth(authResult) {
    if (authResult && !authResult.error) {
      this.setState({
        authenticated: true
      });
      this._loadSheetAPI()
    } else {
      this.setState({
        authenticated: false
      })
    }
  }

  _renderConnectButton = () => {
    return(
        <RaisedButton label="Connect with Google" primary={true} onClick={ this._authenticate }/>
    )
  }

  _renderAuthenticatedButtons = () => {
    return(
        <div>
          <p>You have been authenticated with Google</p>
          <p><RaisedButton label="Load sheet functions then get get data from sheet" primary={true} onClick={ this._loadData }/></p>
          <p><RaisedButton label="Update single cell" secondary={true} onClick={ this._updateSingleCell }/></p>
          <p><RaisedButton label="Push to G-Slides" default={true} onClick={ this._pushGSlides } /></p>
        </div>
    )
  }

  _updateCell = (colLetter, rowNumber, value) => {
  // _updateCell = () => {
    window.gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: process.env.REACT_APP_API_SPREADSHEETID,
    range: 'Sheet1!' + colLetter + rowNumber,
    // range: 'Sheet1!A1',
    valueInputOption: 'USER_ENTERED',
    values: [ [value] ]
  })
  .then( (response) => {
    console.log(response)
  }
  )}

  _loadSheetAPI = () => {
    window.gapi.client.load('sheets', 'v4')
  }

  _loadData = () => {
    const fetchedData = this._fetchDataFromSheet()
    fetchedData
    .then( data => {
      this.setState( { data } )
      console.log(this.state.data)
    })
  }

  _fetchDataFromSheet = () => {
    return window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: process.env.REACT_APP_API_SPREADSHEETID,
      range: 'D1:D4'
    }).then((response) => {
      return response.result.values
    })
  }

  _updateSingleCell = () => {
    const randomRow = Math.floor((Math.random() * 4) + 1)
    this._updateCell('D', randomRow , 'RandomExample' + randomRow.toString() )
  }

  _pushGSlides = () => {
    alert('pushing to G Slides')
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>React + Google Sheets API Test</h2>
          </div>

          <div className="border color-blue">
              <Link to='/PageOne'>Go to Page One</Link>
              <br/>
                { this.state.authenticated ? this._renderAuthenticatedButtons() : this._renderConnectButton() }
          </div>

          <JSONDebugger json={ this.state.data } />


           {/* Render children here*/}
           {this.props.children} 
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
