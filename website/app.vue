<template>
  <div class="card" style="margin-top:20px; margin-bottom:20px;">
    <div class="card-header">
      <ul class="nav nav-tabs card-header-tabs">
        <li class="nav-item">
          <a class="nav-link active">
            MARIE 
            <span
              class="text-primary spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-if="machineFlags.running"
            ></span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="https://github.com/mathewmariani/marie-simulator/blob/master/notes/cheatsheet.md">
            Cheatsheet
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="https://github.com/mathewmariani/marie-simulator/blob/master/notes/student_resource.md">
            Resources
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="https://github.com/mathewmariani/MARIE-Examples">
            Examples
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" target="_blank" href="https://github.com/mathewmariani/marie-simulator">
            Github
          </a>
        </li>
      </ul>
    </div>
    <div class="card-body">			
      <StatusComponent
        client:load
        v-bind:message="machine.status"
      ></StatusComponent>
        <div class="row">
          <div class="col-md-6">
            <EditorComponent
              client:load
              v-bind:content="content"
              v-on:change-content="changeContent"
            ></EditorComponent>
          </div>
        <div class="col-md-4">
          <RegistersComponent
            client:load
            v-bind:ac="registers.ac"
            v-bind:ir="registers.ir"
            v-bind:mar="registers.mar"
            v-bind:mbr="registers.mbr"
            v-bind:pc="registers.pc"
            v-bind:outreg="registers.outreg"
            v-bind:inreg="registers.inreg"
          ></RegistersComponent>
        </div>
        <div class="col-md-2">
          <OutputComponent
            client:load
            v-bind:stuff="machine.outputs"
            v-bind:filter="filter"
          ></OutputComponent>
        </div>
      </div>
      <ErrorsComponent
        client:load
        v-bind:errors="assembly.errors"
      ></ErrorsComponent>
    </div>
    <InterfaceComponent
      client:load
      v-bind:flags="machineFlags"
      v-on:assemble="onAssemble"
      v-on:reset="onReset"
      v-on:stop="onStop"
      v-on:pause="onPause"
      v-on:run="onRun"
      v-on:step="onStep"
      v-on:delay="onDelay"
      v-on:filter="onFilter"
      v-on:trash="onTrash"
      v-on:settle="onSettle"
    ></InterfaceComponent>
    <div class="card-header">
      <ul class="nav nav-tabs card-header-tabs" id="myTab">
        <li class="nav-item">
          <a class="nav-link active" id="memory-tab" href="#memory" role="tab">Memory</a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            id="assembly-tab"
            href="#assembly"
            role="tab"
            v-bind:class="{ 'disabled': !machineFlags.assembled }"
          >Assembly</a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            id="watch-tab"
            href="#watch"
            role="tab"
            v-bind:class="{ 'disabled': !machineFlags.assembled }"
          >Watch</a>
        </li>
      </ul>
    </div>
    <div class="card-body tab-content" style="height:300px; max-height:300px; overflow: scroll;">
      <MemoryComponent
        client:load
        v-bind:memory="machine.memory"
        v-bind:pc="registers.pc"
        v-bind:mar="registers.mar"
      ></MemoryComponent>
      <AssemblyComponent
        client:load
        v-bind:program="assembly.program"
        v-bind:pc="registers.pc"
        v-bind:mar="registers.mar"
      ></AssemblyComponent>
      <WatchComponent
        client:load
        v-bind:symbols="assembly.symbols"
        v-bind:memory="machine.memory"
      ></WatchComponent>
    </div>
  </div>
</template>
  
<script>
  import AssemblyComponent from "./components/Assembly.vue";
  import EditorComponent from "./components/Editor.vue";
  import ErrorsComponent from "./components/Errors.vue";
  import InterfaceComponent from "./components/Interface.vue";
  import MemoryComponent from "./components/Memory.vue";
  import OutputComponent from "./components/Output.vue";
  import RegistersComponent from "./components/Registers.vue";
  import StatusComponent from "./components/Status.vue";
  import WatchComponent from "./components/Watch.vue";
  import { assembler } from "@/assembler";
  import { cpu } from "@/cpu";
  import { machine } from "@/machine";
  import { memory } from "@/memory";
  import { opcodes } from "@/opcodes";
  
  export default {
    mixins: [assembler, cpu, machine, memory, opcodes],
    components: {
      AssemblyComponent,
      EditorComponent,
      ErrorsComponent,
      InterfaceComponent,
      MemoryComponent,
      OutputComponent,
      RegistersComponent,
      StatusComponent,
      WatchComponent,
    },
    created () {
      this.reset()
    }, 
    data: () => ({
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
        program: [],
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
    }),
    methods: {
      onAssemble() {
        console.log("onAssemble")
        this.reset()
        this._assemble()
      },
      onReset() {
        this.reset()
      },
      onStop() {
        this.halt()
      },
      onPause() {
        console.log("pause")
      },
      onRun() {
        this.run()
      },
      onStep() {
        console.log("step")
        // this.step()
      },
      onDelay(value) {
        this.delay = (1000 / value)
      },
      onFilter(value) {
        this.filter = value
      },
      onTrash() {
        this.halt()
        this.reset()
        this.clear()
      },
      onSettle(input) {
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
      changeContent(value) {
        console.log("changeContent")
        this.content = value
      },

      /*
      *	functionality
      */

      // FIXME: name clashing with mixin
      _assemble() {
        // assemble code
        this.assembly = this.assemble(this.content)

        // check for errors
        if (this.assembly.errors.length > 0) {
          return
        }

        // store in memory
        this.assembly.program.forEach((instruction) => {
          this.machine.memory[instruction.address] = instruction.hexcode
          // this.write(instruction.address, instruction.hexcode)
        })

        // set machine flags
        this.machineFlags.assembled = true
        this.machineFlags.loaded = true
      },
      step() {
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
      run() {
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
      halt(err) {
        
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
      reset() {
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
          this.machine.memory[i] = 0x0;
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
      clear() {
        // clear editor content
        this.content = ""
      },
    },
  }
</script>
  
<style scoped>
  /* Your scoped styles */
  #marie-app {
    font-family: Arial, sans-serif;
    padding: 20px;
  }
</style>
  