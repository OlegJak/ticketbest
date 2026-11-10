import json, re, sys, html

src, out = sys.argv[1], sys.argv[2]
d = json.load(open(src))

COUNTRY = {"Eesti": "EE", "Soome": "FI", "Läti": "LV", "Leedu": "LT", "Rootsi": "SE",
           "Hispaania": "ES", "Serbia": "RS", "Portugal": "PT"}
CITY_FIX = {"Helsingi": "Helsinki", "Belgrad": "Beograd"}
TAG = {"kontsertymuzyka": "concert", "teatrtanets": "theatre", "klubyshou": "show", "sport": "sport"}

ALLOWED = {"p", "br", "strong", "b", "em", "i", "ul", "ol", "li", "h3", "h4"}


def clean_html(s):
    s = re.sub(r"<(/?)([a-zA-Z0-9]+)[^>]*>",
               lambda m: f"<{m.group(1)}{m.group(2).lower()}>" if m.group(2).lower() in ALLOWED else "", s)
    s = re.sub(r"<p>\s*(&nbsp;|\s)*</p>", "", s)
    return s.strip()


def split_title(t):
    # "NAME. Subtitle | City"  -> name, subtitle
    t = re.sub(r"\s+\|\s+[^|]*$", "", t)                       # drop trailing "| City"
    t = re.sub(r"\s+I\s+[A-ZÄÖÜÕŠŽ ]+$", "", t)                # drop " I TAMPERE"
    t = t.strip().lstrip("​")
    m = re.match(r"^([^.]{3,60}?)\.\s+(.+)$", t)
    if m and sum(c.isupper() for c in m.group(1)) > len(m.group(1).replace(" ", "")) * 0.6:
        return m.group(1).strip(), m.group(2).strip()
    m = re.match(r"^(.{3,60}?)\s+[–—-]\s+(.+)$", t)
    if m and m.group(1).isupper():
        return m.group(1).strip(), m.group(2).strip()
    return t, ""


slug2tour = {}
tours = []
for t in d["tours"]:
    title = re.sub(r"\s*\d+\s+üritust\s*$", "", t["label"]).strip()
    title = re.sub(r":\s*kontser(t|di)tuur$", "", title, flags=re.I)
    title = re.sub(r"\s+\|\s+[^|]*$", "", title)
    tours.append({"slug": t["slug"], "title": title, "image": t["image"]})
    for s in t["slugs"]:
        slug2tour.setdefault(s, t["slug"])

events = []
for e in d["events"]:
    parts = [p.strip() for p in e["address"].split(",")]
    country, city, venue = parts[0], parts[1] if len(parts) > 1 else "", ", ".join(parts[2:])
    city = CITY_FIX.get(city, city)
    name, sub = split_title(e["title"])
    det = d["details"].get(e["slug"], {})
    events.append({
        "id": e["id"], "slug": e["slug"], "url": e["url"],
        "title": name, "subtitle": sub, "fullTitle": e["title"],
        "date": e["date"], "time": e["time"],
        "country": COUNTRY.get(country, country), "city": city, "venue": venue,
        "poster": e["poster"], "image": det.get("image"),
        "age": det.get("age"), "organizer": det.get("organizer"),
        "tags": [TAG[t] for t in e.get("tags", []) if t in TAG],
        "tour": slug2tour.get(e["slug"]),
    })

descriptions = {s: clean_html(v["descriptionHtml"]) for s, v in d["details"].items() if v.get("descriptionHtml")}

slides = []
for s in d["slides"]:
    h = s["href"].replace("https://www.ticketbest.eu", "")
    m = re.match(r"/(performances|compilations)/([^?]+)", h)
    slides.append({"image": s["image"], "kind": "event" if m.group(1) == "performances" else "tour", "slug": m.group(2)})

data = {"events": events, "tours": tours, "slides": slides, "descriptions": descriptions}
open(out, "w").write("window.TB_DATA = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
print(len(events), "events;", len(tours), "tours;", len(slides), "slides")
for e in events[:200:9]:
    print(" -", e["title"], "||", e["subtitle"][:50], "||", e["city"], e["venue"], e["tags"], e["tour"])
