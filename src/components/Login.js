import React from 'react';

const styles = {
  login: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '50px'
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: this.props.currentPage,
      username: '',
      password: ''
    }
  }

  login() {
    const username = this.state.username
    const password = this.state.password
    if (username && password) {
      fetch('http://localhost:1337/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return res.json();
        }
      })
      .then(
          (resp) => {
            console.log(resp)
            if (resp.userId) {
              this.props.portal();
              this.props.userId(resp.userId)
            } else {
              alert('Invalid login')
              this.props.login();
            }
          }
        )
        .catch((err) => {
          // network error
          console.log('error', err)
          })

    } else {
      alert('Username and password must not be empty!')
      this.props.login()
    }
  }

  usernameChange(e) {
    this.setState({
      username: e.target.value
    })
  }

  passwordChange(e) {
    this.setState({
      password: e.target.value
    })
  }

  render() {
    return <div style={styles.login}>
      <h1>Login</h1>
      <div class="username">
        <label for="username">Username: </label>
        <input type="text" id="username" name="username" onChange={(e) => this.usernameChange(e)}/>
      </div>
      <div style={{marginTop: '15px'}}>
        <label for="password">Password: </label>
        <input type="password" id="password" name="password" onChange={(e) => this.passwordChange(e)}/>
      </div>
      <div style={{marginTop: '15px'}}>
        <button style={{ marginRight: '10px'}} onClick={() => this.login()}>Login</button>
        <button onClick={() => this.props.register()}>Go to Register</button>
      </div>
    </div>
  }
}

export default Login;
