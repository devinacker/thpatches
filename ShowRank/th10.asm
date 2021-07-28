RankData    = 0x474c98

AsciiManager      = 0x4776e0
AsciiManagerColor = 0x8974
AsciiManagerDrawF = 0x401630

	push eax # save original return value from GUI drawer
	push ebx
	# AsciiManager is now the location of a pointer, rather than the struct itself
	mov  ecx, ds:AsciiManager
	# RankData is now a single int32, range is -1024..1024
	mov  eax, dword ptr ds:RankData
	cmp  eax, 0x400
	jl   notmax
	mov  dword ptr [ecx+AsciiManagerColor], 0xffff8080
notmax:
	# AsciiManagerDrawF now takes position in EBX instead of on the stack
	push eax
	push 0x55555555 # format string in codecave
	mov  ebx, 0xAAAAAAAA # draw position in codecave
	push ecx
	mov  eax, AsciiManagerDrawF
	call eax # thcrap doesnt support using options as relative operands, so do this
	pop  ecx
	add  esp, 0x8
	or   dword ptr [ecx+AsciiManagerColor], -1
	pop  ebx
	pop  eax
	ret
	