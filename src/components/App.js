import React from 'react';
import Login from './Login.js';
import Register from './Register.js';
import Portal from './Portal.js';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import createStyles from 'draft-js-custom-styles'
import io from 'socket.io-client';

let socket = io('http://localhost:1337');


const customStyleMap = {
  remoteCursor: {
    borderLeft: 'solid 3px red'
  }
}

const {
  styles,
  customStyleFn,
} = createStyles(['font-size', 'color'], customStyleMap)

function isBlockStyle(style) {
  if(style.indexOf('text-align-') === 0) return true
  return false
}

function getBlockStyle(block) {
  const type = block.getType()
  return isBlockStyle(type) ? type : null
}

const FORMAT_BAR = [
  {style:'BOLD', label:'B'},
  {style:'ITALIC', label:'I'},
  {style:'UNDERLINE', label:'U'},
  {style:'text-align-left', label:'left'},
  {style:'text-align-center', label:'center'},
  {style:'text-align-right', label:'right'},
]

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      currentPage: 'Login',
      userId: '',
      docId: '',
    }
    this.onChange = (editorState) => {
      this.setState({editorState})
      socket.emit('contentState', convertToRaw(editorState.getCurrentContent()));
      // socket.emit('selectionState', convertToRaw(editorState.getSelection()));
    }
    this.onToggleStyle = (style) => (e) => {
      const toggleFn = isBlockStyle(style) ? RichUtils.toggleBlockType : RichUtils.toggleInlineStyle
      this.onChange(toggleFn(this.state.editorState, style))
      e.preventDefault()
    }
    this.onSetStyle = (name, val) => (e) => {
      this.onChange(styles[name].toggle(this.state.editorState, val))
      e.preventDefault()
    }
    this.mark = (e) => {
      this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'remoteCursor'))
      e.preventDefault()
    }

    this.register = () => {
      this.setState({
        currentPage: "Register"
      })
    }

    this.login = () => {
      this.setState({
        currentPage: "Login"
      })
    }

    this.editor = () => {
      this.setState({
        currentPage: "Editor"
      })
    }

    this.portal = () => {
      socket.emit('closeDoc');
      this.setState({
        currentPage: "Portal"
      })
    }

    this.logout = () => {
      localStorage.setItem('login', JSON.stringify(null));
      this.setState({
        currentPage: "Login"
      })
    }


    this.userId = (id) => {
      this.setState({userId: id})
      console.log(this.state.userId)
    }

    this.docId = (id) => {
      this.setState({docId: id})
      console.log(this.state.docId)
    }


    this.save = () => {
      fetch('http://localhost:1337/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          docId: this.state.docId,
          content: {
            content: this.state.editorState,
            user: this.state.userId
          },
          lastEditTime: new Date()
        })
      }).then(res => res.json())
      .then(
        (resp) => console.log('saved', resp)
      )
      .catch(err => console.log('error', err))
    }

    socket.on('contentState', (cs) => {
      console.log("Received contentState:", cs);
      const editorState = EditorState.createWithContent(convertFromRaw(cs));
      this.setState({
        editorState: editorState
      })
    })
    //
    // socket.on('selectionState', (ss) => {
    //   console.log("Received selectionState:", ss);
    //   const editorState = EditorState.acceptSelection(editorState, convertFromRaw(ss));
    //
    //   this.setState({
    //     editorState: editorState
    //   })
    // })
  }

    render() {
    if (this.state.currentPage === "Editor") {
      return (<div>
        <div>
        <h2 className="title">Document Editor</h2>
        </div>
        <div>
          Document ID: {this.state.docId}
        </div>
        <div className="save">
          <button onClick={() => this.save()}>Save Changes</button>
        </div>
        <div>
          <button onClick={() => this.portal()}>Quit</button>
        </div>
        <div className="toolbar">
        {FORMAT_BAR.map(({style, label}) => <button onClick={this.onToggleStyle(style)}>{label}</button>)}
        {['8px','12px','24px'].map(size => <button onClick={this.onSetStyle('fontSize', size)}>{size}</button>)}
        {['red','blue'].map(color => <button onClick={this.onSetStyle('color', color)}>{color}</button>)}
        <button onClick={this.mark}>mark</button>
        </div>
        <div className="draft-editor-container">
          <Editor
            editorState={this.state.editorState}
            customStyleMap={customStyleMap}
            customStyleFn={customStyleFn}
            blockStyleFn={getBlockStyle}
            onChange={this.onChange}
            socket={socket}
          />
        </div>
      </div>)
    }
    else if (this.state.currentPage === "Login") {
      return <Login currentPage={this.state.currentPage}
                      register={() => this.register()}
                      userId={(id) => this.userId(id)}
                      login={() => this.login()}
                      portal={() => this.portal()}
                      editor={() => this.editor()}
             />
    } else if (this.state.currentPage === "Register") {
      return <Register currentPage={this.state.currentPage}
                         register={() => this.register()}
                         login={() => this.login()}
                         portal={() => this.portal()}
                         editor={() => this.editor()}
                       />
    } else if (this.state.currentPage === "Portal") {
      return <Portal username={this.state.username}
                         documentId={this.state.docId}
                         editorState={this.state.editorState}
                         currentPage={this.state.currentPage}
                         docId={(id) => this.docId(id)}
                         register={() => this.register()}
                         login={() => this.login()}
                         portal={() => this.portal()}
                         editor={() => this.editor()}
                         logout={() => this.logout()}
                         socket={socket}
                       />
    }
  }
}
