new Vue({
	el: '#marie-app',
	mixins: [assembler, cpu, machine, memory, opcodes],
	created: function () {
		this.reset()
	},
	methods: {

		/*
		 *	interface
		 */

		onAssemble: function () {
			this.reset()
			this._assemble()
		},
		onReset: function () {
			this.reset()
		},
		onStop: function () {
			this.halt()
		},
		onPause: function () {
			console.log("pause")
		},
		onRun: function () {
			this.run()
		},
		onStep: function () {
			console.log("step")
			// this.step()
		},
		onDelay: function (value) {
			this.delay = (1000 / value)
		},
		onFilter: function (value) {
			this.filter = value
		},
		onTrash: function () {
			this.halt()
			this.reset()
			this.clear()
		},
		onSettle: function (input) {
			var ret = null
			if (input.filter <= 0) {
				ret = input.value.charCodeAt(0)
			} else {
				ret = parseInt(input.value, input.filter)
				console.log(input.value)
			}

			this.settle(ret)
			this.run()
		},
		changeContent: function (value) {
			if (this.content !== value) {
				this.content = value
			}
		},

		/*
		 *	functionality
		 */

		// FIXME: name clashing with mixin
		_assemble: function () {
			// assemble code
			this.assembly = this.assemble(this.content)

			// check for errors
			if (this.assembly.errors.length > 0) {
				return
			}

			// store in memory
			this.assembly.program.forEach((instruction) => {
				this.$set(this.machine.memory, instruction.address, instruction.hexcode)

				// NOTE: these work, but vuejs doesn't detect the changes
				// this.machine.memory[instruction.address] = instruction.hexcode
				// this.write(instruction.address, instruction.hexcode)
			})

			// set machine flags
			this.machineFlags.assembled = true
			this.machineFlags.loaded = true
		},
		step: function () {
			if (this.machine.halt || this.machine.interrupt) {
				return false
			}

			if (this.machineFlags.running != true) {
				this.machine.status = "Press [Step Forward] to continue."
			}

			try {
				this.fetch()
				this.execute()
			} catch (e) {
				this.halt(e)
				return false
			}

			return true
		},
		run: function () {
			// set machine flags
			this.machineFlags.running = true
			this.machineFlags.interrupted = this.machine.interrupt
			this.machineFlags.halted = this.machine.halt

			// run
			this.tick = setTimeout(() => {
				if (this.step()) {
					this.run()
				}
			}, this.delay)
		},
		halt: function (err) {
			
			// steps:
			//	- set machine flags 		[X]
			// 	- cancel timeout	 		[X]
			//	- check for err 			[X]
			//	- check halt or interrupt 	[X]
			//	- update status			 	[X]

			// set machine flags
			this.machineFlags.halted = this.machine.halt
			this.machineFlags.interrupted = this.machine.interrupt
			this.machineFlags.running = !this.machine.halt

			// cancel tick
			clearTimeout(this.tick)

			// FIXME: can be cleaned up; ternary statements.
			if (err) {
				if (this.machine.halt || this.machine.interrupt) {
					if (this.machine.interrupt) {
						console.log("machine interrupted!")
					}
				 	this.machine.status = err
				} else {
					this.machine.status = "Machine halted abnormally. Error: "+err
				}
			} else {
				this.machine.status = "Halted at user request."
			}
		},
		reset: function () {
			// cancel tick
			clearTimeout(this.tick)

			// reset flags
			this.machineFlags.assembled = false
			this.machineFlags.halted = false
			this.machineFlags.interrupted = false
			this.machineFlags.loaded = false
			this.machineFlags.running = false
		
			// registers
			this.registers.ac = 0x0
			this.registers.ir = 0x0
			this.registers.mbr = 0x0
			this.registers.pc = 0x0
			this.registers.mar = 0x0
			this.registers.inreg = 0x0
			this.registers.outreg = 0x0

			// reset memory
			for (var i = 0; i < this.machine.memory.length; ++i) {
				this.$set(this.machine.memory, i, 0x0)
			}

			// reset machine
			this.machine.halt = false
			this.machine.interrupt = false
			this.machine.outputs = []

			// reset machine status
			this.machine.status = "Ready to load program instructions."

			// reset assembly
			this.assembly.programs = {}
			this.assembly.symbols = {}
			this.assembly.errors = {}
		},
		clear: function () {
			// clear editor content
			this.content = ""
		},
	},
	// FIXME: soo much cleaning to do
	data: {
		
		// editor
		editor: null,
		content: "\t\tORG\t\t\t0\n\t\tLOAD\t\tX\n\t\tADD\t\t\tY\n\t\tOUTPUT\n\t\tHALT\nX,\t\tDEC\t\t\t0\nY,\t\tDEC\t\t\t1\n",

		// tick
		tick: null,
		delay: 1000,

		filter: "hexadecimal",

		// registers
		registers: {
			ac: 0x0,
			ir: 0x0,
			mbr: 0x0,
			pc: 0x0,
			mar: 0x0,
			inreg: 0x0,
			outreg: 0x0
		},

		assembly: {
			program: {},
			symbols: {}
		},

		machine: {
			status: "Ready to load program instructions.",
			outputs: [],
			input: "",
			memory: Array(4096),
			halt: false,
			interrupt: false
		},

		machineFlags: {
			assembled: false,
			halted: false,
			interrupted: false,
			loaded: false,
			running: false			
		}
	}
})