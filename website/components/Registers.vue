<template>
    <div class="table-responsive">
        <table class="table table-sm table-bordered table-striped" style="height:260px; max-height:260px;">
            <tbody class="text-center">
                <tr><th>AC</th><td>{{ formatBase(ac, 'hexadecimal', 4) }}</td></tr>
                <tr><th>IR</th><td>{{ formatBase(ir, 'hexadecimal', 4) }}</td></tr>
                <tr class="table-warning"><th>MAR</th><td>{{ formatBase(mar, 'hexadecimal', 4) }}</td></tr>
                <tr><th>MBR</th><td>{{ formatBase(mbr, 'hexadecimal', 4) }}</td></tr>
                <tr class="table-success"><th>PC</th><td>{{ formatBase(pc, 'hexadecimal', 4) }}</td></tr>
                <tr><th>OUT</th><td>{{ formatBase(outreg, 'hexadecimal', 2) }}</td></tr>
                <tr><th>IN</th><td>{{ formatBase(inreg, 'hexadecimal', 2) }}</td></tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
    export default {
        props: {
            ac: { type: Number, required: true },
            ir: { type: Number, required: true },
            mar: { type: Number, required: true },
            mbr: { type: Number, required: true },
            pc: { type: Number, required: true },
            outreg: { type: Number, required: true },
            inreg: { type: Number, required: true }
        },
        methods: {
            formatBase(value, type, length) {
                return value.toString(16).padStart(length, '0').toUpperCase();
            }
        }
    }
</script>