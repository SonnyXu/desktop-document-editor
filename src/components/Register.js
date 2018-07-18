import React from 'react';

const styles = {
  register: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '50px'
  }
}

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: this.props.currentPage,
      username: "",
      password: ""
    }
  }

  register() {
    const username = this.state.username
    const password = this.state.password

    if (username && password) {
      fetch('http://localhost:1337/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      })
      .then((res)=> {
        if(res.status === 200) {
          console.log(res)
        } else {
          // error
          }
      })
      .then(
        () => this.props.login()
      )
      .catch((err) => {
        // network error
        console.log('error', err)
      })
    } else {
      alert('Username and password must not be empty!')
      this.props.register()
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
    return <div  style={styles.register}>
      <h1>Register</h1>
      <div class="username">
        <label for="username">Username: </label>
        <input type="text" id="username" name="username" onChange={(e) => this.usernameChange(e)}/>
      </div>
      <div class="password" style={{marginTop: '15px'}}>
        <label for="password">Password: </label>
        <input type="password" id="password" name="password" onChange={(e) => this.passwordChange(e)}/>
      </div>
      <div style={{marginTop: '15px'}}>
        <button style={{ marginRight: '10px'}} onClick={() => this.register()}>Register</button>
        <button onClick={() => this.props.login()}>Go to Login</button>
      </div>
    </div>
  }
}

export default Register;
