# MARIE Assembly Language

## Characteristic
- Two's complement.
- 4 bits per opcode.
- 12 bit per address.
- 4K (4095) words of memory.
- The maximum amount of assembled lines of code is 2^14 due to operand size.

### Two's complement
- A signed number representation using using 3 bits.
- Signed numbers will have a range of [-(2^2), (2^2-1)].
- Unsigned numbers will have a range of [0, (2^3)].

| Signed | Unsigned | Binary |
| ------ | -------- | ------ |
| 0 | 0 | 000 |
| 1 | 1 | 001 |
| 2 | 2 | 010 |
| 3 | 3 | 011 |
| -4 | 4 | 100 |
| -3 | 5 | 101 |
| -2 | 6 | 110 |
| -1 | 7 | 111 |

### Instruction format
Instructions are 16 bits; 4 bits for the opcode, 12 bits for the address.

```
[0000] [0000 0000 000]
[opcode] [address]
```

## Machine
### Registers
* **AC**, Accumulator, a 16-bit register which holds the results of an arithmetical or logical operation.
* **IR**, a 16-bit register which holds an instruction immediately preceding its execution.
* **MBR**, a 16-bit register that holds the data after its retrieval from, or before its placement into memory.
* **PC**, Program Control, a 12-bit register that holds the address of the next program instruction to be executed.
* **MAR**, a 12-bit register that holds a memory address of an instruction (the operand of an instruction).
* **InREG**, an 8-bit register that holds data read from an input device.
* **OutREG**, an 8-bit register that holds data that is ready for the output device

### Instruction Types
| Type | Instruction | Description |
| ---- | ----------- | ----------- |
| Arithmetic | ADD X | Add value at address X to the accumulator. |
| | SUBT X | Subtract value at address X from the accumulator.  |
| | ADDI X | (Indirect) Use value at address X as the address for content to add to the accumulator. |
| Data | LOAD | Load the content at address X into the accumulator. |
| | LOADI | (Indirect) Use value at address X as the address for loading the content into the accumulator. |
| | STORE | Store the value in the accumulator at address X. |
| | STOREI | (Indirect) Use value at address X as the address for storing the content into content. |
| | CLEAR | Set accumulator to 0. |
| Subroutine | JNS | Store the value in the PC register at address X and jump to address X+1. |
| | JUMPI X | (Indirect) Use the value at X as the address to jump to. |
| Transfer | SKIPCOND X | Skip next instruction based on condition X. |
| | JUMP X | Transfers the program control directly to address X. |
| Interrupt | HALT | Halt machine. |
| Directives | END | Halt assembler, no instructions following will be interpreted. |
| | ORG | Must be the first non-comment line of program, or omitted. |
| I/O | INPUT | Loads data from input device to the accumulator. |
| | OUTPUT | Loads the value from the accumulator into output register to be displayed. |

### SKIPCOND Conditions
| Address | Description |
| ------- | ----------- |
| 0x000 | Skips if AC < 0 |
| 0x400 | Skips if AC = 0 |
| 0x800 | Skips if AC > 0 |

```
0000 [00]00 0000 0000
significant bits

  0000 0000 0000 0000
& 0000 1100 0000 0000 (0xC00)

0000 [00]00 0000 0000 (0x000)
0000 [01]00 0000 0000 (0x400)
0000 [10]00 0000 0000 (0x800)
```

### Datatypes
| Type | Instruction | Range |
| ---- | ----------- | ----------- |
| Decimal | DEC | [-32768, 32767] |
| Hexadecimal | HEX | [0, 0xFFFF] |
| Octal | OCT | [0, 177777] |

### I/O
Within the MARIE Machine Simulator the input and output devices are both considered to be external devices. If the device was internal a portion of memory would need to be partitioned for the device to read from.

### Filters
Filters will do their best to convert the input into the desired format; otherwise a value of zero will be assumed. The ASCII filter will only read the value of the first char of an input.

## Interpreter
#### JNS <small>(0000)</small>
```
MBR ← PC  
MAR ← X
M[MAR] ← MBR
MBR ← X
AC ← 1  
AC ← AC + MBR  
PC ← AC
```

#### LOAD <small>(0001)</small>
```
MAR ← X
MBR ← M[MAR]  
AC ← MBR
```

#### STORE <small>(0010)</small>
```
MAR ← X
MBR ← AC  
M[MBR] ← MBR
```

#### ADD <small>(0011)</small>
```
MAR ← X
MBR ← M[MBR]  
AC ← AC + MBR
```

#### SUBT <small>(0100)</small>
```
MAR ← X  
MBR ← M[MBR]  
AC ← AC - MBR
```

#### INPUT <small>(0101)</small>
```
AC ← InREG
```

#### OUTPUT <small>(0110)</small>
```
OutREG ← AC
```

#### HALT <small>(0111)</small>

#### SKIPCOND <small>(1000)</small>
```
if IR[11-10] == 00 do
  if AC < 0 do
    PC ← PC+1
else if IR[11-10] == 01 do
  if AC < 0 do
    PC ← PC+1
else if IR[11-10] == 10 do
  if AC > 0 do
    PC ← PC+1
```

#### JUMP <small>(1001)</small>
```
PC ← IR[11-0]
```

#### CLEAR <small>(1010)</small>
```
AC ← 0
```

#### ADDI <small>(1011)</small>
```
MAR ← X
MBR ← M[MAR]  
MAR ← MBR  
MBR ← M[MAR]  
AC ← AC + MBR
```

#### JUMPI <small>(1100)</small>
```
MAR ← X
MBR ← M[MAR]  
PC ← MBR
```

#### LOADI <small>(1101)</small>
```
MAR ← X
MBR ← M[MAR]  
MAR ← MBR  
MBR ← M[MAR]  
AC ← MBR
```

#### STOREI <small>(1110)</small>
```
MAR ← X
MBR ← M[MAR]  
MAR ← MBR  
MBR ← AC  
M[MAR] ← MBR
```

##### References
Essentials of Computer Organization and Architecture, Second Edition by Linda Null and Julia Lobur.
