<template>
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
          <tr v-for="(instruction, index) in program" :key="index" :class="{ 'table-warning': index === mar, 'table-success': index === pc }">
            <td>{{ base(instruction.address, "hexadecimal", 4) }}</td>
            <td>{{ instruction.label }}</td>
            <td>{{ instruction.opcode }}</td>
            <td>{{ instruction.operand }}</td>
            <td>{{ base(instruction.hexcode, "hexadecimal", 4) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    program: Array,
    pc: Number,
    mar: Number
  },
  methods: {
    base(value, format, length) {
      if (format === "hexadecimal") {
        return value.toString(16).toUpperCase().padStart(length, "0");
      }
      return value;
    }
  }
};
</script>

<style scoped>
</style>
