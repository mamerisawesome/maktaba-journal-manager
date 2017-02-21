import React, { Component } from 'react';
import logo from '../../assets/img/logo.svg'
import '../css/style.css'
import { Link } from 'react-router-dom'

//material-ui components
import { TextField } from 'material-ui/';

//theme related material-ui
import { MuiThemeProvider,
         getMuiTheme,
         darkBaseTheme } from 'material-ui/styles'

import { checkAuth, load, updateCell } from '../utils/spreadsheet';


class App extends Component {
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
              <TextField
                hintText="Type something here"
                floatingLabelText="This is a text field from App component"
                fullWidth={true}
              />
          </div>

           {/* Render children here*/}
           {this.props.children} 
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
