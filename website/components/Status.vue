<template>
  <div class="alert alert-primary m-0" role="alert">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: { type: String, required: true },
  },
};
</script>
