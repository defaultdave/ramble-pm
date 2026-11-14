"""Downloads the seeded source photos named in prod-photos.json from production's public Blob store
into ./photos/, so the local harness serves them from disk. Public objects, no token.
Usage: python3 fetch-photos.py"""
import json, os, subprocess

os.makedirs('photos', exist_ok=True)
for entry in json.load(open('prod-photos.json')):
    if '384px' not in (entry['cardSizes'] or ''):
        continue
    for photo in entry['photos']:
        target = os.path.join('photos', photo['src'].rsplit('/', 1)[1])
        if not os.path.exists(target):
            subprocess.run(['curl', '-sfL', '--retry', '5', '-o', target, photo['src']], check=True)
        print(target, os.path.getsize(target))
