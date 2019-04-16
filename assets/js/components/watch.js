Vue.component('watch', {
	props: {
		symbols: Object,
		memory: Array,
	},
	template: `
		<div class="tab-pane" id="watch" role="tabpanel">
			<div class="table-responsive">
				<table class="table table-sm table-bordered table-striped">
					<thead>
						<tr>
							<th scope="col">Label</th>
							<th scope="col" class="text-right">Address</th>
							<th scope="col" class="text-right">Value</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(address, label) in symbols" v-bind:key="label">
							<td>{{ label }}</td>
							<td class="text-right">{{ address | base("hexadecimal", 4) }}</td>
							<td class="text-right">{{ memory[address] | base("hexadecimal", 4) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`
})