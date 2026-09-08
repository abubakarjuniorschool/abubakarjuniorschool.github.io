/* =====================================================
   ABUBAKAR JUNIOR SCHOOL — LIVE CONTENT FROM SUPABASE
   Runs after the page loads and fills in whatever the
   editor has saved in the dashboard. If a table has no
   data yet, the original static text in the HTML stays
   as a safe fallback.
   ===================================================== */

const SUPABASE_URL = "https://ggthkvlynzgslzdqnymo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_G_h5jXptFUfDRwAf2XIA8w_Vf97C82l";
const sbLive = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", loadLiveContent);

async function loadLiveContent() {

    try {

        const [
            homepageRes,
            aboutRes,
            academicsRes,
            classesRes,
            announcementsRes,
            newsRes,
            galleryRes,
            settingsRes
        ] = await Promise.all([
            sbLive.from("homepage").select("*").eq("id", "homepage").maybeSingle(),
            sbLive.from("about_page").select("*").eq("id", "about").maybeSingle(),
            sbLive.from("academics").select("*").eq("id", "academics").maybeSingle(),
            sbLive.from("classes").select("*"),
            sbLive.from("announcements").select("*").eq("is_published", true).order("created_at"),
            sbLive.from("news").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(6),
            sbLive.from("gallery").select("*").is("class_id", null).order("created_at", { ascending: false }).limit(12),
            sbLive.from("site_settings").select("*").eq("id", "settings").maybeSingle()
        ]);

        applyHomepage(homepageRes.data);
        applyAbout(aboutRes.data);
        applyAcademics(academicsRes.data);
        applyClasses(classesRes.data);
        applyAnnouncements(announcementsRes.data);
        applyNews(newsRes.data);
        applyGallery(galleryRes.data);
        applySettings(settingsRes.data);

    } catch (err) {

        console.error("Could not load live content from Supabase:", err);
        // The page keeps whatever static text is already in the HTML.

    }

}


function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}


/* -----------------------------------------------------
   HOMEPAGE
   ----------------------------------------------------- */
function applyHomepage(hp) {

    if (!hp) return;

    const welcomeEl = document.querySelector(".hero-text .welcome");
    if (welcomeEl && hp.welcome_text) {
        welcomeEl.textContent = hp.welcome_text;
    }

    // Note: the original heading has two styled lines (a plain line
    // and a highlighted <span> line). The dashboard only stores one
    // heading field, so this replaces both lines with a single
    // plain-style line.
    const headingEl = document.querySelector(".hero-text h1");
    if (headingEl && hp.hero_title) {
        headingEl.textContent = hp.hero_title;
    }

    const descEl = document.querySelector(".hero-text > p");
    if (descEl && hp.hero_subtitle) {
        descEl.textContent = hp.hero_subtitle;
    }

}


/* -----------------------------------------------------
   ANNOUNCEMENT TICKER
   ----------------------------------------------------- */
function applyAnnouncements(rows) {

    if (!rows || rows.length === 0) return;

    const track = document.querySelector(".ticker-track");
    if (!track) return;

    const items = rows.map(function (r) { return r.title; });
    const doubled = items.concat(items); // duplicate for the seamless scroll loop

    track.innerHTML = doubled
        .map(function (t) { return '<span class="ticker-item">' + escapeHtml(t) + '</span>'; })
        .join("");

}


/* -----------------------------------------------------
   ABOUT
   ----------------------------------------------------- */
function applyAbout(ab) {

    if (!ab) return;

    const heading = document.querySelector("#about h2");
    if (heading && ab.heading) {
        heading.textContent = ab.heading;
    }

    const paragraphs = document.querySelectorAll("#about .about-content p");

    if (paragraphs[0] && ab.content) {
        paragraphs[0].textContent = ab.content;
    }

    if (paragraphs[1] && ab.paragraph2) {
        paragraphs[1].textContent = ab.paragraph2;
    }

}


/* -----------------------------------------------------
   ACADEMICS
   ----------------------------------------------------- */
function applyAcademics(ac) {

    if (!ac) return;

    const heading = document.querySelector("#academics h2");
    if (heading && ac.heading) {
        heading.textContent = ac.heading;
    }

    const desc = document.querySelector("#academics .section-heading p");
    if (desc && ac.description) {
        desc.textContent = ac.description;
    }

}


/* -----------------------------------------------------
   CLASSES (P1-P7 descriptions on the homepage cards)
   ----------------------------------------------------- */
function applyClasses(rows) {

    if (!rows) return;

    rows.forEach(function (row) {

        const link = document.querySelector('.class-card a[href="' + row.id + '.html"]');
        if (!link) return;

        const p = link.querySelector("p");
        if (p && row.description) {
            p.textContent = row.description;
        }

    });

}


/* -----------------------------------------------------
   NEWS
   ----------------------------------------------------- */
function applyNews(rows) {

    if (!rows || rows.length === 0) return;

    const grid = document.querySelector(".news-grid");
    if (!grid) return;

    grid.innerHTML = rows.map(function (r) {
        return (
            '<article class="news-card">' +
                '<div class="news-date">NEWS</div>' +
                '<div class="news-body">' +
                    '<h3>' + escapeHtml(r.title) + '</h3>' +
                    '<p>' + escapeHtml(r.body || "") + '</p>' +
                    '<a href="#contact">Read More →</a>' +
                '</div>' +
            '</article>'
        );
    }).join("");

}


/* -----------------------------------------------------
   GALLERY
   ----------------------------------------------------- */
function applyGallery(rows) {

    if (!rows || rows.length === 0) return;

    const grid = document.querySelector(".gallery-grid");
    if (!grid) return;

    grid.innerHTML = rows.map(function (r) {
        return (
            '<div class="gallery-item" onclick="openLightbox(\'' + r.image_url + '\')">' +
                '<img src="' + r.image_url + '" alt="Abubakar Junior School">' +
            '</div>'
        );
    }).join("");

}


/* -----------------------------------------------------
   SITE SETTINGS: logo, phone, email, address, WhatsApp
   ----------------------------------------------------- */
function applySettings(ss) {

    if (!ss) return;

    if (ss.logo_url) {
        document.querySelectorAll(".school-logo").forEach(function (img) {
            img.src = ss.logo_url;
        });
    }

    if (ss.phone) {

        const topPhone = document.querySelector(".top-content span:nth-child(2)");
        if (topPhone) topPhone.textContent = "📞 " + ss.phone;

        const contactPhone = document.querySelector("#contact .contact-card:nth-child(2) p");
        if (contactPhone) contactPhone.textContent = ss.phone;

        const footerPhone = document.querySelector(".footer-grid div:nth-child(3) p:nth-child(1)");
        if (footerPhone) footerPhone.textContent = "📞 " + ss.phone;

    }

    if (ss.email) {

        const topEmail = document.querySelector(".top-content span:nth-child(3)");
        if (topEmail) topEmail.textContent = "✉️ " + ss.email;

        const contactEmail = document.querySelector("#contact .contact-card:nth-child(3) p");
        if (contactEmail) contactEmail.textContent = ss.email;

    }

    if (ss.address) {

        const contactAddress = document.querySelector("#contact .contact-card:nth-child(1) p");
        if (contactAddress) {
            contactAddress.innerHTML = escapeHtml(ss.address).replace(/\n/g, "<br>");
        }

    }

    if (ss.whatsapp) {

        const waLink = document.querySelector(".whatsapp-float");
        if (waLink) {
            waLink.href = "https://wa.me/" + ss.whatsapp.replace(/[^0-9]/g, "");
        }

    }

}
