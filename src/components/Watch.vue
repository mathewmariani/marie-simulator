<template>
    <div class="tab-pane" id="watch" role="tabpanel">
        <div class="table-responsive">
            <table class="table table-sm table-bordered table-striped">
                <thead>
                    <tr>
                        <th scope="col">Label</th>
                        <th scope="col" class="text-right">Address</th>
                        <th scope="col" class="text-right">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(address, label) in symbols" :key="label">
                        <td>{{ label }}</td>
                        <td class="text-right">{{ formatBase(address, 'hexadecimal', 4) }}</td>
                        <td class="text-right">{{ formatBase(memory[address], 'hexadecimal', 4) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            symbols: { type: Object, required: true },
            memory: { type: Array, required: true }
        },
        methods: {
            formatBase(value, type, length) {
                return value.toString(16).padStart(length, '0').toUpperCase();
            }
        }
    }
</script>