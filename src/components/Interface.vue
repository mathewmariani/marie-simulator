<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <div class="btn-toolbar" role="toolbar">
        <div class="btn-group mr-2" role="group">
          <button @click="emit('assemble')" class="btn btn-primary" :disabled="flags.running">
            <i class="fas fa-cogs"></i>
          </button>
          <button @click="emit('reset')" class="btn btn-primary" :disabled="!flags.assembled || flags.running">
            <i class="fas fa-undo"></i>
          </button>
        </div>
        
        <div class="btn-group mr-2" role="group">
          <button @click="emit('stop')" class="btn btn-primary" :disabled="!flags.running">
            <i class="fas fa-stop"></i>
          </button>
          <button @click="emit('run')" class="btn btn-primary" :disabled="!flags.assembled || flags.halted || flags.interrupted">
            <i class="fas fa-play"></i>
          </button>
        </div>

        <div class="btn-group mr-2">
          <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
            Delay
          </button>
          <ul class="dropdown-menu">
            <li><a @click="emit('delay', 1.0)" class="dropdown-item">1 Hz</a></li>
            <li><a @click="emit('delay', 4.0)" class="dropdown-item">4 Hz</a></li>
            <li><a @click="emit('delay', 8.0)" class="dropdown-item">8 Hz</a></li>
            <li><a @click="emit('delay', 16.0)" class="dropdown-item">16 Hz</a></li>
          </ul>
        </div>

        <div class="btn-group mr-2">
          <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
            Output
          </button>
          <ul class="dropdown-menu">
            <li><a @click="emit('filter', 'ascii')" class="dropdown-item">ASCII</a></li>
            <li><a @click="emit('filter', 'decimal')" class="dropdown-item">Decimal</a></li>
            <li><a @click="emit('filter', 'hexadecimal')" class="dropdown-item">Hexadecimal</a></li>
            <li><a @click="emit('filter', 'octal')" class="dropdown-item">Octal</a></li>
          </ul>
        </div>

        <div class="btn-group mr-2" role="group">
          <button @click="emit('trash')" class="btn btn-primary">
            <i class="fas fa-trash"></i>
          </button>
        </div>

        <div class="input-group mr-2">
          <div class="input-group-prepend">
            <button @click="emit('settle', input)" class="btn btn-primary" :disabled="!flags.interrupted">
              Settle
            </button>
            <button class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" :disabled="!flags.interrupted">
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul class="dropdown-menu">
              <li><a @click="setFilter(-1)" class="dropdown-item">ASCII</a></li>
              <li><a @click="setFilter(10)" class="dropdown-item">Decimal</a></li>
              <li><a @click="setFilter(16)" class="dropdown-item">Hexadecimal</a></li>
              <li><a @click="setFilter(8)" class="dropdown-item">Octal</a></li>
            </ul>
          </div>
          <input v-model="input.value" type="text" class="form-control" placeholder="0x00" :disabled="!flags.interrupted" />
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  flags: Object,
});

const emit = defineEmits([
  'assemble', 'reset', 'stop', 'run', 'delay', 'filter', 'trash', 'settle'
]);

const input = ref({
  value: '',
  filter: 16,
});

const setFilter = (f) => {
  input.value.filter = f;
};
</script>
