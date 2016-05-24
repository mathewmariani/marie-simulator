## Notes

### Assembly
The maximum amount of assembled lines of code is 2^14. This limit is set because an operand is 14 bits.

### Interpreter
The Interpreter uses a regex that checks for groupings. This means groups outside of the comment group won't cause errors.

```javascript
// [1]LABEL, [2]OPCODE [3]OPERAND /[4]COMMENT
var regexInterpreter = /^[\s]?(?:(\w*)[,])?[\s]*(?:(\w*))?[\s]*(?:(\w*))?[\s]*(?:[/](.*$))?/;

var GROUP_LABEL = 1;
var GROUP_OPCODE = 2;
var GROUP_OPERAND = 3;
var GROUP_COMMENT = 4;
```

### Hexcode
```javascript
// hexcode [0000] [0000 0000 0000]
byte |= opcode;
byte <<= 12;
byte |= operand;
var hexcode = byte.toString(16);
```

### Signed 16-bit Registers
```javascript
var UInt16 = function (value) {
	return (value & 0xFFFF);
};

var Int16 = function (value) {
	var ref = UInt16(value);
	return (ref > 0x7FFF) ? ref - 0x10000 : ref;
};
```

### SKIPCOND
```javascript
// 0000 [00]00 0000 0000
// significant bits

//      0000 0000 0000 0000
// &    0000 1100 0000 0000 (0xC00)

// 0000 [00]00 0000 0000 (0x000)
// 0000 [01]00 0000 0000 (0x400)
// 0000 [10]00 0000 0000 (0x800)

// if IR[11-10] == 00 then
//      IF AC < 0 then PC <-- PC + 1
// else if IR[11-10] == 01 then
//      IF AC = 0 then PC <-- PC + 1
// else if IR[11-10] == 10 then
//      IF AC > 0 then PC <-- PC + 1

var sig = (self.IR.read() & 0xC00);
if ((sig == 0x000)&&(self.AC.read() < 0)) {
	self.PC.write(self.PC.read() + 1);
} else if ((sig == 0x400)&&(self.AC.read() == 0)) {
	self.PC.write(self.PC.read() + 1);
} else if ((sig == 0x800)&&(self.AC.read() > 0)) {
	self.PC.write(self.PC.read() + 1);
}
```
