import os
from datetime import datetime

base_url = "https://bep.pe"

def generate_sitemap(base_url, directory=".", output="sitemap.xml"):
    urls = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                path = os.path.relpath(os.path.join(root, file), directory)
                url = f"{base_url}/{path.replace(os.sep, '/')}"
                lastmod = datetime.now().strftime("%Y-%m-%d")
                urls.append((url, lastmod))
    
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