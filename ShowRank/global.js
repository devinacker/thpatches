{	
    "options": {
        "showrank_hud_orig": {
            /* only used by TH06 - TH08 */
            type: "u32", val: "0"
        }
    },
    "binhacks": {
        /*
        TH06 - TH08: detour the HUD drawer
        original function addr. defined per game as option:showrank_hud_orig
        */
        "showrank_call_hud": {
            "code":     "<codecave:showrank_hud>",
            "expected": "<option:showrank_hud_orig>"
        },
        /*
        TH10 (and up): just jump to codecave after calling the original HUD drawer
        no need to specify showrank_hud_orig for this,
        just put this binhack at the end of the trampoline instead
        */
        "showrank_call_hud_v2": {
            "code": "e9 [codecave:showrank_hud_v2]",
            "expected": "c3 cc cc cc cc"
        },
        "showrank_call_hud_v2_ecx": {
            "code": "e9 [codecave:showrank_hud_v2_ecx]",
            "expected": "c3 cc cc cc cc"
        },
        "showrank_call_hud_v2_esi": {
            "code": "e9 [codecave:showrank_hud_v2_esi]",
            "expected": "c3 cc cc cc cc"
        }
    },
    "codecaves": {
        "showrank_pos": {
            /*
            position of the rank text on screen (x, y, z)
            x and y are in pixel coordinates (at least up through TH10)
            */
            "access": "r",
            "code": "+0.0f +0.0f +0.0f"
        },
        
        /* TH06 - TH08 */
        "showrank_hud": {
            "access": "e",
            /* 
            jump to showrank_hud_orig after doing our own thing
            since thcrap can't turn options into relative operands, do "jmp eax" instead
            showrank_rank_data is a pointer to four uint32s (rank, rank_max, rank_min, rank_fraction)
            if rank == rank_max, ignore rank_fraction and display the text in red
            */
            "code": "\
                51\
                B9 <option:showrank_rank_data>\
                8B 01\
                3B 41 04\
                7D 05\
                FF 71 0C\
                EB 0C\
                6A 00\
                C7 05 <option:showrank_ascii_manager_color> <0xffff8080>\
                50\
                68 <codecave:showrank_fmt>\
                68 <codecave:showrank_pos>\
                68 <option:showrank_ascii_manager>\
                B8 <option:showrank_ascii_manager_drawf>\
                FF D0\
                83 C4 14\
                83 0D <option:showrank_ascii_manager_color> FF\
                59\
                B8 <option:showrank_hud_orig>\
                FF E0"
        },
        "showrank_fmt": {
            "access": "r",
            /* "Rank: %d.%.02d" */
            "code": "52 61 6e 6b 3a 20 25 64 2e 25 2e 30 32 64 00"
        },
        
        /* TH10 (and up) */
        "showrank_hud_v2": {
            "access": "e",
            /* 
            showrank_rank_data is now a single int32, range is -1024..1024
            showrank_ascii_manager is now the location of a pointer, rather than the struct itself
            showrank_ascii_manager_drawf now takes position in EBX instead of on the stack
            */
            "code": "\
                50\
                53\
                8B 0D <option:showrank_ascii_manager>\
                A1 <option:showrank_rank_data>\
                3D <0x400>\
                7C 0A\
                C7 81 <option:showrank_ascii_manager_color> <0xffff8080>\
                50\
                68 <codecave:showrank_fmt_v2>\
                BB <codecave:showrank_pos>\
                51\
                B8 <option:showrank_ascii_manager_drawf>\
                FF D0\
                59\
                83 C4 08\
                83 89 <option:showrank_ascii_manager_color> FF\
                5B\
                58\
                C3"
        },
        "showrank_hud_v2_ecx": {
            "access": "e",
            /* 
            TH11: same as showrank_hud_v2, but showrank_ascii_manager_drawf takes `this` in ECX instead of stack
            */
            "code": "\
                50\
                53\
                8B 0D <option:showrank_ascii_manager>\
                A1 <option:showrank_rank_data>\
                3D <0x400>\
                7C 0A\
                C7 81 <option:showrank_ascii_manager_color> <0xffff8080>\
                51\
                50\
                68 <codecave:showrank_fmt_v2>\
                BB <codecave:showrank_pos>\
                B8 <option:showrank_ascii_manager_drawf>\
                FF D0\
                83 C4 08\
                59\
                83 89 <option:showrank_ascii_manager_color> FF\
                5B\
                58\
                C3"
        },
        "showrank_hud_v2_esi": {
            "access": "e",
            /* 
            TH12: same as showrank_hud_v2, but showrank_ascii_manager_drawf takes `this` in ESI instead of stack
            */
            "code": "\
                50\
                53\
                56\
                8B 35 <option:showrank_ascii_manager>\
                A1 <option:showrank_rank_data>\
                3D <0x400>\
                7C 0A\
                C7 86 <option:showrank_ascii_manager_color> <0xffff8080>\
                50\
                68 <codecave:showrank_fmt_v2>\
                BB <codecave:showrank_pos>\
                B8 <option:showrank_ascii_manager_drawf>\
                FF D0\
                83 C4 08\
                83 8E <option:showrank_ascii_manager_color> FF\
                5E\
                5B\
                58\
                C3"
        },
        "showrank_fmt_v2": {
            "access": "r",
            /* "Rank: %d" */
            "code": "52 61 6e 6b 3a 20 25 64 00"
        }
    }
}
