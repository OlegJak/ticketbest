import html, json, re, sys, time, urllib.request, urllib.parse
from html.parser import HTMLParser

BASE = "https://ticketbest.eu"
OUT = sys.argv[1]
UA = {"User-Agent": "Mozilla/5.0"}


def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def text(s):
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def parse_cards(page):
    cards = []
    for m in re.finditer(r"<div class='card'>(.*?)<button class='js-unifd-trigger-link card_button'([^>]*)>", page, re.S):
        body, btn = m.group(1), m.group(2)
        href = re.search(r'href="(/performances/[^"]+)"', body).group(1)
        img = re.search(r'src="([^"]+)"', body).group(1)
        title = text(re.search(r'class="card_title"[^>]*>(.*?)</a>', body, re.S).group(1))
        addr = text(re.search(r"class='card_adress'>(.*?)</p>", body, re.S).group(1))
        price = text(re.search(r"class='card_price'>(.*?)</p>", body, re.S).group(1))
        st = re.search(r"data-unifd-showtime='([^']+)'", btn).group(1)
        date, tm = st.split("+")
        eid = re.search(r"event_id=(\d+)", href)
        cards.append({
            "id": int(eid.group(1)) if eid else None,
            "url": BASE + html.unescape(href),
            "slug": href.split("/performances/")[1].split("?")[0],
            "poster": BASE + img,
            "title": title,
            "address": addr,
            "price": price,
            "date": date.replace(".", "-"),
            "time": tm,
        })
    return cards


home = get(BASE + "/")
events = parse_cards(home)
print("events", len(events))

tags = re.findall(r'data-filter-tag="([^"]+)" href="[^"]*">([^<]*)', home)
for slug, name in tags:
    page = get(BASE + "/?filter%5Btag%5D=" + slug)
    ids = {(c["slug"], c["date"], c["time"]) for c in parse_cards(page)}
    n = 0
    for e in events:
        if (e["slug"], e["date"], e["time"]) in ids:
            e.setdefault("tags", []).append(slug)
            n += 1
    print("tag", slug, n)

# compilations (tours)
tours = []
for m in re.finditer(r'<a[^>]+href="(/compilations/[^"]+)"[^>]*>(.*?)</a>', home, re.S):
    href, body = m.groups()
    img = re.search(r'src="([^"]+)"', body)
    t = text(body)
    if not t:
        continue
    tours.append({"slug": href.split("/compilations/")[1], "image": BASE + img.group(1) if img else None, "label": t})
for t in tours:
    page = get(BASE + "/compilations/" + t["slug"])
    t["slugs"] = sorted({c["slug"] for c in parse_cards(page)})
    tm = re.search(r"<title>(.*?)</title>", page, re.S)
    t["title"] = text(tm.group(1)).replace(" | Ticket Best Europe", "") if tm else t["label"]
    print("tour", t["slug"], len(t["slugs"]))

slides = []
for m in re.finditer(r'<a[^>]+href="([^"]+)"[^>]*>\s*<img[^>]+src="(/uploads/slider_item/[^"]+)"', home):
    s = {"href": m.group(1), "image": BASE + m.group(2)}
    if s not in slides:
        slides.append(s)
print("slides", len(slides))

# event details: one fetch per unique performance slug
details = {}
for e in events:
    if e["slug"] in details:
        continue
    try:
        page = get(e["url"])
    except Exception as ex:
        print("fail", e["slug"], ex)
        continue
    d = {}
    age = re.search(r"<p class='showcase_date'>([^<]*)</p>", page)
    d["age"] = text(age.group(1)) or None if age else None
    art = re.search(r"<h2 class='heading-1'>[^<]*</h2>(.*?)<p class='organization-link'>", page, re.S)
    raw = art.group(1).strip() if art else ""
    raw = re.sub(r"<(script|style|iframe)[^>]*>.*?</\1>", "", raw, flags=re.S)
    raw = re.sub(r"\s(style|class|id)=(\"[^\"]*\"|'[^']*')", "", raw)
    d["descriptionHtml"] = raw
    org = re.search(r"Korraldaja:\s*<a[^>]*>([^<]+)</a>", page)
    d["organizer"] = html.unescape(org.group(1)).strip() if org else None
    big = re.search(r'class="showcase_image" src="([^"]+)"', page)
    d["image"] = BASE + big.group(1) if big else None
    details[e["slug"]] = d
    time.sleep(0.15)
print("details", len(details))

json.dump({"events": events, "tags": tags, "tours": tours, "slides": slides, "details": details},
          open(OUT, "w"), ensure_ascii=False, indent=1)
