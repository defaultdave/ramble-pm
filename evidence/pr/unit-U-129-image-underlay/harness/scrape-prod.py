"""Reads the seeded photos off production's public pages into prod-photos.json, for the local harness.
Needs only public HTML. Usage: python3 scrape-prod.py https://ramble-sand.vercel.app"""
import html, json, re, subprocess, sys, urllib.parse

base = sys.argv[1].rstrip('/')


def get(path):
    for attempt in range(8):
        done = subprocess.run(['curl', '-sfL', '--compressed', base + path], capture_output=True)
        if done.returncode == 0:
            return done.stdout.decode()
    raise SystemExit('could not fetch ' + path)


home = get('/')
slugs = []
for m in re.finditer(r'href="(/experiences/[^"]+)"', home):
    if m.group(1) not in slugs:
        slugs.append(m.group(1))


def blur_of(tag):
    m = re.search(r"href=(?:&#x27;|')(data:image/[^&']+)", tag)
    if m:
        return urllib.parse.unquote(html.unescape(m.group(1)))
    return None


out = []
for slug in slugs:
    page = get(slug)
    title = html.unescape(re.search(r'<h1[^>]*>(.*?)</h1>', page).group(1))
    photos, seen = [], set()
    for tag in re.findall(r'<img[^>]*>', page):
        if 'data-nimg="fill"' not in tag:
            continue
        src = html.unescape(re.search(r' src="([^"]*)"', tag).group(1))
        url = urllib.parse.parse_qs(urllib.parse.urlparse(src).query)['url'][0]
        if url in seen:
            continue
        seen.add(url)
        photos.append({
            'src': url,
            'alt': html.unescape(re.search(r'alt="([^"]*)"', tag).group(1)),
            'blurDataUrl': blur_of(tag) or '',
        })
    card = ''
    for tag in re.findall(r'<img[^>]*>', home):
        if photos and urllib.parse.quote(photos[0]['src'], safe='') in tag:
            card = tag
            break
    sizes = re.search(r'sizes="([^"]*)"', card)
    out.append({'slug': slug, 'title': title, 'cardSizes': sizes.group(1) if sizes else None, 'photos': photos})

json.dump(out, open('prod-photos.json', 'w'), indent=1)
print([(o['title'], o['cardSizes'], len(o['photos']), bool(o['photos'] and o['photos'][0]['blurDataUrl'])) for o in out])
