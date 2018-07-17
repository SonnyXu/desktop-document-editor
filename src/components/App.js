import React from 'react';
import Login from './Login.js';
import Register from './Register.js';
import {Modifier, Editor, EditorState, RichUtils } from 'draft-js';
// import createStyles from 'draft-js-custom-styles'
// const customStyleMap = {
//   remoteCursor: {
//     borderLeft: 'solid 3px red'
//   }
// }
//
// /* Have draft-js-custom-styles build help functions for toggling font-size, color */
// const {
//   styles,
//   customStyleFn,
// } = createStyles(['font-size', 'color'], customStyleMap)
//
// /* Let draft-js know what styles should be block vs inline
//  * NOTE: This is needed, but RichUtils.toggleBlockType,
//  *       RichUtils.toggleInlineStyle need to get called
//  */
// function isBlockStyle(style) {
//   if(style.indexOf('text-align-') === 0) return true
//   return false
// }
//
// function getBlockStyle(block) {
//   const type = block.getType()
//   return isBlockStyle(type) ? type : null
// }
//
// /* list of button we need to render */
// const FORMAT_BAR = [
//   {style:'BOLD', label:'B'},
//   {style:'ITALIC', label:'I'},
//   {style:'UNDERLINE', label:'U'},
//   {style:'text-align-left', label:'left'},
//   {style:'text-align-center', label:'center'},
//   {style:'text-align-right', label:'right'},
// ]

//
const styles = {
  editor: {
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: 'silver'
  },
  unfocus: {
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: 'black'
  },
}

const styleMap = {
  'UPPERCASE': {
    textTransform: 'uppercase'
  },
  'LOWERCASE': {
    textTransform: 'lowercase'
  },
  "FONTCOLOR": {
    color: 'red'
  },
  "FONTSIZE": {
    fontSize: '40px'
  },
  "RIGHTALIGN": {
    textAlign: 'right',
    color: 'blue'
  }
}


export default class App extends React.Component {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //       // We need to create am empty editor state
  //       // because draftJS state is complex!
  //       editorState: EditorState.createEmpty()
  //
  //     }
  //     this.onChange = (editorState) => this.setState({editorState})
  //
  //     // helper function to toggle draftJS style changes
  //     this.onToggleStyle = (style) => (e) => {
  //       const toggleFn = isBlockStyle(style) ? RichUtils.toggleBlockType : RichUtils.toggleInlineStyle
  //       this.onChange(toggleFn(this.state.editorState, style))
  //
  //       e.preventDefault()
  //     }
  //
  //     // helper function to set draftJS complex types that need a value like (color, font-size)
  //     this.onSetStyle = (name, val) => (e) => {
  //       this.onChange(styles[name].toggle(this.state.editorState, val))
  //
  //       e.preventDefault()
  //     }
  //
  //     // Old school changes still work :)
  //     this.mark = (e) => {
  //       this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'remoteCursor'))
  //       e.preventDefault()
  //     }
  //     // track any changes that draftJS makes in react state
  // }
  //
  //
  //
  //   render() {
  //     return (<div>
  //       <h2>Editor</h2>
  //
  //       {FORMAT_BAR.map(({style, label}) => <button onClick={this.onToggleStyle(style)}>{label}</button>)}
  //       {[8,12,24].map(size => <button onClick={this.onSetStyle('fontSize', size)}>{size}px</button>)}
  //       {['red','blue'].map(color => <button onClick={this.onSetStyle('color', color)}>{color}</button>)}
  //
  //       <button onClick={this.mark}>mark</button>
  //
  //       <div className="draft-editor-container">
  //         <Editor
  //           editorState={this.state.editorState}
  //           customStyleMap={customStyleMap}
  //           customStyleFn={customStyleFn}
  //           blockStyleFn={getBlockStyle}
  //           onChange={this.onChange}
  //         />
  //       </div>
  //     </div>);
  //   }
  constructor (props) {
    super (props)
    this.state = {
      editorState: EditorState.createEmpty(),
      hasFocus: false,
      currentPage: "Login"
    };
    this.onChange = (editorState) => this.setState({editorState});
  }

  blockStyleFn(contentBlock) {
    if (contentBlock.getData().rightAlign === false) {
      return 'cssRA'
    }
  }

  toggleInlineStyle(e, inlinestyle) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlinestyle));
  }

  toggleBlockType(e, blockstyle) {
    e.preventDefault();
    setBlockData (
      blockData: {rightAlign: false}
    )
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockstyle));
  }

  register() {
    this.setState({
      currentPage: "Register"
    })
  }

  login() {
    this.setState({
      currentPage: "Login"
    })
  }

  editor() {
    this.setState({
      currentPage: "Editor"
    })
  }

  render() {
    if (this.state.currentPage === "Editor") {
      return (<div>
        <button onMouseDown={(e) => this.toggleInlineStyle(e, 'BOLD')}><strong>B</strong></button>
        <button onMouseDown={(e) => this.toggleInlineStyle(e, 'ITALIC')}><i>I</i></button>
        <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UNDERLINE')}><ins>U</ins></button>
        <button onMouseDown={(e) => this.toggleInlineStyle(e, 'STRIKETHROUGH')}><del>S</del></button>
        <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UPPERCASE')}>ABC</button>
        <button onMouseDown={(e) => this.toggleInlineStyle(e, 'LOWERCASE')}>abc</button>
        <button onMouseDown={(e) => this.toggleInlineStyle(e, 'FONTCOLOR')}>Color</button>
        <button onMouseDown={(e) => this.toggleInlineStyle(e, 'FONTSIZE')}>Size</button>
        <button onMouseDown={(e) => this.toggleBlockType(e, 'RIGHTALIGN')}>RightAlign</button>
        <button onMouseDown={(e) => this.toggleBlockType(e, 'unordered-list-item')}>Unordered List</button>
        <button onMouseDown={(e) => this.toggleBlockType(e, 'ordered-list-item')}>Ordered List</button>

        <div style={this.state.hasFocus ? styles.editor: styles.unfocus}>
        <Editor
        onFocus={() => this.setState({ hasFocus: true })}
        onBlur={() => this.setState({ hasFocus: false })}
        editorState={this.state.editorState}
        customStyleMap={styleMap}
        onChange={this.onChange}
        />
        </div>
      </div>);
    } else if (this.state.currentPage === "Login") {
      return <Login currentPage={this.state.currentPage}
                      register={() => this.register()}
                      login={() => this.login()}
                     editor={() => this.editor()}
                   />
    } else if (this.state.currentPage === "Register") {
      return <Register currentPage={this.state.currentPage}
                         register={() => this.register()}
                         login={() => this.login()}
                         editor={() => this.editor()}
                       />
    }
  }
}
