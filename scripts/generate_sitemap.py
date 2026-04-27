import os
from datetime import datetime

base_url = "https://bep.pe"

excluded_directories = ["instagram"]
excluded_files = {"privacy.html"}


def page_url(base_url, path):
    path = path.replace(os.sep, "/")
    if path == "index.html":
        return f"{base_url}/"
    if path.endswith("/index.html"):
        return f"{base_url}/{path[:-10]}"
    return f"{base_url}/{path}"


def last_modified(path):
    timestamp = os.path.getmtime(path)
    return datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")


def generate_sitemap(base_url, directory=".", output="sitemap.xml"):
    urls = []
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in excluded_directories]
        for file in files:
            if file.endswith(".html") and file not in excluded_files:
                file_path = os.path.join(root, file)
                path = os.path.relpath(file_path, directory)
                url = page_url(base_url, path)
                lastmod = last_modified(file_path)
                urls.append((url, lastmod))

    urls.sort()

    with open(output, "w") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for url, lastmod in urls:
            f.write(f"   <url>\n")
            f.write(f"      <loc>{url}</loc>\n")
            f.write(f"      <lastmod>{lastmod}</lastmod>\n")
            f.write(f"      <changefreq>monthly</changefreq>\n")
            f.write(f"      <priority>0.5</priority>\n")
            f.write(f"   </url>\n")
        f.write('</urlset>\n')

generate_sitemap(base_url, directory=".", output="sitemap.xml")
