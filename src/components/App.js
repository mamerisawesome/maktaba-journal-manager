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

    this.state = {
        authenticated: false
    }

    this._authenticate = this._authenticate.bind(this)
    this._handleAuth = this._handleAuth.bind(this)

  }

  componentDidMount() {
    window.gapi.load(
      'client', 
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

          { this.state.authenticated ?  "You have been authenticated with Google" : this._renderConnectButton() }

           {/* Render children here*/}
           {this.props.children} 
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
