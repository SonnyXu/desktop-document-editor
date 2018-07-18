import React from 'react';
import Login from './Login.js';
import Register from './Register.js';
import Portal from './Portal.js';
import { Editor, EditorState, RichUtils } from 'draft-js';
import createStyles from 'draft-js-custom-styles'

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
      userId: ''
    }
    this.onChange = (editorState) => this.setState({editorState})
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
      this.setState({
        currentPage: "Portal"
      })
    }

    this.userId = (id) => {
      this.setState({userId: id})
      console.log(this.state.userId)
    }
  }

    render() {
    if (this.state.currentPage === "Editor") {
      return (<div>
        <h2 className="title">Document Editor</h2>
        {FORMAT_BAR.map(({style, label}) => <button onClick={this.onToggleStyle(style)}>{label}</button>)}
        {['8px','12px','24px'].map(size => <button onClick={this.onSetStyle('fontSize', size)}>{size}</button>)}
        {['red','blue'].map(color => <button onClick={this.onSetStyle('color', color)}>{color}</button>)}
        <button onClick={this.mark}>mark</button>
        <div className="draft-editor-container">
          <Editor
            editorState={this.state.editorState}
            customStyleMap={customStyleMap}
            customStyleFn={customStyleFn}
            blockStyleFn={getBlockStyle}
            onChange={this.onChange}
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
                         currentPage={this.state.currentPage}
                         userId={this.state.userId}
                         register={() => this.register()}
                         login={() => this.login()}
                         portal={() => this.portal()}
                         editor={() => this.editor()}
                       />
    }
}
}
