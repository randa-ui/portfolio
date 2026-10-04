#!/usr/bin/env python3
"""
Site Editor — a tiny local app for editing the portfolio's text and publishing it.

    python3 tools/editor.py          → opens http://localhost:8777

What it edits
  • Home headline + tagline                (index.html, js/projects.js)
  • About paragraphs + Selected clients    (about.html)
  • Contact details                        (js/projects.js → site)
  • Every project: title, client, role, year, description, credits,
    main video (Vimeo / YouTube ID or local file), tile image upload, order
Publish runs tools/publish.sh (version stamp → commit → push) and reports the GitHub build.

Standard library only. Content parsing of projects.js is done with node (already installed).
"""
import http.server, json, os, re, subprocess, sys, urllib.parse, webbrowser, threading, cgi, tempfile, shutil, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8777
os.chdir(ROOT)

# ----------------------------------------------------------------- read

def read_projects_js():
    """Parse js/projects.js → {"site": {...}, "projects": [...]} using node."""
    out = subprocess.run(
        ["node", "-e",
         "const fs=require('fs');const m={};new Function(fs.readFileSync('js/projects.js','utf8')+';this.site=site;this.projects=projects;').call(m);process.stdout.write(JSON.stringify({site:m.site,projects:m.projects}))"],
        capture_output=True, text=True, check=True)
    return json.loads(out.stdout)

def read_index():
    s = open("index.html", encoding="utf-8").read()
    m = re.search(r"<h1>(.*?)</h1>", s, re.S)
    raw = m.group(1)
    lines = [re.sub(r"<[^>]+>", "", x).strip() for x in raw.split("<br>")]
    return {"headline1": lines[0] if lines else "", "headline2": lines[1] if len(lines) > 1 else ""}

PAGES = {"home": "index.html", "about": "about.html", "contact": "contact.html", "project": "project.html"}

def read_pages():
    out = {}
    for key, f in PAGES.items():
        t = open(f, encoding="utf-8").read()
        title = re.search(r"<title>(.*?)</title>", t, re.S)
        desc = re.search(r'<meta name="description" content="(.*?)">', t)
        out[key] = {"title": unescape(title.group(1)) if title else "", "description": unescape(desc.group(1)) if desc else ""}
    return out

def write_pages(pages):
    for key, f in PAGES.items():
        if key not in pages: continue
        t = open(f, encoding="utf-8").read()
        t = re.sub(r"<title>.*?</title>", "<title>" + escape(pages[key].get("title", "")) + "</title>", t, count=1, flags=re.S)
        d = escape(pages[key].get("description", "")).replace('"', "&quot;")
        if re.search(r'<meta name="description"', t):
            t = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{d}">', t, count=1)
        elif d:
            t = t.replace("</title>", f'</title>\n  <meta name="description" content="{d}">', 1)
        open(f, "w", encoding="utf-8").write(t)

def read_about():
    s = open("about.html", encoding="utf-8").read()
    text = re.search(r'<div class="about-text">(.*?)<div class="facts">', s, re.S)
    body = text.group(1) if text else ""
    h1 = re.search(r"<h1>(.*?)</h1>", body, re.S)
    paras = [unescape(re.sub(r"<[^>]+>", "", p)).strip() for p in re.findall(r"<p>(.*?)</p>", body, re.S)]
    clients = [unescape(x) for x in re.findall(r"<li>(.*?)</li>", s)]
    heading = re.search(r'<div class="facts">.*?<h2>(.*?)</h2>', s, re.S)
    return {"heading": unescape(h1.group(1)) if h1 else "", "paragraphs": paras,
            "clientsHeading": unescape(heading.group(1)) if heading else "Selected clients", "clients": clients}

def unescape(t):
    return t.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"')

def escape(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

# ----------------------------------------------------------------- write

def js_str(v):  # JSON string literal is valid JS
    return json.dumps(v, ensure_ascii=False)

def js_array(arr, indent="    "):
    if not arr:
        return "[]"
    inner = ",\n".join(indent + "  " + json.dumps(x, ensure_ascii=False) for x in arr)
    return "[\n" + inner + ",\n" + indent + "]"

def write_projects_js(data):
    src = open("js/projects.js", encoding="utf-8").read()
    header = src[: src.index("const site = {")]
    site = data["site"]
    out = [header.rstrip("\n"), "", "const site = {"]
    for k in ["name", "fullName", "role", "tagline", "email", "location", "instagram", "linkedin"]:
        out.append(f"  {k}: {js_str(site.get(k, ''))},")
    out.append("  // Contact form: create a free form at https://formspree.io and paste the endpoint here.")
    out.append("  // Until you do, the form falls back to opening your email client.")
    out.append(f"  formEndpoint: {js_str(site.get('formEndpoint', 'https://formspree.io/f/YOUR_FORM_ID'))},")
    out.append("  // Every small piece of interface text (edit in the Site Editor → Texts tab)")
    out.append("  text: {")
    for k, v in (site.get("text") or {}).items():
        out.append(f"    {k}: {js_str(v)},")
    out.append("  },")
    out.append("};")
    out.append("")
    out.append("const projects = [")
    for p in data["projects"]:
        out.append("  {")
        for k in ["slug", "title", "client", "role", "year", "thumb", "preview"]:
            out.append(f"    {k}: {js_str(p.get(k, ''))},")
        if p.get("loop"):
            out.append(f"    loop: {js_str(p['loop'])},")
        hero = p.get("hero") or {}
        if hero.get("vimeo"):
            out.append(f"    hero: {{ vimeo: {js_str(str(hero['vimeo']))} }},")
        elif hero.get("youtube"):
            out.append(f"    hero: {{ youtube: {js_str(str(hero['youtube']))} }},")
        elif not hero.get("video") and not hero.get("poster"):
            out.append("    hero: {},")
        else:
            poster = hero.get("poster", f"assets/thumbs/{p['slug']}-hero.jpg")
            video = hero.get("video", f"assets/videos/{p['slug']}-hero.mp4")
            out.append(f"    hero: {{ video: {js_str(video)}, poster: {js_str(poster)} }},")
        out.append(f"    description: {js_array(p.get('description') or [])},")
        out.append(f"    credits: {js_array(p.get('credits') or [])},")
        gallery = p.get("gallery") or []
        out.append(f"    gallery: {js_array(gallery)},")
        out.append("  },")
    out.append("];")
    open("js/projects.js", "w", encoding="utf-8").write("\n".join(out) + "\n")
    # sanity: must parse
    read_projects_js()

def write_index(h):
    s = open("index.html", encoding="utf-8").read()
    l1 = escape(h["headline1"].strip())
    l2 = escape(h["headline2"].strip())
    # keep the turning "+" effect if the second line contains a plus
    l2 = re.sub(r"\s*\+\s*", ' <em class="amp">+</em> ', l2, count=1)
    new = f"<h1>{l1}<br>{l2}</h1>" if l2 else f"<h1>{l1}</h1>"
    s = re.sub(r"<h1>.*?</h1>", new, s, count=1, flags=re.S)
    open("index.html", "w", encoding="utf-8").write(s)

def write_about(a):
    s = open("about.html", encoding="utf-8").read()
    paras = "\n".join(f"        <p>{escape(p.strip())}</p>" for p in a["paragraphs"] if p.strip())
    text_block = f'<div class="about-text">\n        <h1>{escape(a["heading"].strip())}</h1>\n{paras}\n\n        '
    s = re.sub(r'<div class="about-text">.*?(?=<div class="facts">)', text_block, s, count=1, flags=re.S)
    items = "\n".join(f"              <li>{escape(c.strip())}</li>" for c in a["clients"] if c.strip())
    facts = (f'<div class="facts">\n          <div>\n            <h2>{escape(a["clientsHeading"].strip())}</h2>\n'
             f'            <ul>\n{items}\n            </ul>\n          </div>\n        </div>')
    s = re.sub(r'<div class="facts">.*?</ul>\s*</div>\s*</div>', facts, s, count=1, flags=re.S)
    open("about.html", "w", encoding="utf-8").write(s)

# ----------------------------------------------------------------- publish

def run(cmd, timeout=600):
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    return r.returncode, (r.stdout + r.stderr).strip()

def build_status():
    code, out = run(["gh", "api", "repos/randa-ui/portfolio/pages/builds/latest", "--jq", ".status"], timeout=30)
    return out if code == 0 else "unknown"

def publish(message):
    code, out = run(["tools/publish.sh", message or "Update from Site Editor"])
    if code != 0:
        return {"ok": False, "log": out}
    if "nothing to commit" in out:
        return {"ok": True, "log": out, "build": "nothing to publish"}
    status = "building"
    for _ in range(30):
        time.sleep(10)
        status = build_status()
        if status in ("built", "errored"):
            break
    if status == "errored":  # GitHub sometimes rate-limits builds; ask for a rebuild once
        run(["gh", "api", "-X", "POST", "repos/randa-ui/portfolio/pages/builds"], timeout=30)
        for _ in range(30):
            time.sleep(10)
            status = build_status()
            if status in ("built", "errored"):
                break
    return {"ok": status == "built", "log": out, "build": status}

def save_tile(slug, filename, data):
    ext = os.path.splitext(filename)[1].lower() or ".png"
    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as t:
        t.write(data); tmp = t.name
    dst = f"assets/thumbs/{slug}.jpg"
    code, out = run(["ffmpeg", "-nostdin", "-y", "-loglevel", "error", "-i", tmp, "-vf",
                     "scale=1200:900:force_original_aspect_ratio=increase:flags=lanczos,crop=1200:900", "-q:v", "3", dst])
    os.unlink(tmp)
    if code != 0:
        return {"ok": False, "log": out}
    open(f"assets/thumbs/{slug}.keep", "a").close()
    return {"ok": True, "thumb": dst}

# ----------------------------------------------------------------- server

class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):  # quiet
        pass

    def _json(self, obj, code=200):
        b = json.dumps(obj).encode()
        self.send_response(code); self.send_header("Content-Type", "application/json"); self.send_header("Content-Length", str(len(b))); self.end_headers(); self.wfile.write(b)

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        if path in ("/", "/index.html"):
            b = open(os.path.join(ROOT, "tools", "editor.html"), "rb").read()
            self.send_response(200); self.send_header("Content-Type", "text/html; charset=utf-8"); self.send_header("Content-Length", str(len(b))); self.end_headers(); self.wfile.write(b); return
        if path == "/api/content":
            try:
                d = read_projects_js(); d["home"] = read_index(); d["about"] = read_about(); d["pages"] = read_pages(); d["build"] = build_status()
                return self._json(d)
            except Exception as e:
                return self._json({"error": str(e)}, 500)
        if path == "/api/status":
            return self._json({"build": build_status()})
        return super().do_GET()  # serves the site's own files (thumbs for preview)

    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path
        length = int(self.headers.get("Content-Length", 0))
        if path == "/api/save":
            try:
                d = json.loads(self.rfile.read(length))
                write_projects_js({"site": d["site"], "projects": d["projects"]})
                write_index(d["home"]); write_about(d["about"]); write_pages(d.get("pages", {}))
                return self._json({"ok": True})
            except Exception as e:
                return self._json({"ok": False, "error": str(e)}, 500)
        if path == "/api/publish":
            d = json.loads(self.rfile.read(length) or b"{}")
            return self._json(publish(d.get("message", "")))
        if path == "/api/tile":
            form = cgi.FieldStorage(fp=self.rfile, headers=self.headers, environ={"REQUEST_METHOD": "POST", "CONTENT_TYPE": self.headers["Content-Type"]})
            slug = form.getvalue("slug"); f = form["file"]
            return self._json(save_tile(slug, f.filename, f.file.read()))
        return self._json({"error": "unknown"}, 404)

if __name__ == "__main__":
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), H)
    url = f"http://localhost:{PORT}/"
    print(f"Site Editor running at {url}  (close this window to stop)")
    if "--no-open" not in sys.argv:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
