Vue.component('assembly', {
	props: {
		program: Object,
		pc: Number,
		mar: Number
	},
	template: `
		<div class="tab-pane" id="assembly" role="tabpanel">
			<div class="table-responsive">
				<table class="table table-sm table-bordered table-striped">
					<thead>
						<tr>
							<th scope="col">Address</th>
							<th scope="col">Label</th>
							<th scope="col">Opcode</th>
							<th scope="col">Operand</th>
							<th scope="col">Hexcode</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(instruction, index) in program" v-bind:key="index" v-bind:class="{ 'table-warning': index+0==mar, 'table-success': index+0==pc }">
							<td>{{ instruction.address | base("hexadecimal", 4) }}</td>
							<td>{{ instruction.label }}</td>
							<td>{{ instruction.opcode }}</td>
							<td>{{ instruction.operand }}</td>
							<td>{{ instruction.hexcode | base("hexadecimal", 4) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`
})