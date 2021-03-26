import console from 'console'
import sample from './sample.json'
import Delta from 'quill-delta'
import 'react-quill/dist/quill.snow.css';

const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

export default class Editor extends React.Component {
	constructor(props) {
		super(props)
		this.quillRef = null;      // Quill instance
		this.reactQuillRef = null; // ReactQuill component
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

	render() {
		return (
			<div>
			<ReactQuill
				ref={(el) => { this.reactQuillRef = el }}
				defaultValue = { new Delta(sample) }
				modules={{"toolbar": false}}
				readOnly
				theme={'snow'}
			/>
			<button onClick={this.insertText}>Insert Text</button>
			<button onClick={this.getText}>Get Text</button>
			</div>
		)
	}
}
