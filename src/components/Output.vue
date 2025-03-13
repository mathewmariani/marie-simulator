<template>
    <div class="card" style="height:260px; max-height:260px; overflow:scroll;">
        <div class="text-center card-body">
            <p v-for="(_, index) in stuff" :key="index">
                <code>{{ formatBase(stuff[index], filter, 2) }}</code>
            </p>
        </div>
    </div>
</template>
  
<script>
    export default {
        props: {
            stuff: { type: Array, required: true },
            filter: { type: String, required: true }
        },
        methods: {
            formatBase(value, type, length) {
                return value.toString(16).padStart(length, '0').toUpperCase();
            }
        }
    }
</script>