(function () {
  const recipes = window.RECIPES;
  const categories = window.CATEGORIES;
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
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }

  function renderFilters() {
    const el = document.getElementById("filters");
    el.innerHTML = categories
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

  function renderCards() {
    const grid = document.getElementById("card-grid");
    const list = recipes.filter((r) => activeFilter === "all" || r.tags.includes(activeFilter));
    const cards = list.map((r) => {
      const blurb = r.intro ? r.intro.split(/(?<=\.)\s/)[0] : `Serves ${r.serves.toLowerCase()}.`;
      return `<a class="card" href="#${r.slug}" style="--c:${r.colour}">
        <span class="card-photo"><img data-src="${esc(r.image)}" data-label="${esc(r.title)}" data-colour="${r.colour}" alt=""></span>
        <span class="card-body">
          <span class="card-meta">${esc(r.time)} &middot; serves ${esc(r.serves.replace(/ people$/, "").toLowerCase())}</span>
          <span class="card-title">${esc(r.title)}</span>
          <span class="card-blurb">${esc(blurb)}</span>
        </span>
      </a>`;
    });
    cards.push(`<div class="card card-soon" aria-label="More recipes coming">
        <span class="soon-mark" aria-hidden="true">&#10043;</span>
        <span class="card-title">More from the kitchen</span>
        <span class="card-blurb">New recipes are being tested. Check back soon.</span>
      </div>`);
    grid.innerHTML = cards.join("");
    hydrateImages(grid);
  }

  function renderRecipe(r) {
    const idx = recipes.indexOf(r);
    const next = recipes[(idx + 1) % recipes.length];
    view.style.setProperty("--c", r.colour);
    view.innerHTML = `
      <a class="back" href="#recipes">&larr; All recipes</a>
      <div class="spread">
        <div class="page page-left">
          <h1 class="recipe-title">${esc(r.title)}</h1>
          ${r.intro ? `<p class="recipe-intro">${esc(r.intro)}</p>` : ""}
          <dl class="facts">
            <div><dt>Serves</dt><dd>${esc(r.serves)}</dd></div>
            <div><dt>${r.oven === "Microwave" ? "Cook in" : "Oven"}</dt><dd>${esc(r.oven)}</dd></div>
            <div><dt>Time</dt><dd>${esc(r.time)}</dd></div>
          </dl>
          <h2 class="sub">Ingredients</h2>
          <p class="hint">Tick things off as you gather them.</p>
          <ul class="ingredients">
            ${r.ingredients
              .map((ing, i) => `<li><input type="checkbox" id="ing-${r.slug}-${i}"><label for="ing-${r.slug}-${i}">${esc(ing)}</label></li>`)
              .join("")}
          </ul>
        </div>
        <div class="page page-right">
          <figure class="recipe-photo taped"><img data-src="${esc(r.image)}" data-label="${esc(r.title)}" data-colour="${r.colour}" alt="${esc(r.title)}"></figure>
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
    const r = recipes.find((x) => x.slug === slug);
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

  renderFilters();
  renderCards();
  hydrateImages(document);
  window.addEventListener("hashchange", route);
  route();
})();
