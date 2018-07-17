import React from 'react';
import {Editor, EditorState, RichUtils } from 'draft-js';

const styles = {
  editor: {
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: 'gold'
  },
  unfocus: {
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: 'coral'
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
    textAlignment: 'right'
  }
}

export default class App extends React.Component {

  constructor (props) {
    super (props)
    this.state = {
      editorState: EditorState.createEmpty(),
      hasFocus: false
    };
    this.onChange = (editorState) => this.setState({editorState});
  }

  toggleInlineStyle(e, inlinestyle) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlinestyle));
  }

  toggleBlockType(e, blockstyle) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockstyle));
  }

  render() {
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
  }
}
