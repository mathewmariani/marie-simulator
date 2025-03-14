export const memory = {
	methods: {
		read: function(address) {
			if (address < 0 || address >= this.machine.memory.length) {
				throw "Memory access violation. Address: " + address
			}
			return this.machine.memory[address]
		},
		write: function(address, value) {
			if (address < 0 || address >= this.machine.memory.length) {
				throw "Memory access violation. Address: " + address
			}
			var ref = (value & 0xFFFF)
			this.machine.memory[address] = (ref > 0x7FFF) ? ref - 0x10000 : ref;
		},
	},
}