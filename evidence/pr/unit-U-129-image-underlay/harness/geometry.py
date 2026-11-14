"""Prints the layer geometry and LCP candidates from results/local-after*.json, for the crop and entropy answers."""
import json, sys

d = sys.argv[1]
for f in ['local-after-slow']:
    for r in json.load(open(f'{d}/{f}.json')):
        if r['rep'] == 0 and r['flow'] == 'warm-click':
            print(r['device'], 'card box', r['cardBox'])
            for l in r['layers']:
                print('  layer', l['w'], 'natural', l['natural'], 'box', l['box'], l['fit'], l['pos'])
for r in json.load(open(f'{d}/local-after-slow.json')):
    if r['rep'] == 0 and r['flow'] == 'cold':
        print(r['device'], 'cold LCP candidates', r['lcpCandidates'], [(l['w'], l['bytes'], l['box'][:2]) for l in r['layers']])
