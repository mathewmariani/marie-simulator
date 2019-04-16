Vue.component('registers', {
	props: {
		ac: Number,
		ir: Number,
		mar: Number,
		mbr: Number,
		pc: Number,
		outreg: Number,
		inreg: Number,
	},
	template: `
		<div class="table-responsive">
			<table class="table table-sm table-bordered table-striped" style="height:260px; max-height:260px;">
				<tbody class="text-center">
					<tr><th>AC</th><td>{{ ac | base("hexadecimal", 4) }}</td></tr>
					<tr><th>IR</th><td>{{ ir | base("hexadecimal", 4) }}</td></tr>
					<tr class="table-warning"><th>MAR</th><td>{{ mar | base("hexadecimal", 4) }}</td></tr>
					<tr><th>MBR</th><td>{{ mbr | base("hexadecimal", 4) }}</td></tr>
					<tr class="table-success"><th>PC</th><td>{{ pc | base("hexadecimal", 4) }}</td></tr>
					<tr><th>OUT</th><td>{{ outreg | base("hexadecimal", 2) }}</td></tr>
					<tr><th>IN</th><td>{{ inreg | base("hexadecimal", 2) }}</td></tr>
				</tbody>
			</table>
		</div>
	`
})