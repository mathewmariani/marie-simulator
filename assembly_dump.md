# MARIE Assembly Language

## Assembly Dump <small>helloworld.mas</small>

```
|           ORG 0              					/ implemented using "do while" loop
000 1011 |  WHILE    LOAD STR_BASE      / load str_base into ac
001 300F |           ADD ITR            / add index to str_base
002 2010 |           STORE INDEX        / store (str_base + index) into ac
003 A000 |           CLEAR              / set ac to zero
004 B010 |           ADDI INDEX         / get the value at ADDR
005 8400 |           SKIPCOND 400       / SKIP if ADDR = 0 (or null char)
006 9008 |           JUMP DO            / jump to DO
007 900D |           JUMP END           / JUMP to END
008 6000 |  DO       OUTPUT             / output value at ADDR
009 100F |           LOAD ITR           / load iterator into ac
00A 300E |           ADD ONE            / increment iterator by one
00B 200F |           STORE ITR          / store ac in iterator
00C 9000 |           JUMP WHILE         / jump to while
00D 7000 |  END      HALT                
00E 0001 |  ONE      DEC 1               
00F 0000 |  ITR      DEC 0               
010 0000 |  INDEX    HEX 0               
011 0012 |  STR_BASE HEX 12             / memory location of str
012 0048 |  STR      HEX 48             / H
013 0065 |           HEX 65             / E
014 006C |           HEX 6C             / L
015 006C |           HEX 6C             / L
016 006F |           HEX 6F             / O
017 000D |           HEX D              / carriage return
018 0057 |           HEX 57             / W
019 006F |           HEX 6F             / O
01A 0072 |           HEX 72             / R
01B 006C |           HEX 6C             / L
01C 0064 |           HEX 64             / D
01D 0000 |           HEX 0              / NULL char
```
