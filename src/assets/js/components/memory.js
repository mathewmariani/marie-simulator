Vue.component('memory', {
	// FIXME: can be refactored and condensed
	props: {
		memory: Array,
		pc: Number,
		mar: Number
	},
	template: `
		<div class="tab-pane active" id="memory" role="tabpanel">
			<div class="table-responsive">
				<table class="table table-sm table-bordered table-striped">
					<tbody class="text-center">
						<tr>
							<th></th>
							<th v-for="(_, index) in [].constructor(16)" v-bind:key="index">
								+{{ index | base("hexadecimal", 1) }}
							</th>
							<tr v-for="(_, index) in memory" v-bind:key="index" v-if="index%16 == 0">
								<th>{{ index | base("hexadecimal", 3) }}</th>
								<td v-bind:class="{ 'table-warning': index+0==mar, 'table-success': index+0==pc }">{{ memory[index+0] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+1==mar, 'table-success': index+1==pc }">{{ memory[index+1] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+2==mar, 'table-success': index+2==pc }">{{ memory[index+2] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+3==mar, 'table-success': index+3==pc }">{{ memory[index+3] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+4==mar, 'table-success': index+4==pc }">{{ memory[index+4] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+5==mar, 'table-success': index+5==pc }">{{ memory[index+5] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+6==mar, 'table-success': index+6==pc }">{{ memory[index+6] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+7==mar, 'table-success': index+7==pc }">{{ memory[index+7] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+8==mar, 'table-success': index+8==pc }">{{ memory[index+8] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+9==mar, 'table-success': index+9==pc }">{{ memory[index+9] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+10==mar, 'table-success': index+10==pc }">{{ memory[index+10] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+11==mar, 'table-success': index+11==pc }">{{ memory[index+11] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+12==mar, 'table-success': index+12==pc }">{{ memory[index+12] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+13==mar, 'table-success': index+13==pc }">{{ memory[index+13] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+14==mar, 'table-success': index+14==pc }">{{ memory[index+14] | base("hexadecimal", 4) }}</td>
								<td v-bind:class="{ 'table-warning': index+15==mar, 'table-success': index+15==pc }">{{ memory[index+15] | base("hexadecimal", 4) }}</td>
							</tr>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`
})