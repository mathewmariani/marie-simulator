<script setup>
import EditorCompenent from './components/editor.vue'
import InterfaceCompenent from './components/interface.vue'
import MemoryCompenent from './components/memory.vue'
import RegistersCompenent from './components/registers.vue'

import Assembler from '@/assembler.js'
import CPU from '@/cpu.js';
import Memory from '@/memory.js';

let assembler = new Assembler();
let memory = new Memory();
let cpu = new CPU(memory);

let machine = {
  assembled: false,
  halted: false,
  interrupted: false,
  loaded: false,
  running: false,
};

</script>

<template>
  <main>
    <EditorCompenent
    ></EditorCompenent>
    <InterfaceCompenent
      v-bind:machine="machine"
    ></InterfaceCompenent>
    <RegistersCompenent
      v-bind:cpu="cpu"
    ></RegistersCompenent>
    <MemoryCompenent
      v-bind:memory="memory.data"
      v-bind:pc="cpu.pc"
      v-bind:mar="cpu.mar"
    ></MemoryCompenent>
  </main>
</template>

<style scoped>
</style>