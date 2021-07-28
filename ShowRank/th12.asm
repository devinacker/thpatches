RankData    = 0x4b0ccc

AsciiManager      = 0x4b43b8
AsciiManagerColor = 0x18f80
AsciiManagerDrawF = 0x4015c0

	push eax # save original return value from GUI drawer
	push ebx
	push esi
	mov  esi, ds:AsciiManager
	mov  eax, dword ptr ds:RankData
	cmp  eax, 0x400
	jl   notmax
	mov  dword ptr [esi+AsciiManagerColor], 0xffff8080
notmax:
	# AsciiManagerDrawF now takes `this` in ESI instead of on the stack
	push eax
	push 0x55555555 # format string in codecave
	mov  ebx, 0xAAAAAAAA # draw position in codecave
	mov  eax, AsciiManagerDrawF
	call eax # thcrap doesnt support using options as relative operands, so do this
	add  esp, 0x8
	or   dword ptr [esi+AsciiManagerColor], -1
	pop  esi
	pop  ebx
	pop  eax
	ret
	