## Cheatsheet

#### Registers
**AC**, a 16-bit accumulator<br>
**IR**, a 16-bit register which holds an instruction immediately preceding its execution.<br>
**MBR**, a 16-bit register that holds the data after its retrieval from, or before its placement into memory.<br>
**PC**, a 12-bit register that holds the address of the next program instruction to be executed.<br>
**MAR**, a 12-bit register that holds a memory address of an instruction or the operand of an instruction.<br>
**InREG**, an 8-bit register that holds data read from an input device.<br>
**OutREG**, an 8-bit register that holds data that is ready for the output device<br>

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
