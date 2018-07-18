import React from 'react';


const style = {
  portal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  newDoc: {
    marginBottom: '10px'
  },
  docList: {
    marginBottom: '10px',
    border: '2px solid black',
    width: '90%'
  },
  listHeading: {
    position: 'relative',
    left: '25px'
  }
}

class Portal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentPage: this.props.currentPage,
      title: null,
      password: null,
      sharedDoc: '',
      docList: [],
      editorState: this.props.editorState,
      documentId: this.props.docId
    }
  }

  componentDidMount() {
    this.user = JSON.parse(localStorage.getItem('login'));
    fetch('http://localhost:1337/docList/' + this.user.userId, {
        method: 'GET'
      })
      .then((res)=> {
        if(res.status === 200) {
          return res.json()
        } else {
          console.log('err')
        }
      })
      .then((response) => {
          console.log(response)
          this.setState({docList: response.docList})
          console.log(this.state.docList)
      })
      .catch((err) => {
        // network error
        console.log('error', err)
      })
  }

  create () {
    fetch('http://localhost:1337/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: this.user.userId,
        createdTime: new Date(),
        title: this.state.title,
        password: this.state.password
      })
    })
    .then((res) => res.json())
    .then(
        (resp) => {
          console.log(resp)
          if (resp.id) {
            this.props.editor();
            fetch('http://localhost:1337/docList', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userId: this.user.userId,
                docId: resp.id,
                title: resp.title
              })
            }).then(res => res.json())
            .then(
             (response) => {
               this.props.docId(resp.id)
               this.props.editor();
             })
          } else {
            console.log("Error: Document ID not exist")
          }
        })
      .catch((err) => {
        console.log('error', err)
      })
  }

  addDoc (id) {
    fetch('http://localhost:1337/addDoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: this.user.userId,
        docId: id
      })
    })
    .then((res) => res.json())
    .then((resp) => {
          console.log(resp)
          if (resp.idOfnewDoc) {
            console.log("Got the shared Doc")
            this.setState({sharedDoc: ''})
            this.componentDidMount();
          } else {
            console.log("Failed to find the document")
          }
        }
      )
    .catch((err) => {
        // network error
      console.log('error', err)
    })
  }

  openDoc (docId) {
    fetch('http://localhost:1337/openDoc/' + docId, {
        method: 'GET'
      })
      .then((res)=> {
        if(res.status === 200) {
          return res.json()
        } else {
          console.log('err')
        }
      })
      .then((response) => {
          console.log(response)
          this.props.socket.emit('openDoc', docId);
          this.setState({editorState: response.docContent, documentId: docId})
          this.props.editor();
      })
      .catch((err) => {
        // network error
        console.log('error', err)
      })
  }

  render() {
    return <div style={style.portal}>
      <div><h2>My Portal</h2></div>
      <button onClick={() => this.props.logout()}> Logout </button>
      <div style={style.newDoc}>
        <input style={{marginRight: '5px'}} onChange={(e) => this.setState({title: e.target.value})} type="text" placeholder="new document title"/>
        <input onChange={(e) => this.setState({password: e.target.value})} type="password" placeholder="new document password"/>
        <button onClick={() => this.create()}> Create Document </button>
      </div>
      <div style={style.docList}>
        <h4 style={style.listHeading}>My documents</h4>
        <ul>
          {this.state.docList.map((doc) => {
            return <li onClick={() => this.openDoc(doc.docId)}>{doc.title}</li>
          })}
        </ul>
      </div>
      <div>
        <input onChange={(e) => this.setState({sharedDoc: e.target.value})} type="text" value={this.state.sharedDoc} placeholder="paste a doc id here"/>
        <button onClick={() => this.addDoc(this.state.sharedDoc)}> Add Shared Document </button>
      </div>
    </div>
  }
}

export default Portal;
