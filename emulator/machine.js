export const machine = {
	data: function () {
		return {
			status: [
				"Ready to load program instructions.",
				"Press [Step Forward] to continue.",
				"Machine halted abnormally.",
				"Machine halted at user request.",
				"Machine halted normally."
			]
		}
	}
}