import React, { Component } from 'react';
import logo from '../../assets/img/logo.svg'
import '../css/style.css'
import { Link } from 'react-router-dom'

//material-ui components
import { TextField, RaisedButton } from 'material-ui/';

//theme related material-ui
import { MuiThemeProvider,
         getMuiTheme,
         darkBaseTheme } from 'material-ui/styles'

import { checkAuth } from './../auth/auth'

class App extends Component {
  constructor(props) {
    super(props)

    // this._authenticate = this._authenticate.bind(this)
    // this._handleAuth = this._handleAuth.bind(this)

  }

  componentDidMount() {
    window.gapi.load('client')
  }

  _authenticate(e) {
    e.preventDefault();
    checkAuth(false, this._handleAuth.bind(this));
  }

  _handleAuth(authResult) {
    if (authResult && !authResult.error) {
      this.setState({
        authenticated: true
      });
    } else {
      this.setState({
        authenticated: false
      })
    }
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
              <TextField
                hintText="Type something here"
                floatingLabelText="This is a text field from App component"
                fullWidth={true}
              />
          </div>

          <RaisedButton label="Authenticate" primary={true} onClick={ this._authenticate.bind(this) }/>

           {/* Render children here*/}
           {this.props.children} 
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
