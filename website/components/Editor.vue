<template>
  <div id="editor" class="border"></div>
</template>

<script>
  export default {
    props: ['content'],
    data: () => ({
      editor: null,
      cache: ''
    }),
    mounted() {
      this.editor = window.ace.edit("editor");
      this.editor.setOption("firstLineNumber", 1);
      this.editor.setHighlightActiveLine(true);
      this.editor.setValue(this.content, 1);
      this.editor.setTheme("ace/theme/tomorrow_night");

      this.editor.on('change', () => {
        this.cache = this.editor.getValue();
        this.$emit('change-content', this.cache);
      });
    },
    watch: {
      content(value) {
        if (this.cache !== value) {
          console.log("updating editor");
          this.editor.setValue(value, 1);
        }
      }
    }
  };
</script>

<style scoped>
  #editor {
    display: block;
    height: 260px;
    width: 100%;
    margin-bottom: 1rem;
  }
</style>
