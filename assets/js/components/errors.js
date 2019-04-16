Vue.component('errors', {
	props: ['errors'],
	template: `
		<ul class="list-group">
			<li
				class="list-group-item list-group-item-danger"
				v-for="(_, index) in errors"
				v-bind:key="index"
			><i class="fas fa-exclamation-circle"></i> [Line: {{ errors[index].line }}] Error: {{ errors[index].name }}</li>
		</ul>
	`
})