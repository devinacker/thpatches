RankData    = 0x69d710
RankCurrent = 0x0
RankMax     = 0x4
RankFrac    = 0xc

AsciiManager      = 0x47b900
AsciiManagerColor = 0x481B24
AsciiManagerDrawF = 0x401650

ShowHUDOrig = 0x417502
	
	push ecx
	# RankData is a pointer to four uint32s (rank, rank_max, rank_min, rank_fraction)
	# if rank == rank_max, ignore rank_fraction and display the text in red
	mov  ecx, ds:RankData
	mov  eax, dword ptr [ecx+RankCurrent]
	cmp  eax, dword ptr [ecx+RankMax]
	jge  max
	push dword ptr [ecx+RankFrac]
	jmp  cont
max:
	push 0
	mov  dword ptr ds:AsciiManagerColor, 0xffff8080
cont:
	push eax
	push 0x55555555 # format string in codecave
	push 0xAAAAAAAA # draw position in codecave
	push AsciiManager
	mov  eax, AsciiManagerDrawF
	call eax
	add  esp, 0x14
	or   dword ptr ds:AsciiManagerColor, -1
	pop  ecx
	mov  eax, ShowHUDOrig
	jmp  eax # thcrap doesnt support using options as relative operands, so do this
	