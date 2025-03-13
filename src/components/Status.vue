<template>
    <div class="alert alert-primary" role="alert">
        {{ message }}
    </div>
</template>

<script>
    export default {
        props: {
            message: { type: String, required: true }
        }
    }
</script>