Vue.component('interface', {
	props: {
		flags: Object,
	},
	methods: {
		setFilter: function (f) {
			this.input.filter = f
		}
	},
	data: function () {
		return {
			input: {
				value: "",
				filter: 16
			}
		}
	},
	template: `
		<ul class="list-group list-group-flush">
			<li class="list-group-item">
				<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">

					<!-- status -->
					<!--					
					<div class="btn-group mr-2" role="group" aria-label="First group">
						<button class="btn btn-light" type="button" disabled>
							<div class="spinner-border spinner-border-sm text-primary" role="status">
							<span class="sr-only">Loading...</span>
						</button>
					</div>
					-->

					<!-- assemble and reset -->
					<div class="btn-group mr-2" role="group" aria-label="First group">
						<button
							v-on:click="$emit('assemble')"
							type="button"
							class="btn btn-light"
							v-bind:disabled="flags.running"
						><i class="fas fa-cogs"></i></button>
						<button
							v-on:click="$emit('reset')"
							type="button"
							class="btn btn-light"
							v-bind:disabled="(!flags.assembled || flags.running)"
						><i class="fas fa-undo"></i></button>
					</div>

					<!-- controls -->
					<div class="btn-group mr-2" role="group" aria-label="First group">
						<button
							v-on:click="$emit('stop')"
							type="button"
							class="btn btn-light"
							v-bind:disabled="!flags.running"
						><i class="fas fa-stop"></i></button>
						<!--
						<button
							v-on:click="$emit('pause')"
							type="button"
							class="btn btn-light"
							v-bind:disabled="true"
						><i class="fas fa-pause"></i></button>
						-->
						<button
							v-on:click="$emit('run')"
							type="button"
							class="btn btn-light"
							v-bind:disabled="(!flags.assembled || flags.halted || flags.interrupted)"
						><i class="fas fa-play"></i></button>
						<!--
						<button
							v-on:click="$emit('step')"
							type="button"
							class="btn btn-light"
							v-bind:disabled="true"
						><i class="fas fa-step-forward"></i></button>
						-->
					</div>

					<!-- delay and filter -->
					<div class="btn-group mr-2">
						<button
							type="button"
							class="btn btn-light dropdown-toggle"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>Delay</button>
						<div class="dropdown-menu">
							<a
								class="dropdown-item"
								v-on:click="$emit('delay', 1.0)"
							>1 Hz</a>
							<a
								class="dropdown-item"
								v-on:click="$emit('delay', 4.0)"
							>4 Hz</a>
							<a
								class="dropdown-item"
								v-on:click="$emit('delay', 8.0)"
							>8 Hz</a>
							<a
								class="dropdown-item"
								v-on:click="$emit('delay', 16.0)"
							>16 Hz</a>
						</div>
					</div>
					<div class="btn-group mr-2">
						<button
							type="button"
							class="btn btn-light dropdown-toggle"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>Output</button>
						<div class="dropdown-menu">
							<a
								class="dropdown-item"
								v-on:click="$emit('filter', 'ascii')"
							>ASCII</a>
							<a
								class="dropdown-item"
								v-on:click="$emit('filter', 'decimal')"
							>Decimal</a>
							<a
								class="dropdown-item"
								v-on:click="$emit('filter', 'hexadecimal')"
							>Hexadecimal</a>
							<a
								class="dropdown-item"
								v-on:click="$emit('filter', 'octal')"
							>Octal</a>
						</div>
					</div>

					<!-- trash -->
					<div class="btn-group mr-2" role="group">
						<button
							v-on:click="$emit('trash')"
							type="button"
							class="btn btn-light"
							v-bind:disabled="false"
						><i class="fas fa-trash"></i></button>
					</div>

					<!-- input -->					
					<div class="input-group mr-2">
						<div class="input-group-prepend">
							<button
								v-on:click="$emit('settle', input)"
								type="button"
								class="btn btn-primary"
								v-bind:disabled="!flags.interrupted"
							>Settle</button>
							<button
								type="button"
								class="btn btn-primary dropdown-toggle dropdown-toggle-split"
								data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
								v-bind:disabled="!flags.interrupted"
							><span class="sr-only">Toggle Dropdown</span>
							</button>
							<div class="dropdown-menu" v-model="input.filter">
								<a
									v-on:click="setFilter(-1)"
									class="dropdown-item"
								>ASCII</a>
								<a 
									v-on:click="setFilter(10)"
									class="dropdown-item"
								>Decimal</a>
								<a
									v-on:click="setFilter(16)"
									class="dropdown-item"
								>Hexadecimal</a>
								<a
									v-on:click="setFilter(8)"
									class="dropdown-item"
								>Octal</a>
							</div>
						</div>
						<input
							v-model="input.value"
							type="text"
							class="form-control"
							placeholder="0x00"
							v-bind:disabled="!flags.interrupted"
						></input>
					</div>


				</div>
			</li>
		</ul>
	`
})