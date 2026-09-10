<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
    xmlns:html="http://www.w3.org/TR/REC-html40"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="de">
      <head>
        <title>XML Sitemap | MyMusicMoment24</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #020617;
            color: #f8fafc;
            padding: 30px 20px;
            line-height: 1.5;
          }
          .container {
            max-width: 1080px;
            margin: 0 auto;
            background-color: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          }
          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
            border-bottom: 1px solid #1e293b;
            padding-bottom: 24px;
            margin-bottom: 24px;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .icon {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
          }
          h1 {
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(to right, #ffffff, #cbd5e1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p.subtitle {
            color: #94a3b8;
            font-size: 14px;
          }
          .badge-count {
            background-color: rgba(139, 92, 246, 0.15);
            border: 1px solid rgba(139, 92, 246, 0.3);
            color: #c4b5fd;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
          }
          .intro {
            background-color: #1e293b;
            border-left: 4px solid #8b5cf6;
            padding: 14px 18px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 14px;
            color: #cbd5e1;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th {
            text-align: left;
            padding: 12px 14px;
            background-color: #1e293b;
            color: #94a3b8;
            font-weight: 600;
            border-bottom: 2px solid #334155;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.05em;
          }
          td {
            padding: 12px 14px;
            border-bottom: 1px solid #1e293b;
          }
          tr:hover td {
            background-color: rgba(255, 255, 255, 0.03);
          }
          a {
            color: #a78bfa;
            text-decoration: none;
            word-break: break-all;
            transition: color 0.2s;
          }
          a:hover {
            color: #c4b5fd;
            text-decoration: underline;
          }
          .priority {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            background-color: #334155;
            color: #f1f5f9;
          }
          .priority.high {
            background-color: rgba(245, 158, 11, 0.2);
            color: #fbbf24;
            border: 1px solid rgba(245, 158, 11, 0.3);
          }
          .date {
            color: #64748b;
            font-family: monospace;
          }
          footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #1e293b;
            text-align: center;
            font-size: 12px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="brand">
              <div class="icon">🎵</div>
              <div>
                <h1>MyMusicMoment24 XML-Sitemap</h1>
                <p class="subtitle">Offizieller Index für Suchmaschinen &amp; Google SEO</p>
              </div>
            </div>
            <div>
              <span class="badge-count">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs indexiert
              </span>
            </div>
          </header>

          <div class="intro">
            Diese XML-Sitemap wird von Google, Bing und KI-Crawlern gelesen, um alle Seiten von <strong>MyMusicMoment24</strong> zuverlässig zu indexieren. Alle bestehenden Rankings und Permalinks werden gepflegt und auf dem neuesten Stand gehalten.
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 55%;">URL / Permalink</th>
                <th style="width: 15%;">Priorität</th>
                <th style="width: 30%;">Zuletzt aktualisiert</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <xsl:variable name="itemURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <a href="{$itemURL}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:priority = '1.0'">
                        <span class="priority high">1.0 (Hauptseite)</span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="priority"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td class="date">
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <footer>
            &copy; 2026 MyMusicMoment24 – Dirk Schmetzer. Alle Rechte vorbehalten. | <a href="/llms.txt">llms.txt</a>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>