RankData    = 0x4a5744

AsciiManager      = 0x4a8d58
AsciiManagerColor = 0x18480
AsciiManagerDrawF = 0x4015a0

	push eax # save original return value from GUI drawer
	push ebx
	mov  ecx, ds:AsciiManager
	mov  eax, dword ptr ds:RankData
	cmp  eax, 0x400
	jl   notmax
	mov  dword ptr [ecx+AsciiManagerColor], 0xffff8080
notmax:
	# AsciiManagerDrawF now takes `this` in ECX instead of on the stack
	push ecx
	push eax
	push 0x55555555 # format string in codecave
	mov  ebx, 0xAAAAAAAA # draw position in codecave
	mov  eax, AsciiManagerDrawF
	call eax # thcrap doesnt support using options as relative operands, so do this
	add  esp, 0x8
	pop  ecx
	or   dword ptr [ecx+AsciiManagerColor], -1
	pop  ebx
	pop  eax
	ret
	