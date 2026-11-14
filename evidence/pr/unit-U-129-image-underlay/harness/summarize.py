"""Turns results/*.json into the markdown tables of measurement.md. Usage: python3 summarize.py <results dir>"""
import json, statistics, sys

d = sys.argv[1]
targets = [('prod-before', 'production (baseline)'), ('local-before', 'local build, main'), ('local-after', 'local build, underlay')]


def load(name):
    try:
        return [r for r in json.load(open(f'{d}/{name}.json')) if 'error' not in r]
    except FileNotFoundError:
        return []


def med(values):
    values = [v for v in values if v is not None]
    return None if not values else statistics.median(values)


def fmt(v, unit=''):
    if v is None:
        return 'n/a'
    return (f'{v:.0f}' if abs(v) >= 10 or v == int(v) else f'{v:.1f}') + unit


def spread(values):
    values = [v for v in values if v is not None]
    return 'n/a' if not values else f'{fmt(statistics.median(values))} ({fmt(min(values))}-{fmt(max(values))})'


def layer_text(runs):
    first = runs[0]
    parts = []
    for l in first['layers']:
        kind = 'under' if len(first['layers']) == 2 and l is first['layers'][0] else ('main' if len(first['layers']) == 2 else 'lead')
        hits = [r['layers'][first['layers'].index(l)]['cacheHit'] for r in runs]
        hit = max(set(map(str, hits)), key=lambda x: list(map(str, hits)).count(x))
        parts.append(f"{kind} {l['w']}w {'hit: ' + hit if hit not in ('False', 'None') else 'network'}")
    return '; '.join(parts)


for suffix, title in [('', 'No throttling (this machine, as is)'), ('-slow', 'Throttled: 1.6 Mbps down, 150 ms added latency, applied to the navigation under test only')]:
    print(f'\n### {title}\n')
    print('| Target | Device | Flow | Lead layers (URL width, cache) | First sharp, ms | Main complete, ms | LCP, ms | LCP element | Image bytes on the wire | n |')
    print('|---|---|---|---|---|---|---|---|---|---|')
    for name, label in targets:
        rows = load(name + suffix)
        for device in ('phone', 'desktop'):
            for flow in ('cold', 'warm-hard', 'warm-click'):
                runs = [r for r in rows if r['device'] == device and r['flow'] == flow and r['rep'] >= 0]
                if not runs:
                    continue
                lcp = [r['lcp']['ms'] for r in runs if r.get('lcp')]
                el = ''
                if runs[0].get('lcp'):
                    kinds = sorted({('blur (data URI)' if not r['lcp']['w'] else f"photo {r['lcp']['w']}w") for r in runs if r.get('lcp')})
                    el = ' / '.join(kinds)
                else:
                    el = 'not reported (client-side navigation)'
                print(f"| {label} | {device} | {flow} | {layer_text(runs)} | {spread([r['firstSharpMs'] for r in runs])} | {spread([r['mainCompleteMs'] for r in runs])} | {spread(lcp) if lcp else 'n/a'} | {el} | {fmt(med([r['imageBytes'] for r in runs]))} | {len(runs)} |")
