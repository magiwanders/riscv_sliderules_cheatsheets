#!/usr/bin/env python3
# Extracts what the sheets use from the RISC-V Unified Database (riscv-software-src/riscv-unified-db, the instruction
# YAML files of spec/std/isa/inst) into spec/udb/instructions.json: per instruction its long name (the sheets'
# descriptions start from it), its RV32 encoding as a match string (msb first, - for operand bits: a check of every
# encoding, and the second source of the instructions only LLVM has) and the extensions that define it.
#
#   python3 tools/isa/udb.py ~/riscv-unified-db [revision]      (needs PyYAML)
import json
import os
import sys

import yaml

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')


def extensions_of(defined):
    # definedBy: { extension: { name } } or { extension: { anyOf / allOf: [...] } }, nested
    if isinstance(defined, dict):
        if 'name' in defined:
            return [defined['name']]
        return [name for value in defined.values() for name in extensions_of(value)]
    if isinstance(defined, list):
        return [name for item in defined for name in extensions_of(item)]
    return []


def main():
    udb = sys.argv[1]
    revision = sys.argv[2] if len(sys.argv) > 2 else 'unknown'
    instructions = {}
    base = os.path.join(udb, 'spec', 'std', 'isa', 'inst')
    for directory, _, files in sorted(os.walk(base)):
        for file in sorted(files):
            if not file.endswith('.yaml'):
                continue
            with open(os.path.join(directory, file)) as f:
                data = yaml.safe_load(f)
            if not isinstance(data, dict) or data.get('kind') != 'instruction':
                continue
            encoding = data.get('encoding') or {}
            if 'RV32' in encoding:
                encoding = encoding['RV32']
            elif 'match' not in encoding:
                continue  # RV64 only
            long_name = data.get('long_name') or ''
            instructions[data['name']] = {
                'long_name': '' if long_name.startswith('No synopsis') else long_name.strip(),
                'match': encoding.get('match'),
                'extensions': sorted(set(extensions_of(data.get('definedBy')))),
            }
    out = os.path.join(ROOT, 'spec', 'udb', 'instructions.json')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w') as f:
        json.dump({'source': {'project': 'riscv-software-src/riscv-unified-db', 'revision': revision}, 'instructions': instructions}, f, indent=1, sort_keys=True)
        f.write('\n')
    print(f'{out}: {len(instructions)} instructions')


if __name__ == '__main__':
    main()
