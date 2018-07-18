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
    marginBottom: '100px'
  }
}
class Portal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentPage: this.props.currentPage
    }
  }

  create () {
    // var title = window.prompt('Document Name: ');
    // var password = window.prompt('Password: ');

    fetch('http://localhost:1337/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: this.props.userId,
        // password: password,
        // title: title,
        createdTime: new Date()
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
                userId: this.props.userId,
                docId: resp.id
              })
            }).then(res => res.json())
            .then(
             () => this.props.editor()
            )
          } else {
            console.log("Error: Document ID not exist")
          }
        })
      .catch((err) => {
        // network error
        console.log('error', err)
      })
  }

  render() {
    return <div style={style.portal}>
      <div><h2>My Portal</h2></div>
      <div style={style.newDoc}>
        <input type="text" placeholder="new document title"/>
        <button onClick={() => this.create()}> Create Document </button>
      </div>
      <div style={style.docList}>
        <h4>My document</h4>
        <ul>
        </ul>
      </div>
      <div>
        <input type="text" placeholder="paste a doc id here"/>
        <button onClick={()=>this.add()}> Add Shared Document </button>
      </div>
    </div>
  }


}


export default Portal;
