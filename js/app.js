(function () {
  const recipes = window.RECIPES;
  const sections = window.SECTIONS;
  const home = document.getElementById("home");
  const view = document.getElementById("recipe-view");
  let activeFilter = "all";

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Illustrated stand-in used until a real photo exists at the image path.
  function placeholder(label, colour) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <defs><pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="24" height="24" fill="#FBF3EA"/>
        <rect width="12" height="24" fill="${colour}" opacity=".12"/>
        <rect width="24" height="12" fill="${colour}" opacity=".12"/></pattern></defs>
      <rect width="400" height="300" fill="url(#g)"/>
      <ellipse cx="200" cy="150" rx="118" ry="104" fill="#fff" stroke="${colour}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>
      <circle cx="200" cy="150" r="78" fill="${colour}" opacity=".16"/>
      <path d="M150 126c18-20 82-20 100 0" fill="none" stroke="${colour}" stroke-width="3" stroke-linecap="round"/>
      <text x="200" y="158" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="19" fill="#3E2A28">${esc(label)}</text>
      <text x="200" y="184" text-anchor="middle" font-family="Georgia, serif" font-size="12" letter-spacing="2" fill="${colour}">PHOTO COMING SOON</text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function hydrateImages(root) {
    root.querySelectorAll("img[data-src]").forEach((img) => {
      const fallback = placeholder(img.dataset.label || "", img.dataset.colour || "#C8677A");
      img.onerror = () => { img.onerror = null; img.src = fallback; };
      img.src = img.dataset.src || fallback;
      img.removeAttribute("data-src");
    });
  }

  const isReady = (r) => Array.isArray(r.method) && r.method.length > 0;
  const readyRecipes = recipes.filter(isReady);
  const filters = [{ id: "all", label: "Everything" }].concat(sections);

  function renderFilters() {
    const el = document.getElementById("filters");
    el.innerHTML = filters
      .map((c) => `<button type="button" class="chip" data-filter="${c.id}" aria-pressed="${c.id === activeFilter}">${esc(c.label)}</button>`)
      .join("");
    el.onclick = (e) => {
      const b = e.target.closest("[data-filter]");
      if (!b) return;
      activeFilter = b.dataset.filter;
      renderFilters();
      renderCards();
    };
  }

  const hasPhoto = (r) => Boolean(r.image);
  const blurbOf = (r) => (r.intro ? r.intro.split(/(?<=[.?!])\s/)[0] : `Serves ${r.serves.toLowerCase()}.`);
  const metaOf = (r) =>
    [r.time, "serves " + r.serves.replace(/ people/, "").toLowerCase()].filter(Boolean).map(esc).join(" &middot; ");
  const bookNo = (r) => String(recipes.indexOf(r) + 1).padStart(2, "0");
  const photo = (r, cls = "card-photo") =>
    `<span class="${cls}"><img data-src="${esc(r.image)}" data-label="${esc(r.title)}" data-colour="${r.colour}" alt=""></span>`;

  // ----- Layout previews (demo only: pick one, then the others can be deleted) -----
  const LAYOUTS = [
    { id: "menu", label: "Featured + menu" },
    { id: "contents", label: "Contents page" },
    { id: "mixed", label: "Mixed cards" },
  ];
  let layout = "menu";
  try { layout = localStorage.getItem("nej-layout") || layout; } catch (e) {}
  if (!LAYOUTS.some((l) => l.id === layout)) layout = "menu";

  function renderLayoutSwitch() {
    const el = document.getElementById("layout-switch");
    el.innerHTML =
      `<span class="ls-label">Layout preview</span>` +
      LAYOUTS.map((l) => `<button type="button" data-layout="${l.id}" aria-pressed="${l.id === layout}">${esc(l.label)}</button>`).join("");
    el.onclick = (e) => {
      const b = e.target.closest("[data-layout]");
      if (!b) return;
      layout = b.dataset.layout;
      try { localStorage.setItem("nej-layout", layout); } catch (err) {}
      renderLayoutSwitch();
      renderCards();
    };
  }

  const inFilter = (r) => activeFilter === "all" || r.section === activeFilter;
  const shownSections = () => sections.filter((sec) => activeFilter === "all" || sec.id === activeFilter);

  // A: big photo cards for the pictured recipes, then a menu-style list of the rest.
  function layoutMenu() {
    const featured = recipes.filter((r) => inFilter(r) && hasPhoto(r));
    const feat = featured.length
      ? `<div class="featured count-${Math.min(featured.length, 4)}">${featured
          .map(
            (r, i) => `<a class="feature ${i === 0 ? "feature-lead" : ""}" href="#${r.slug}" style="--c:${r.colour}">
              ${photo(r, "feature-photo")}
              <span class="feature-body">
                <span class="card-meta">${metaOf(r)}</span>
                <span class="feature-title">${esc(r.title)}</span>
                <span class="card-blurb">${esc(blurbOf(r))}</span>
              </span>
            </a>`
          )
          .join("")}</div>`
      : "";
    const menu = shownSections()
      .map((sec) => {
        const list = recipes.filter((r) => r.section === sec.id && !hasPhoto(r));
        if (!list.length) return "";
        return `<div class="menu-course">
          <h3 class="menu-heading">${esc(sec.title)}</h3>
          <ul class="menu-list">${list
            .map(
              (r) => `<li><a href="#${r.slug}" style="--c:${r.colour}">
                <span class="menu-line"><span class="menu-title">${esc(r.title)}</span><span class="menu-dots" aria-hidden="true"></span><span class="menu-time">${esc(r.time || r.oven || "")}</span></span>
                <span class="menu-blurb">${esc(blurbOf(r))}</span>
              </a></li>`
            )
            .join("")}</ul>
        </div>`;
      })
      .join("");
    return feat + (menu ? `<div class="menu"><p class="menu-kicker">Also in the book</p>${menu}</div>` : "");
  }

  // B: one lead recipe as a banner, then the whole book as a contents page.
  function layoutContents() {
    const lead = recipes.find((r) => inFilter(r) && hasPhoto(r));
    const banner = lead
      ? `<a class="banner" href="#${lead.slug}" style="--c:${lead.colour}">
          ${photo(lead, "banner-photo")}
          <span class="banner-body">
            <span class="banner-kicker">Start here</span>
            <span class="banner-title">${esc(lead.title)}</span>
            <span class="banner-blurb">${esc(blurbOf(lead))}</span>
            <span class="banner-cta">Read the recipe &rarr;</span>
          </span>
        </a>`
      : "";
    const toc = shownSections()
      .map((sec) => {
        const list = recipes.filter((r) => r.section === sec.id);
        return `<div class="toc-course">
          <h3 class="toc-heading">${esc(sec.title)}</h3>
          <ol class="toc-list">${list
            .map(
              (r) => `<li><a href="#${r.slug}" style="--c:${r.colour}">
                <span class="toc-no">${bookNo(r)}</span>
                ${hasPhoto(r) ? photo(r, "toc-thumb") : `<span class="toc-thumb toc-dot" aria-hidden="true">${esc(r.title[0])}</span>`}
                <span class="toc-text"><span class="toc-title">${esc(r.title)}</span><span class="toc-meta">${metaOf(r)}</span></span>
              </a></li>`
            )
            .join("")}</ol>
        </div>`;
      })
      .join("");
    return banner + `<div class="toc">${toc}</div>`;
  }

  // C: one grid per section; pictured recipes take double-width cards, the rest are typographic cards.
  function layoutMixed() {
    return shownSections()
      .map((sec) => {
        const list = recipes.filter((r) => r.section === sec.id);
        return `<div class="course">
          <h3 class="course-title">${esc(sec.title)}</h3>
          <div class="mixed-grid">${list
            .map((r) =>
              hasPhoto(r)
                ? `<a class="card card-wide" href="#${r.slug}" style="--c:${r.colour}">
                    ${photo(r)}
                    <span class="card-body">
                      <span class="card-meta">${metaOf(r)}</span>
                      <span class="card-title">${esc(r.title)}</span>
                      <span class="card-blurb">${esc(blurbOf(r))}</span>
                    </span>
                  </a>`
                : `<a class="card card-type" href="#${r.slug}" style="--c:${r.colour}">
                    <span class="type-initial" aria-hidden="true">${esc(r.title[0])}</span>
                    <span class="card-title">${esc(r.title)}</span>
                    <span class="card-blurb">${esc(blurbOf(r))}</span>
                    <span class="card-meta">${metaOf(r)}</span>
                  </a>`
            )
            .join("")}</div>
        </div>`;
      })
      .join("");
  }

  function renderCards() {
    const root = document.getElementById("card-grid");
    root.dataset.layout = layout;
    root.innerHTML = { menu: layoutMenu, contents: layoutContents, mixed: layoutMixed }[layout]();
    hydrateImages(root);
  }

  function renderRecipe(r) {
    const idx = readyRecipes.indexOf(r);
    const next = readyRecipes[(idx + 1) % readyRecipes.length];
    view.style.setProperty("--c", r.colour);
    view.innerHTML = `
      <a class="back" href="#recipes">&larr; All recipes</a>
      <div class="spread">
        <div class="page page-left">
          <h1 class="recipe-title">${esc(r.title)}</h1>
          ${r.intro ? `<p class="recipe-intro">${esc(r.intro)}</p>` : ""}
          <dl class="facts">
            ${[
              ["Serves", r.serves],
              [/^\d/.test(r.oven || "") ? "Oven" : "Cooking", r.oven],
              ["Time", r.time],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`)
              .join("")}
          </dl>
          <h2 class="sub">Ingredients</h2>
          <p class="hint">Tick things off as you gather them.</p>
          <ul class="ingredients">
            ${r.ingredients
              .map((ing, i) => `<li><input type="checkbox" id="ing-${r.slug}-${i}"><label for="ing-${r.slug}-${i}">${esc(ing)}</label></li>`)
              .join("")}
          </ul>
          ${(r.notes || [])
            .map((n) => `<aside class="note"><h3>${esc(n.title)}</h3><ul>${n.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></aside>`)
            .join("")}
        </div>
        <div class="page page-right">
          ${hasPhoto(r) ? `<figure class="recipe-photo taped"><img data-src="${esc(r.image)}" data-label="${esc(r.title)}" data-colour="${r.colour}" alt="${esc(r.title)}"></figure>` : ""}
          <h2 class="sub">Method</h2>
          <ol class="method">${r.method.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
          <p class="sign-off">Noosh e jan!</p>
        </div>
      </div>
      <a class="next" href="#${next.slug}">Next recipe <span>${esc(next.title)}</span> &rarr;</a>`;
    hydrateImages(view);
  }

  function route() {
    const slug = location.hash.slice(1);
    const r = readyRecipes.find((x) => x.slug === slug);
    if (r) {
      renderRecipe(r);
      home.hidden = true;
      view.hidden = false;
      document.title = `${r.title} · Noosh e jan`;
      window.scrollTo(0, 0);
    } else {
      const wasRecipe = !view.hidden;
      view.hidden = true;
      home.hidden = false;
      document.title = "Noosh e jan";
      if (wasRecipe && slug) {
        const target = document.getElementById(slug);
        if (target) target.scrollIntoView();
      }
    }
  }

  document.getElementById("notify-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("notify-email");
    const msg = document.getElementById("notify-msg");
    if (!input.checkValidity() || !input.value) {
      msg.textContent = "Please enter an email address like name@example.com.";
      return;
    }
    msg.textContent = "Lovely! This is a demo, so nothing was sent yet, but this is where sign-ups will go.";
    input.value = "";
  });

  function renderTips() {
    const t = window.TIPS;
    if (!t) return;
    document.getElementById("tips-intro").textContent = t.intro;
    document.getElementById("tips-list").innerHTML = t.items.map((i) => `<li>${esc(i)}</li>`).join("");
  }

  renderFilters();
  renderLayoutSwitch();
  renderCards();
  renderTips();
  hydrateImages(document);
  window.addEventListener("hashchange", route);
  route();
})();
