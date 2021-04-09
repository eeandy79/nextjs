import console from 'console'
import sample from './sample.json'
import Delta from 'quill-delta'
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

export default class Editor extends React.Component {
	constructor(props) {
		super(props)
		this.quillRef = null;      // Quill instance
		this.reactQuillRef = null; // ReactQuill component
    this.readonly = props["readonly"]?props["readonly"]=="true":false;
    this.toolbar = props["toolbar"]?props["toolbar"]=="true":true;
    this.theme = props["theme"]?props["theme"]:"snow";
	}

	componentDidMount() {
		this.attachQuillRefs()
	}

	componentDidUpdate() {
		this.attachQuillRefs()
	}

	attachQuillRefs = () => {
		if (typeof this.reactQuillRef.getEditor !== 'function') return;
		this.quillRef = this.reactQuillRef.getEditor();
	}

	insertText = () => {
		var range = this.quillRef.getSelection();
		let position = range ? range.index : 0;
		this.quillRef.disable();
		this.quillRef.insertText(position, 'Hello, World! ')
	}

	getText = () => {
		console.log(JSON.stringify(this.quillRef.getContents(), null, 2));
	}

	setEdit = () => {
		console.log("set edit called");
		if (this.quillRef) {
			console.log("enable editing");
			this.quillRef.enable();

		}
	}

	setContents = (c) => {
		try {
			this.quillRef.setContents(new Delta(JSON.parse(c)));
		} catch (e) {
			console.log(e);
		}
	}

	getContents = () => {
		return this.quillRef.getContents();
	}

	render() {
		return (
			<div>
			<ReactQuill
				ref={(el) => { this.reactQuillRef = el }}
				modules={{"toolbar": this.toolbar}}
				theme={this.theme}
        readOnly={this.readonly}
			/>
			</div>
		)
	}
}
