Vue.component('outputs', {
	props: {
		stuff: Array,
		filter: String
	},
	template: `
		<div class="card" style="height:260px; max-height:260px; overflow:scroll;">
			<div class="text-center card-body">
				<p v-for="(_, index) in stuff" v-bind:key="index">
					<code>{{ stuff[index] | base(filter, 2) }}</code>
				</p>
			</div>
		</div>
	`
})