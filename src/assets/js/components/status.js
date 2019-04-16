Vue.component('status', {
	props: ['message'],
	template: `
		<div class="alert alert-primary" role="alert">
			{{ message }}
		</div>
	`
})