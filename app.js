(function () {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const app = document.getElementById("app");
  const notice = document.createElement("div");
  notice.className = "notice";
  notice.id = "sourceNotice";
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");
  notice.hidden = true;
  app.before(notice);

  const state = {
    settings: null,
    pages: [],
    cmsProjects: [],
    githubRepos: null,
    route: "dashboard"
  };
  const fallbackPages = {
    dashboard: {
      title: "Make room for what’s next.",
      intro: "A welcoming space to learn, experiment, and share the things you build along the way."
    },
    about: {
      title: "A little about this space",
      intro: "A place for curiosity, practical learning, and ideas that grow into something real."
    },
    projects: {
      title: "Projects & experiments",
      intro: "A collection of things made while learning, solving problems, and trying something new."
    },
    contact: {
      title: "Let’s make a connection",
      intro: "Have a question, an idea, or a project in mind? I’d love to hear from you."
    }
  };
  const pageLabels = { dashboard: "Dashboard", about: "About", projects: "Projects", contact: "Contact us" };

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function safeUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch (error) {
      return "";
    }
  }

  function currentPage(route) {
    return state.pages.find(function (page) { return page.route === route; }) || {};
  }

  function titleFor(route) {
    return currentPage(route).title || fallbackPages[route].title;
  }

  function introFor(route) {
    return currentPage(route).intro || fallbackPages[route].intro;
  }

  function bodyFor(route) {
    const body = currentPage(route).body;
    if (!body) return "";
    return body.split(/\n{2,}/).map(function (paragraph) {
      return "<p>" + escapeHtml(paragraph).replace(/\n/g, "<br>") + "</p>";
    }).join("");
  }

  function heading(route) {
    return '<div class="eyebrow"><span class="eyebrow-dot"></span>' + escapeHtml(pageLabels[route]) + "</div>" +
      '<h1 class="page-heading">' + escapeHtml(titleFor(route)) + "</h1>" +
      '<p class="page-intro">' + escapeHtml(introFor(route)) + "</p>";
  }

  function projectCard(project, source) {
    const name = project.title || project.name || "Untitled project";
    const description = project.description || "A small experiment in learning and making.";
    const githubUrl = safeUrl(project.githubUrl || project.html_url);
    const demoUrl = safeUrl(project.demoUrl || project.homepage);
    const tags = Array.isArray(project.stack) ? project.stack : [];
    const language = project.language || project.category || "";
    const mark = escapeHtml(name.trim().charAt(0).toUpperCase() || "P");
    const links = [
      githubUrl ? '<a href="' + escapeHtml(githubUrl) + '" target="_blank" rel="noopener noreferrer">Source ↗</a>' : "",
      demoUrl ? '<a href="' + escapeHtml(demoUrl) + '" target="_blank" rel="noopener noreferrer">Live demo ↗</a>' : ""
    ].filter(Boolean).join("");
    return '<article class="project-card" data-search="' + escapeHtml((name + " " + description + " " + tags.join(" ") + " " + language).toLowerCase()) + '">' +
      '<div class="project-card-head"><span class="project-glyph">' + mark + '</span><span class="project-source">' + escapeHtml(project.kind || source) + "</span></div>" +
      "<h2>" + escapeHtml(name) + "</h2><p>" + escapeHtml(description) + "</p>" +
      (tags.length ? '<div class="project-tags">' + tags.slice(0, 4).map(function (tag) {
        return '<span class="project-tag">' + escapeHtml(tag) + "</span>";
      }).join("") + "</div>" : "") +
      '<div class="project-card-foot"><span class="project-lang">' + (language ? '<span class="language-dot"></span>' + escapeHtml(language) : "") +
      "</span><span class=\"project-links\">" + links + "</span></div></article>";
  }

  function projects() {
    const cms = state.cmsProjects.map(function (project) { return projectCard(project, "Featured"); });
    const github = (state.githubRepos || []).map(function (repo) { return projectCard(repo, "GitHub"); });
    return cms.concat(github);
  }

  function projectGrid(items) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Your project shelf is ready.</strong><p>Add a project in Sanity Studio or set your GitHub username in <code>site.config.js</code> or Sanity Site settings to show your repositories here.</p></div>';
    }
    return items.join("");
  }

  function dashboard() {
    const items = projects();
    const customBody = bodyFor("dashboard");
    return '<div class="welcome-row"><div class="welcome-copy">' + heading("dashboard") +
      '</div><span class="date-pill" id="welcomeDate"></span></div>' +
      (customBody ? '<section class="content-panel"><div class="body-copy">' + customBody + "</div></section>" : "") +
      '<section class="hero-panel"><div class="hero-text"><div class="eyebrow"><span class="eyebrow-dot"></span> YOUR NEXT CHAPTER</div>' +
      '<h2>Curiosity is a great place to start.</h2><p>Learn a new skill, explore an idea, and turn what you discover into something you can share.</p>' +
      '<div class="hero-actions"><a class="button button-dark" href="#projects">Explore projects <span class="button-arrow">↗</span></a>' +
      '<a class="button button-light" href="#about">Get to know me</a></div></div>' +
      '<div class="hero-art" aria-hidden="true"><div class="art-orbit"></div><div class="art-sun"></div><div class="art-card"><div class="art-card-lines"><span></span><span></span><span></span></div></div><div class="art-badge">✳</div></div>' +
      '<span class="hero-footer-note">LEARN · BUILD · REPEAT</span></section>' +
      '<div class="section-row"><div><h2 class="section-title">A good place to begin</h2><p class="section-subtitle">A few paths around the workspace</p></div></div>' +
      '<section class="quick-grid" aria-label="Explore the site">' +
      '<a class="quick-card" href="#about"><div class="quick-card-top"><span class="quick-icon">◉</span><span class="quick-arrow">↗</span></div><strong>Get to know me</strong><small>A little background, what I’m learning, and what inspires me.</small></a>' +
      '<a class="quick-card" href="#projects"><div class="quick-card-top"><span class="quick-icon">⌘</span><span class="quick-arrow">↗</span></div><strong>See what I’m making</strong><small>Explore projects and experiments shared from GitHub.</small></a>' +
      '<a class="quick-card" href="#contact"><div class="quick-card-top"><span class="quick-icon">✉</span><span class="quick-arrow">↗</span></div><strong>Say hello</strong><small>Questions and new ideas are always welcome here.</small></a></section>' +
      '<div class="section-row"><div><h2 class="section-title">A growing project shelf</h2><p class="section-subtitle">New ideas, learning, and a little bit of making</p></div><a class="text-link" href="#projects">View all <span>→</span></a></div>' +
      '<section class="project-grid dashboard-projects" aria-label="Recent projects">' + projectGrid(items.slice(0, 3)) + "</section>" +
      '<section class="stats-grid" aria-label="Workspace summary"><div class="stat-card"><span class="stat-icon">⌘</span><span class="stat-copy"><strong>' + items.length + '</strong><small>Projects shared</small></span></div>' +
      '<div class="stat-card"><span class="stat-icon">✳</span><span class="stat-copy"><strong>Always</strong><small>Room to learn</small></span></div>' +
      '<div class="stat-card"><span class="stat-icon">↗</span><span class="stat-copy"><strong>Open</strong><small>To new ideas</small></span></div></section>';
  }

  function about() {
    const body = bodyFor("about") || "<p>This is an independent learning and project space: a place to share what I’m exploring, document the process, and make useful things along the way.</p><p>Use the CMS to add your own story, learning interests, and the details you want visitors to know.</p>";
    return heading("about") + '<div class="about-grid"><section class="about-feature"><span class="quick-icon">✳</span><h2>Learn with intention. Build with curiosity.</h2><p>This space grows with every new skill, side project, and question worth exploring.</p></section>' +
      '<div class="about-list"><div class="about-item"><span class="about-item-icon">◎</span><span><strong>Stay curious</strong><small>Follow questions and explore new ideas.</small></span></div>' +
      '<div class="about-item"><span class="about-item-icon">⌘</span><span><strong>Make it real</strong><small>Turn small experiments into useful projects.</small></span></div>' +
      '<div class="about-item"><span class="about-item-icon">↗</span><span><strong>Share the journey</strong><small>Learn in public and grow together.</small></span></div></div></div>' +
      '<section class="content-panel"><h2>The story behind it</h2><div class="body-copy">' + body + "</div></section>";
  }

  function projectPage() {
    const items = projects();
    const content = items.map(function (item) { return item; });
    const customBody = bodyFor("projects");
    return heading("projects") + (customBody ? '<section class="content-panel"><div class="body-copy">' + customBody + "</div></section>" : "") +
      '<div class="projects-toolbar"><div><h2 class="section-title">The project shelf</h2><p class="section-subtitle">' + items.length + ' ' + (items.length === 1 ? "project" : "projects") + ' to explore</p></div>' +
      '<label class="search-box"><span aria-hidden="true">⌕</span><input id="projectSearch" type="search" placeholder="Find a project…" autocomplete="off" aria-label="Search projects"></label></div>' +
      '<section class="project-grid" id="projectGrid" aria-label="Projects">' + projectGrid(content) + "</section>";
  }

  function contact() {
    const email = state.settings && state.settings.contactEmail ? state.settings.contactEmail : "";
    const body = bodyFor("contact");
    return heading("contact") + (body ? '<section class="content-panel"><div class="body-copy">' + body + "</div></section>" : "") +
      '<div class="contact-grid"><section class="contact-card"><div class="eyebrow"><span class="eyebrow-dot"></span> GET IN TOUCH</div>' +
      '<h2>Good things start with a conversation.</h2><p>Share a question, collaboration idea, or something interesting you’ve been working on.</p>' +
      (email ? '<a class="contact-email" href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + " ↗</a>" : '<span class="contact-email">Add your email in Sanity Studio</span>') + "</section>" +
      '<form class="contact-form" id="contactForm"><div class="form-row"><div class="field"><label for="contactName">Your name</label><input id="contactName" name="name" required autocomplete="name" placeholder="Jane Smith"></div>' +
      '<div class="field"><label for="contactSender">Your email</label><input id="contactSender" name="email" type="email" required autocomplete="email" placeholder="jane@example.com"></div></div>' +
      '<div class="field"><label for="contactMessage">Your message</label><textarea id="contactMessage" name="message" required placeholder="What’s on your mind?"></textarea></div>' +
      '<p class="form-note" id="formNote" aria-live="polite">' + (email ? "This opens a new message in your email app." : "Set a contact email in Sanity Studio to enable the contact form.") + "</p>" +
      '<button class="button button-dark form-submit" type="submit"' + (email ? "" : " disabled") + '>Write a message <span class="button-arrow">↗</span></button></form></div>';
  }

  function setNotice(message, isError) {
    notice.textContent = message;
    notice.hidden = !message;
    notice.style.borderColor = isError ? "#efd8ce" : "";
    notice.style.background = isError ? "#fff6f1" : "";
    notice.style.color = isError ? "#93654e" : "";
  }

  function updateNav(route) {
    document.querySelectorAll(".nav-link").forEach(function (link) {
      const active = link.dataset.route === route;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.getElementById("currentPage").textContent = pageLabels[route];
    document.title = (state.settings && state.settings.brandName ? state.settings.brandName : "My Edu") + " — " + pageLabels[route];
  }

  function render() {
    const route = location.hash.slice(1);
    state.route = Object.prototype.hasOwnProperty.call(pageLabels, route) ? route : "dashboard";
    updateNav(state.route);
    const templates = { dashboard: dashboard, about: about, projects: projectPage, contact: contact };
    app.innerHTML = templates[state.route]();

    const brand = state.settings && state.settings.brandName;
    if (brand) {
      document.getElementById("brandName").innerHTML = escapeHtml(brand) + '<span class="brand-period">.</span>';
    }
    const projectCount = state.cmsProjects.length + (state.githubRepos || []).length;
    const count = document.getElementById("projectCount");
    count.textContent = String(projectCount);
    count.hidden = projectCount === 0;
    const studioUrl = safeUrl(config.sanityStudioUrl);
    const cmsLink = document.getElementById("cmsLink");
    cmsLink.href = studioUrl || "https://www.sanity.io/manage";
    if (state.route === "dashboard") {
      document.getElementById("welcomeDate").textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date());
    }
    const search = document.getElementById("projectSearch");
    if (search) {
      search.addEventListener("input", function () {
        const query = search.value.trim().toLowerCase();
        document.querySelectorAll("#projectGrid .project-card").forEach(function (card) {
          card.hidden = !card.dataset.search.includes(query);
        });
      });
    }
    const form = document.getElementById("contactForm");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const recipient = state.settings && state.settings.contactEmail;
        if (!recipient) return;
        const data = new FormData(form);
        const subject = "Website message from " + data.get("name");
        const message = "From: " + data.get("name") + " (" + data.get("email") + ")\n\n" + data.get("message");
        document.getElementById("formNote").textContent = "Your email app should open with the message ready to send.";
        location.href = "mailto:" + encodeURIComponent(recipient) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(message);
      });
    }
  }

  async function sanityQuery(projectId, dataset, query) {
    const endpoint = "https://" + encodeURIComponent(projectId) + ".api.sanity.io/v2024-01-01/data/query/" +
      encodeURIComponent(dataset) + "?query=" + encodeURIComponent(query);
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Sanity request failed with status " + response.status);
    const payload = await response.json();
    return payload.result;
  }

  async function loadSanity() {
    if (window.location.protocol === "file:") {
      setNotice("You're viewing this site as a file, so the browser blocks Sanity requests. Start the local web server from the project folder with: python -m http.server 8000, then open http://localhost:8000.", true);
      return;
    }
    if (!/^[a-z0-9-]+$/i.test(config.sanityProjectId || "")) {
      setNotice("Connect a Sanity project in site.config.js to manage site pages and project details in your CMS.", false);
      return;
    }
    const dataset = /^[a-z0-9_-]+$/i.test(config.sanityDataset || "") ? config.sanityDataset : "production";
    const queries = [
      sanityQuery(config.sanityProjectId, dataset, '*[_type == "siteSettings"][0]{brandName, contactEmail, githubUsername}'),
      sanityQuery(config.sanityProjectId, dataset, '*[_type == "page"]{route, title, intro, body}'),
      sanityQuery(config.sanityProjectId, dataset, '*[_type == "project"] | order(featured desc, _createdAt desc){title, description, stack, category, kind, githubUrl, demoUrl}')
    ];
    const results = await Promise.allSettled(queries);
    const rejected = results.find(function (result) { return result.status === "rejected"; });
    if (rejected) {
      console.error("Could not load Sanity content:", rejected.reason);
      setNotice("Sanity could not be reached. Add " + window.location.origin + " under API → CORS origins in your Sanity project, and allow public reads for the production dataset.", true);
      return;
    }
    state.settings = results[0].value || null;
    state.pages = results[1].value || [];
    state.cmsProjects = results[2].value || [];
    render();
  }

  async function loadGithub() {
    const username = (state.settings && state.settings.githubUsername) || config.githubUsername;
    if (!username) return;
    try {
      const response = await fetch("https://api.github.com/users/" + encodeURIComponent(username) + "/repos?sort=updated&per_page=30");
      if (!response.ok) throw new Error("GitHub request failed with status " + response.status);
      const repos = await response.json();
      if (!Array.isArray(repos)) throw new Error("GitHub returned an unexpected response");
      state.githubRepos = repos.filter(function (repo) { return !repo.fork && !repo.archived; }).slice(0, 9);
      if (state.route === "dashboard" || state.route === "projects") render();
    } catch (error) {
      console.error("Could not load GitHub projects:", error);
      setNotice("Could not load GitHub projects. Check the username in site.config.js and try again later.", true);
    }
  }

  document.getElementById("todayLabel").textContent = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date());
  window.addEventListener("hashchange", render);
  render();
  loadSanity().then(loadGithub);
})();
