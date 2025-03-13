<template>
  <ul class="list-group">
    <li
      class="list-group-item list-group-item-danger"
      v-for="(error, index) in errors"
      :key="index"
    >
      <i class="fas fa-exclamation-circle"></i> [Line: {{ error.line }}] Error: {{ error.name }}
    </li>
  </ul>
</template>

<script>
  export default {
    props: ['errors']
  };
</script>