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

  _renderAuthenticatedButtons = () => {
    return(
        <div>
          <p>You have been authenticated with Google</p>
          <p><RaisedButton label="Add Margin" secondary={true} onClick={ this._addMargin }/></p>
          <p><RaisedButton label="Push to G-Slides" default={true} onClick={ this._pushGSlides } /></p>
        </div>
    )
  }

  _addMargin = () => {
    alert('adding margin')
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


           {/* Render children here*/}
           {this.props.children} 
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
