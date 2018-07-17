import React from 'react';

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
      fetch('/login', {
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
        if(res.status === 200) {
          console.log(res)
        } else {
          console.log("err");
        }
      })
      .then(
          () => this.props.editor()
        )
        .catch((err) => {
          // network error
          console.log('error', err)
          })

    } else {
      () => this.props.login()
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
    return <div>
      <div class="username">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" onChange={(e) => this.usernameChange(e)}/>
      </div>
      <div class="password">
        <label for="password]">Password:</label>
        <input type="password" id="password" name="password" onChange={(e) => this.passwordChange(e)}/>
      </div>
      <div>
        <button onClick={() => this.login()}>Login</button>
        <button onClick={() => this.props.register()}>Go to Register</button>
      </div>
    </div>
  }
}

export default Login;
