Vue.component('editor', {
	props: ['content'],
	mounted () {
		this.editor = window.ace.edit("editor")
		this.editor.setOption("firstLineNumber", 1)
		this.editor.setHighlightActiveLine(true)
		this.editor.setValue(this.content, 1)

		this.editor.on('change', () => {
			this.cache = this.editor.getValue()
			this.$emit('change-content', this.editor.getValue())
		})
	},
	watch: {
		'content' (value) {
			if (this.cache !== value) {
				console.log("updating editor")
				this.editor.setValue(value, 1)
			}
		}
	},
	data () {
		return {
			editor: Object
		}
	},
	template: `
		<div id="editor" class="border"></div>
	`
})