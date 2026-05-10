(function () {
  const STORAGE_KEYS = {
    theme: "stageconnect-theme",
    favorites: "stageconnect-favorites",
    notifications: "stageconnect-notifications",
    profile: "stageconnect-profile",
    reviews: "stageconnect-reviews",
    internships: "stageconnect-custom-internships",
    applications: "stageconnect-applications",
    selectedChat: "stageconnect-selected-chat",
    messages: "stageconnect-messages",
    cvName: "stageconnect-cv-name"
  };

  const root = document.documentElement;
  const body = document.body;
  const base = body.dataset.base || "";

  // CHANGE DEPARTMENTS HERE
  const departmentConfig = {
    IT: { icon: "fa-solid fa-code", className: "dept-it", color: "#46c2ff" },
    Mechanical: { icon: "fa-solid fa-gears", className: "dept-mechanical", color: "#f7a649" },
    Electrical: { icon: "fa-solid fa-bolt", className: "dept-electrical", color: "#f1d14f" },
    Management: { icon: "fa-solid fa-briefcase", className: "dept-management", color: "#c678ff" }
  };

  // CHANGE LEVELS HERE
  const levelConfig = {
    "1st year": { className: "level-1", short: "1st", color: "#4f8cff" },
    "2nd year": { className: "level-2", short: "2nd", color: "#ff9b5f" },
    "3rd year": { className: "level-3", short: "3rd", color: "#3dd598" }
  };

  // CHANGE INTERNSHIPS HERE
  // CHANGE COMPANIES HERE
  const initialInternships = [
    {
      id: "ai-product-analyst",
      title: "AI Product Analyst Intern",
      company: "Nexora Labs",
      initials: "NL",
      department: "IT",
      level: "3rd year",
      duration: 6,
      location: "Tunis / Hybrid",
      salary: "Paid",
      featured: true,
      banner: "Operational AI squads, weekly product demos, and live experimentation pipelines.",
      skills: ["Prompt Design", "SQL", "Python Basics", "Product Thinking"],
      summary: "Join the product intelligence team to track model quality, define feature experiments, and support enterprise releases.",
      responsibilities: [
        "Map user journeys across the internship portal and identify automation opportunities.",
        "Build weekly KPI snapshots with business and adoption metrics.",
        "Document prompt patterns and escalation flows for student support."
      ]
    },
    {
      id: "cloud-support",
      title: "Cloud Support Intern",
      company: "BlueForge Systems",
      initials: "BF",
      department: "IT",
      level: "2nd year",
      duration: 2,
      location: "Sousse / On-site",
      salary: "Stipend",
      featured: true,
      banner: "Support tickets, observability tooling, and polished customer handoff rituals.",
      skills: ["Linux", "Networking", "Customer Support", "Documentation"],
      summary: "Work with the cloud operations team to triage incidents, improve support runbooks, and refine ticket workflows.",
      responsibilities: [
        "Triage first-line incidents and route them using severity guidelines.",
        "Update knowledge-base entries for common cloud issues.",
        "Assist with dashboard checks and routine system audits."
      ]
    },
    {
      id: "mechanical-design",
      title: "Mechanical Design Intern",
      company: "Atlas Motion",
      initials: "AM",
      department: "Mechanical",
      level: "2nd year",
      duration: 4,
      location: "Sfax / On-site",
      salary: "Paid",
      featured: true,
      banner: "Rapid prototyping lab, CAD iterations, and close mentoring with senior engineers.",
      skills: ["SolidWorks", "Tolerance Analysis", "Workshop Safety", "Technical Drawing"],
      summary: "Contribute to fixture design, CAD revisions, and production documentation for industrial automation projects.",
      responsibilities: [
        "Prepare 3D models and drawing packs for review.",
        "Participate in test fitting sessions and capture improvement points.",
        "Maintain part libraries and revision notes."
      ]
    },
    {
      id: "power-systems",
      title: "Embedded Power Systems Intern",
      company: "VoltEdge",
      initials: "VE",
      department: "Electrical",
      level: "3rd year",
      duration: 5,
      location: "Gabes / Hybrid",
      salary: "Paid",
      featured: true,
      banner: "Lab validation benches, embedded diagnostics, and hardware-software integration.",
      skills: ["Circuit Analysis", "Embedded C", "Testing", "PCB Basics"],
      summary: "Help validate converter boards, log bench results, and support firmware-hardware integration reviews.",
      responsibilities: [
        "Run test scripts on power modules and record anomalies.",
        "Support schematic review notes and BOM updates.",
        "Assist with failure analysis summaries."
      ]
    },
    {
      id: "operations-finance",
      title: "Operations & Finance Intern",
      company: "NorthStar Advisory",
      initials: "NS",
      department: "Management",
      level: "1st year",
      duration: 1,
      location: "Remote",
      salary: "Unpaid",
      featured: false,
      banner: "Tight operational cadence, finance dashboards, and client-facing reporting packs.",
      skills: ["Excel", "Business Writing", "Time Management", "Research"],
      summary: "Support the operations office with finance follow-ups, status tracking, and weekly presentation preparation.",
      responsibilities: [
        "Clean operational trackers and verify follow-up status.",
        "Build meeting summaries for project coordinators.",
        "Support invoice and attendance recap preparation."
      ]
    },
    {
      id: "ux-pmo",
      title: "UX Research & PMO Intern",
      company: "StageConnect Studio",
      initials: "SC",
      department: "Management",
      level: "3rd year",
      duration: 3,
      location: "Tunis / Hybrid",
      salary: "Paid",
      featured: false,
      banner: "Cross-functional planning, user interviews, and release readiness reviews.",
      skills: ["User Research", "Notion", "Presentation Design", "Planning"],
      summary: "Run student interviews, synthesize patterns, and support the PMO team with launch preparation.",
      responsibilities: [
        "Facilitate weekly feedback collection from student ambassadors.",
        "Maintain release checklists and roadmap snapshots.",
        "Translate findings into action-focused product notes."
      ]
    }
  ];

  // CHANGE STUDENTS HERE
  const initialStudents = [
    { name: "Meriem Saidi", department: "IT", level: "3rd year", completion: 92, status: "Interviewing" },
    { name: "Nour Ben Salem", department: "Mechanical", level: "2nd year", completion: 77, status: "Applied" },
    { name: "Youssef Trabelsi", department: "Electrical", level: "3rd year", completion: 86, status: "Shortlisted" },
    { name: "Rahma Karray", department: "Management", level: "1st year", completion: 69, status: "Exploring" },
    { name: "Ahmed Charfi", department: "IT", level: "2nd year", completion: 81, status: "Favorited" }
  ];

  // CHANGE REPORTS HERE
  const initialReports = [
    { title: "IT Internship Report", department: "IT", student: "Meriem Saidi", company: "Nexora Labs", status: "Approved" },
    { title: "Mechanical Maintenance Report", department: "Mechanical", student: "Nour Ben Salem", company: "Atlas Motion", status: "Pending" },
    { title: "Electrical Validation Report", department: "Electrical", student: "Youssef Trabelsi", company: "VoltEdge", status: "Approved" },
    { title: "Management Process Report", department: "Management", student: "Rahma Karray", company: "NorthStar Advisory", status: "Review" }
  ];

  const initialReviews = [
    {
      id: "review-1",
      name: "Ines Fakhfakh",
      role: "3rd year IT student",
      rating: 5,
      company: "Nexora Labs",
      content: "The mentors treated the internship like a real product squad. Feedback was fast, specific, and useful every week."
    },
    {
      id: "review-2",
      name: "Walid Gharbi",
      role: "2nd year Mechanical student",
      rating: 4,
      company: "Atlas Motion",
      content: "The team gave me real CAD revisions and test-floor exposure, not observation-only tasks."
    },
    {
      id: "review-3",
      name: "Sarra Mzoughi",
      role: "1st year Management student",
      rating: 5,
      company: "NorthStar Advisory",
      content: "I learned how to structure reports and communicate progress clearly to supervisors."
    }
  ];

  const initialNotifications = [
    { id: "n1", title: "Application update", message: "Nexora Labs moved your profile to interview stage.", category: "Application", read: false, timestamp: "2026-05-06 10:45" },
    { id: "n2", title: "New internship", message: "A new Electrical internship was added by VoltEdge.", category: "Stages", read: false, timestamp: "2026-05-05 16:10" },
    { id: "n3", title: "Profile reminder", message: "Your profile is 82% complete. Add a project summary to improve matching.", category: "Profile", read: true, timestamp: "2026-05-04 09:10" },
    { id: "n4", title: "Review received", message: "A supervisor left feedback on your latest report draft.", category: "Reports", read: true, timestamp: "2026-05-03 14:25" }
  ];

  const initialApplications = [
    { student: "Meriem Saidi", role: "AI Product Analyst Intern", department: "IT", status: "Interview", date: "2026-05-05" },
    { student: "Nour Ben Salem", role: "Mechanical Design Intern", department: "Mechanical", status: "Applied", date: "2026-05-04" },
    { student: "Youssef Trabelsi", role: "Embedded Power Systems Intern", department: "Electrical", status: "Shortlisted", date: "2026-05-03" },
    { student: "Rahma Karray", role: "Operations & Finance Intern", department: "Management", status: "Applied", date: "2026-05-02" }
  ];

  const initialContacts = [
    {
      id: "contact-1",
      name: "Maha Ben Ali",
      role: "Internship Coordinator",
      initials: "MB",
      status: "online",
      snippet: "Send me the updated CV and I will attach it.",
      messages: [
        { from: "them", text: "Hi, I reviewed your internship shortlist. Do you want help choosing?", time: "09:18" },
        { from: "me", text: "Yes, especially the IT roles with product exposure.", time: "09:20" },
        { from: "them", text: "Good call. Nexora Labs and StageConnect Studio match your profile best.", time: "09:21" }
      ]
    },
    {
      id: "contact-2",
      name: "BlueForge HR",
      role: "Recruiter",
      initials: "BH",
      status: "away",
      snippet: "We can confirm the interview slot at 11:00.",
      messages: [
        { from: "them", text: "Your technical support internship application is complete.", time: "Yesterday" },
        { from: "me", text: "Great, thank you. Is the interview still on Thursday?", time: "Yesterday" }
      ]
    },
    {
      id: "contact-3",
      name: "Atlas Motion",
      role: "Mentor",
      initials: "AM",
      status: "online",
      snippet: "The CAD task will be shared before the interview.",
      messages: [
        { from: "them", text: "Please review the attached fixture plan before our call.", time: "Monday" }
      ]
    }
  ];

  const testimonials = [
    {
      name: "Internship Office",
      role: "ISET Coordination Team",
      quote: "StageConnect centralizes the internship workflow into one interface. Search, communication, reviews, and reporting finally live in the same place."
    },
    {
      name: "Nexora Labs",
      role: "Partner Company",
      quote: "The company dashboard is direct and practical. We can publish roles, review applicants, and track pipeline quality without spreadsheet drift."
    },
    {
      name: "Students Community",
      role: "3rd Year Representatives",
      quote: "The favorite system, profile progress, and notifications make internship hunting feel organized instead of chaotic."
    }
  ];

  const faqs = [
    {
      question: "How does StageConnect match students to internships?",
      answer: "Matching is simulated using department, level, profile completion, and saved preferences stored locally in the browser."
    },
    {
      question: "Can companies publish new internships without a backend?",
      answer: "Yes. This demo stores company-created internships in localStorage so the add stage form immediately updates the search and dashboard views."
    },
    {
      question: "How are notifications and favorites handled?",
      answer: "Favorites, read state, profile details, review submissions, and CV metadata are all persisted in localStorage for a realistic front-end prototype."
    }
  ];

  function qs(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function qsa(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function ensureState() {
    if (!localStorage.getItem(STORAGE_KEYS.favorites)) {
      writeStorage(STORAGE_KEYS.favorites, ["ai-product-analyst", "mechanical-design"]);
    }

    if (!localStorage.getItem(STORAGE_KEYS.notifications)) {
      writeStorage(STORAGE_KEYS.notifications, initialNotifications);
    }

    if (!localStorage.getItem(STORAGE_KEYS.reviews)) {
      writeStorage(STORAGE_KEYS.reviews, initialReviews);
    }

    if (!localStorage.getItem(STORAGE_KEYS.internships)) {
      writeStorage(STORAGE_KEYS.internships, []);
    }

    if (!localStorage.getItem(STORAGE_KEYS.applications)) {
      writeStorage(STORAGE_KEYS.applications, initialApplications);
    }

    if (!localStorage.getItem(STORAGE_KEYS.profile)) {
      writeStorage(STORAGE_KEYS.profile, {
        name: "Meriem Saidi",
        email: "meriem.saidi@iset.tn",
        department: "IT",
        level: "3rd year",
        headline: "Frontend-oriented IT student focused on internship-ready delivery.",
        location: "Tunis",
        bio: "I build polished user interfaces, document my work clearly, and enjoy working across design and product requirements.",
        skills: "HTML, CSS, JavaScript, UI Design, SQL",
        linkedIn: "linkedin.com/in/meriem-saidi"
      });
    }

    if (!localStorage.getItem(STORAGE_KEYS.messages)) {
      writeStorage(STORAGE_KEYS.messages, initialContacts);
    }

    if (!localStorage.getItem(STORAGE_KEYS.selectedChat)) {
      localStorage.setItem(STORAGE_KEYS.selectedChat, "contact-1");
    }
  }

  function getFavorites() {
    return readStorage(STORAGE_KEYS.favorites, []);
  }

  function getNotifications() {
    return readStorage(STORAGE_KEYS.notifications, []);
  }

  function getReviews() {
    return readStorage(STORAGE_KEYS.reviews, []);
  }

  function getCustomInternships() {
    return readStorage(STORAGE_KEYS.internships, []);
  }

  function getAllInternships() {
    return [...initialInternships, ...getCustomInternships()];
  }

  function getApplications() {
    return readStorage(STORAGE_KEYS.applications, []);
  }

  function getMessages() {
    return readStorage(STORAGE_KEYS.messages, initialContacts);
  }

  function getProfile() {
    return readStorage(STORAGE_KEYS.profile, {});
  }

  function getUnreadCount() {
    return getNotifications().filter((item) => !item.read).length;
  }

  function getProfileCompletion(profile) {
    const fields = ["name", "email", "department", "level", "headline", "location", "bio", "skills", "linkedIn"];
    const filled = fields.filter((field) => profile[field] && String(profile[field]).trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }

  function durationLabel(months) {
    if (months <= 2) return "Short";
    if (months <= 5) return "Medium";
    return "Long";
  }

  function iconForDepartment(department) {
    return departmentConfig[department] || departmentConfig.IT;
  }

  function levelClass(level) {
    return levelConfig[level] ? levelConfig[level].className : "level-1";
  }

  function detailUrl(internshipId) {
    return `${base}stages/details.html?id=${encodeURIComponent(internshipId)}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function createLoader() {
    if (qs(".page-loader")) return;
    const loader = document.createElement("div");
    loader.className = "page-loader";
    loader.innerHTML = '<div class="loader-ring" aria-label="Loading"></div>';
    document.body.appendChild(loader);
  }

  function hideLoader() {
    const loader = qs(".page-loader");
    if (!loader) return;
    loader.classList.add("is-hidden");
    setTimeout(() => loader.remove(), 350);
  }

  function showToast(title, message) {
    let container = qs(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(12px)";
      setTimeout(() => toast.remove(), 280);
    }, 3200);
  }

  function syncUnreadBadges() {
    qsa("[data-unread-count]").forEach((node) => {
      const unread = getUnreadCount();
      node.textContent = unread;
      node.classList.toggle("hidden", unread === 0);
    });
  }

  function syncFavoriteButtons() {
    const favorites = new Set(getFavorites());
    qsa("[data-favorite-id]").forEach((button) => {
      const isSaved = favorites.has(button.dataset.favoriteId);
      button.classList.toggle("is-saved", isSaved);
      button.innerHTML = isSaved
        ? '<i class="fa-solid fa-heart"></i><span>Saved</span>'
        : '<i class="fa-regular fa-heart"></i><span>Favorite</span>';
    });
  }

  function toggleFavorite(id) {
    const favorites = new Set(getFavorites());
    if (favorites.has(id)) {
      favorites.delete(id);
      showToast("Favorite removed", "The internship has been removed from your saved list.");
    } else {
      favorites.add(id);
      showToast("Favorite saved", "The internship is now available in your favorites page.");
    }
    writeStorage(STORAGE_KEYS.favorites, Array.from(favorites));
    syncFavoriteButtons();
    renderFavoritesPage();
    renderStudentSidebar();
  }

  function addNotification(title, message, category) {
    const notifications = getNotifications();
    notifications.unshift({
      id: `n-${Date.now()}`,
      title,
      message,
      category,
      read: false,
      timestamp: new Date().toLocaleString()
    });
    writeStorage(STORAGE_KEYS.notifications, notifications);
    syncUnreadBadges();
    renderNotificationsPreview();
    renderNotificationsPage();
  }

  function renderStars(rating) {
    return new Array(5)
      .fill(0)
      .map((_, index) => `<i class="${index < rating ? "fa-solid" : "fa-regular"} fa-star"></i>`)
      .join("");
  }

  function renderInternshipCard(internship) {
    const dept = iconForDepartment(internship.department);
    return `
      <article class="internship-card reveal">
        <div class="company-row">
          <div class="company-logo">${escapeHtml(internship.initials || internship.company.slice(0, 2).toUpperCase())}</div>
          <div>
            <p class="card-title">${escapeHtml(internship.title)}</p>
            <div class="meta-row">
              <span class="subtle">${escapeHtml(internship.company)}</span>
              <span class="subtle"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(internship.location)}</span>
            </div>
          </div>
        </div>
        <p class="section-copy">${escapeHtml(internship.summary)}</p>
        <div class="card-meta">
          <span class="dept-badge ${dept.className}"><i class="${dept.icon}"></i>${escapeHtml(internship.department)}</span>
          <span class="level-badge ${levelClass(internship.level)}">${escapeHtml(internship.level)}</span>
          <span class="pill">${escapeHtml(durationLabel(internship.duration))} • ${internship.duration} months</span>
          <span class="pill">${escapeHtml(internship.salary)}</span>
        </div>
        <div class="card-actions">
          <a class="button" href="${detailUrl(internship.id)}"><i class="fa-solid fa-arrow-right"></i>Details</a>
          <button class="button-ghost" type="button" data-favorite-id="${escapeHtml(internship.id)}">
            <i class="fa-regular fa-heart"></i><span>Favorite</span>
          </button>
        </div>
      </article>
    `;
  }

  function renderFeaturedInternships() {
    const container = qs("#featured-internships");
    if (!container) return;
    const featured = getAllInternships().filter((item) => item.featured).slice(0, 4);
    container.innerHTML = featured.map(renderInternshipCard).join("");
    syncFavoriteButtons();
    initReveal();
  }

  function renderTestimonials() {
    const stage = qs("#testimonial-stage");
    const nav = qs("#testimonial-nav");
    if (!stage || !nav) return;

    stage.innerHTML = testimonials
      .map(
        (item, index) => `
          <article class="testimonial-card ${index === 0 ? "is-active" : ""}">
            <p class="eyebrow"><i class="fa-solid fa-quote-left"></i>Trusted feedback</p>
            <h3>${escapeHtml(item.name)}</h3>
            <p class="subtle">${escapeHtml(item.role)}</p>
            <p>"${escapeHtml(item.quote)}"</p>
          </article>
        `
      )
      .join("");

    nav.innerHTML = testimonials
      .map((_, index) => `<button class="dot ${index === 0 ? "is-active" : ""}" type="button" data-slide="${index}" aria-label="Go to slide ${index + 1}"></button>`)
      .join("");

    let active = 0;
    const cards = qsa(".testimonial-card", stage);
    const dots = qsa(".dot", nav);

    function setActive(index) {
      active = index;
      cards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === index));
      dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
    }

    nav.addEventListener("click", (event) => {
      const button = event.target.closest("[data-slide]");
      if (!button) return;
      setActive(Number(button.dataset.slide));
    });

    setInterval(() => {
      setActive((active + 1) % testimonials.length);
    }, 5000);
  }

  function renderFaqs() {
    const faqWrap = qs("#faq-accordion");
    if (!faqWrap) return;
    faqWrap.innerHTML = faqs
      .map(
        (item, index) => `
          <article class="faq-item panel ${index === 0 ? "is-open" : ""}">
            <button type="button" data-faq-toggle>
              <div class="faq-head">
                <strong>${escapeHtml(item.question)}</strong>
                <i class="fa-solid fa-plus"></i>
              </div>
              <div class="faq-body">
                <p>${escapeHtml(item.answer)}</p>
              </div>
            </button>
          </article>
        `
      )
      .join("");
  }

  function renderNotificationsPreview() {
    const preview = qs("#student-notifications");
    if (!preview) return;
    const notifications = getNotifications().slice(0, 4);
    preview.innerHTML = notifications
      .map(
        (item) => `
          <div class="notification-item ${item.read ? "" : "unread"}">
            <div>
              <strong>${escapeHtml(item.title)}</strong>
              <div class="subtle">${escapeHtml(item.message)}</div>
              <div class="table-meta">${escapeHtml(item.timestamp)}</div>
            </div>
            <button class="button-ghost" type="button" data-mark-read="${escapeHtml(item.id)}">${item.read ? "Read" : "Mark read"}</button>
          </div>
        `
      )
      .join("");
  }

  function renderStudentSidebar() {
    const sidebar = qs("#student-sidebar");
    if (!sidebar) return;
    const profile = getProfile();
    const completion = getProfileCompletion(profile);
    const favorites = getFavorites();
    const unread = getUnreadCount();

    sidebar.innerHTML = `
      <div class="student-card">
        <div class="student-avatar">${escapeHtml(profile.name.slice(0, 2).toUpperCase())}</div>
        <h3>${escapeHtml(profile.name)}</h3>
        <p class="subtle">${escapeHtml(profile.department)} • ${escapeHtml(profile.level)}</p>
        <div class="chip-list spacer-top">
          <span class="level-badge ${levelClass(profile.level)}">${escapeHtml(profile.level)}</span>
          <span class="dept-badge ${iconForDepartment(profile.department).className}">${escapeHtml(profile.department)}</span>
        </div>
        <div class="spacer-top">
          <div class="stats-row"><strong>Profile completion</strong><span>${completion}%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width:${completion}%"></div></div>
        </div>
        <div class="list spacer-top">
          <div class="list-item"><span>Favorites</span><strong>${favorites.length}</strong></div>
          <div class="list-item"><span>Unread notifications</span><strong>${unread}</strong></div>
          <div class="list-item"><span>Stored CV</span><strong>${escapeHtml(localStorage.getItem(STORAGE_KEYS.cvName) || "None")}</strong></div>
        </div>
      </div>
    `;
  }

  function renderStudentDashboard() {
    const recommended = qs("#student-recommended");
    if (recommended) {
      const profile = getProfile();
      const roles = getAllInternships()
        .filter((item) => item.department === profile.department || item.level === profile.level)
        .slice(0, 4);
      recommended.innerHTML = roles.map(renderInternshipCard).join("");
      syncFavoriteButtons();
      initReveal();
    }

    renderNotificationsPreview();
    renderStudentSidebar();

    const favoritesWrap = qs("#student-favorites-preview");
    if (favoritesWrap) {
      const favorites = new Set(getFavorites());
      const saved = getAllInternships().filter((item) => favorites.has(item.id)).slice(0, 3);
      favoritesWrap.innerHTML = saved.length
        ? saved
            .map(
              (item) => `
                <div class="list-item">
                  <div>
                    <strong>${escapeHtml(item.title)}</strong>
                    <div class="subtle">${escapeHtml(item.company)} • ${escapeHtml(item.department)}</div>
                  </div>
                  <a class="button-ghost" href="${detailUrl(item.id)}">Open</a>
                </div>
              `
            )
            .join("")
        : '<div class="empty-state">No favorites saved yet. Use the internship cards to build your shortlist.</div>';
    }
  }

  function renderProfilePage() {
    const form = qs("#profile-form");
    if (!form) return;
    const profile = getProfile();
    const entries = {
      name: profile.name || "",
      email: profile.email || "",
      department: profile.department || "IT",
      level: profile.level || "3rd year",
      headline: profile.headline || "",
      location: profile.location || "",
      bio: profile.bio || "",
      skills: profile.skills || "",
      linkedIn: profile.linkedIn || ""
    };

    Object.entries(entries).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);
      if (field) field.value = value;
    });

    const completionNode = qs("#profile-completion");
    if (completionNode) {
      completionNode.textContent = `${getProfileCompletion(profile)}%`;
    }
  }

  function renderFavoritesPage() {
    const container = qs("#favorites-list");
    if (!container) return;
    const favoriteIds = new Set(getFavorites());
    const saved = getAllInternships().filter((item) => favoriteIds.has(item.id));
    container.innerHTML = saved.length ? saved.map(renderInternshipCard).join("") : '<div class="empty-state">Your shortlist is empty. Save internships from the search and details pages.</div>';
    syncFavoriteButtons();
    initReveal();
  }

  function renderCompanyDashboard() {
    const list = qs("#company-stage-list");
    if (!list) return;
    const roles = getAllInternships().slice(0, 6);
    list.innerHTML = roles
      .map(
        (item) => `
          <div class="list-item">
            <div>
              <strong>${escapeHtml(item.title)}</strong>
              <div class="subtle">${escapeHtml(item.department)} • ${escapeHtml(item.level)} • ${item.duration} months</div>
            </div>
            <div class="table-actions">
              <span class="pill">${escapeHtml(item.location)}</span>
              <a class="button-ghost" href="${detailUrl(item.id)}">Preview</a>
            </div>
          </div>
        `
      )
      .join("");

    const stats = {
      roles: getAllInternships().length,
      applications: getApplications().length,
      interviews: getApplications().filter((item) => item.status === "Interview").length,
      saved: getFavorites().length
    };

    qsa("[data-company-stat]").forEach((node) => {
      const key = node.dataset.companyStat;
      node.textContent = stats[key] || 0;
    });
  }

  function renderApplications() {
    const tbody = qs("#applications-table");
    if (!tbody) return;
    const items = getApplications();
    tbody.innerHTML = items
      .map((item) => {
        const dept = iconForDepartment(item.department);
        return `
          <tr>
            <td><strong>${escapeHtml(item.student)}</strong></td>
            <td>${escapeHtml(item.role)}</td>
            <td><span class="dept-badge ${dept.className}">${escapeHtml(item.department)}</span></td>
            <td><span class="pill">${escapeHtml(item.status)}</span></td>
            <td>${escapeHtml(item.date)}</td>
          </tr>
        `;
      })
      .join("");
  }

  function renderSearchResults() {
    const container = qs("#search-results");
    if (!container) return;
    const query = (qs("#search-input")?.value || "").trim().toLowerCase();
    const department = qs("#department-filter")?.value || "all";
    const level = qs("#level-filter")?.value || "all";
    const duration = qs("#duration-filter")?.value || "all";

    const results = getAllInternships().filter((item) => {
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.skills.join(" ").toLowerCase().includes(query);

      const matchesDepartment = department === "all" || item.department === department;
      const matchesLevel = level === "all" || item.level === level;
      const matchesDuration =
        duration === "all" ||
        (duration === "short" && item.duration <= 2) ||
        (duration === "medium" && item.duration >= 3 && item.duration <= 5) ||
        (duration === "long" && item.duration >= 6);

      return matchesQuery && matchesDepartment && matchesLevel && matchesDuration;
    });

    const count = qs("#search-count");
    if (count) count.textContent = `${results.length} internships found`;

    container.innerHTML = results.length
      ? results.map(renderInternshipCard).join("")
      : '<div class="empty-state">No internships match the current search. Clear a filter or broaden the keywords.</div>';
    syncFavoriteButtons();
    initReveal();
  }

  function renderInternshipDetails() {
    const target = qs("#internship-details");
    if (!target) return;
    const params = new URLSearchParams(window.location.search);
    const selectedId = params.get("id") || "ai-product-analyst";
    const internship = getAllInternships().find((item) => item.id === selectedId) || getAllInternships()[0];
    const dept = iconForDepartment(internship.department);

    target.innerHTML = `
      <section class="banner glass-card">
        <div class="banner-content">
          <div class="company-row">
            <div class="company-logo">${escapeHtml(internship.initials)}</div>
            <div>
              <p class="eyebrow"><i class="${dept.icon}"></i>${escapeHtml(internship.department)} Internship</p>
              <h1 class="section-title">${escapeHtml(internship.title)}</h1>
              <p class="section-copy">${escapeHtml(internship.banner)}</p>
            </div>
          </div>
        </div>
      </section>
      <div class="summary-panel spacer-lg">
        <article class="panel">
          <div class="card-meta">
            <span class="dept-badge ${dept.className}">${escapeHtml(internship.department)}</span>
            <span class="level-badge ${levelClass(internship.level)}">${escapeHtml(internship.level)}</span>
            <span class="pill">${escapeHtml(internship.salary)}</span>
            <span class="pill">${internship.duration} months</span>
          </div>
          <h3 class="spacer-top">Overview</h3>
          <p class="section-copy">${escapeHtml(internship.summary)}</p>
          <h3 class="spacer-top">Required skills</h3>
          <div class="skill-list">
            ${internship.skills.map((skill) => `<span class="chip">${escapeHtml(skill)}</span>`).join("")}
          </div>
          <h3 class="spacer-top">Responsibilities</h3>
          <div class="list">
            ${internship.responsibilities.map((responsibility) => `<div class="list-item"><span>${escapeHtml(responsibility)}</span></div>`).join("")}
          </div>
        </article>
        <aside class="panel">
          <h3>Internship snapshot</h3>
          <div class="list">
            <div class="list-item"><span>Company</span><strong>${escapeHtml(internship.company)}</strong></div>
            <div class="list-item"><span>Location</span><strong>${escapeHtml(internship.location)}</strong></div>
            <div class="list-item"><span>Level</span><strong>${escapeHtml(internship.level)}</strong></div>
            <div class="list-item"><span>Duration</span><strong>${internship.duration} months</strong></div>
          </div>
          <div class="inline-actions spacer-lg">
            <button class="button" type="button" data-apply-id="${escapeHtml(internship.id)}"><i class="fa-solid fa-paper-plane"></i>Apply now</button>
            <button class="button-ghost" type="button" data-favorite-id="${escapeHtml(internship.id)}"><i class="fa-regular fa-heart"></i><span>Favorite</span></button>
            <button class="button-ghost" type="button" data-share-id="${escapeHtml(internship.id)}"><i class="fa-solid fa-share-nodes"></i>Share</button>
          </div>
        </aside>
      </div>
    `;

    syncFavoriteButtons();
  }

  function renderReviewList() {
    const wrap = qs("#reviews-list");
    if (!wrap) return;
    const reviews = getReviews();
    const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const averageNode = qs("#reviews-average");
    const totalNode = qs("#reviews-total");
    if (averageNode) averageNode.textContent = average.toFixed(1);
    if (totalNode) totalNode.textContent = reviews.length;

    wrap.innerHTML = reviews
      .map(
        (review) => `
          <article class="testimonial-card reveal">
            <div class="stats-row">
              <div>
                <h3>${escapeHtml(review.name)}</h3>
                <p class="subtle">${escapeHtml(review.role)} • ${escapeHtml(review.company)}</p>
              </div>
              <div class="review-stars">${renderStars(review.rating)}</div>
            </div>
            <p>${escapeHtml(review.content)}</p>
          </article>
        `
      )
      .join("");
    initReveal();
  }

  function renderNotificationsPage() {
    const wrap = qs("#notifications-list");
    if (!wrap) return;
    const notifications = getNotifications();
    wrap.innerHTML = notifications
      .map(
        (item) => `
          <article class="notification-item ${item.read ? "" : "unread"}">
            <div>
              <div class="stats-row">
                <strong>${escapeHtml(item.title)}</strong>
                <span class="pill">${escapeHtml(item.category)}</span>
              </div>
              <p class="section-copy">${escapeHtml(item.message)}</p>
              <div class="table-meta">${escapeHtml(item.timestamp)}</div>
            </div>
            <button class="button-ghost" type="button" data-mark-read="${escapeHtml(item.id)}">${item.read ? "Read" : "Mark as read"}</button>
          </article>
        `
      )
      .join("");
  }

  function renderAdminUsers() {
    const tbody = qs("#admin-users-table");
    if (!tbody) return;
    tbody.innerHTML = initialStudents
      .map((student) => `
        <tr>
          <td><strong>${escapeHtml(student.name)}</strong></td>
          <td><span class="dept-badge ${iconForDepartment(student.department).className}">${escapeHtml(student.department)}</span></td>
          <td><span class="level-badge ${levelClass(student.level)}">${escapeHtml(student.level)}</span></td>
          <td>${student.completion}%</td>
          <td><span class="pill">${escapeHtml(student.status)}</span></td>
        </tr>
      `)
      .join("");
  }

  function renderAdminStages() {
    const tbody = qs("#admin-stages-table");
    if (!tbody) return;
    tbody.innerHTML = getAllInternships()
      .map((item) => `
        <tr>
          <td><strong>${escapeHtml(item.title)}</strong></td>
          <td>${escapeHtml(item.company)}</td>
          <td><span class="dept-badge ${iconForDepartment(item.department).className}">${escapeHtml(item.department)}</span></td>
          <td><span class="level-badge ${levelClass(item.level)}">${escapeHtml(item.level)}</span></td>
          <td>${item.duration} months</td>
        </tr>
      `)
      .join("");
  }

  function renderAdminReports() {
    const tbody = qs("#admin-reports-table");
    if (!tbody) return;
    tbody.innerHTML = initialReports
      .map((report) => `
        <tr>
          <td><strong>${escapeHtml(report.title)}</strong></td>
          <td>${escapeHtml(report.student)}</td>
          <td>${escapeHtml(report.company)}</td>
          <td><span class="dept-badge ${iconForDepartment(report.department).className}">${escapeHtml(report.department)}</span></td>
          <td><span class="pill">${escapeHtml(report.status)}</span></td>
        </tr>
      `)
      .join("");
  }

  function renderChat() {
    const list = qs("#chat-contacts");
    const thread = qs("#chat-thread");
    const title = qs("#chat-title");
    const subtitle = qs("#chat-subtitle");
    if (!list || !thread || !title || !subtitle) return;

    const contacts = getMessages();
    const activeId = localStorage.getItem(STORAGE_KEYS.selectedChat) || contacts[0].id;
    const active = contacts.find((contact) => contact.id === activeId) || contacts[0];

    list.innerHTML = contacts
      .map(
        (contact) => `
          <button class="chat-preview ${contact.id === active.id ? "is-active" : ""}" type="button" data-chat-contact="${escapeHtml(contact.id)}">
            <div class="company-row">
              <div class="company-logo">${escapeHtml(contact.initials)}</div>
              <div>
                <strong>${escapeHtml(contact.name)}</strong>
                <div class="subtle">${escapeHtml(contact.role)}</div>
                <div class="table-meta">${escapeHtml(contact.snippet)}</div>
              </div>
            </div>
          </button>
        `
      )
      .join("");

    title.textContent = active.name;
    subtitle.textContent = `${active.role} • ${active.status}`;
    thread.innerHTML = active.messages
      .map(
        (message) => `
          <div class="message-bubble ${message.from === "me" ? "outgoing" : "incoming"}">
            ${escapeHtml(message.text)}
            <div class="table-meta spacer-top">${escapeHtml(message.time)}</div>
          </div>
        `
      )
      .join("");
    thread.scrollTop = thread.scrollHeight;
  }

  function initTheme() {
    const stored = localStorage.getItem(STORAGE_KEYS.theme) || "dark";
    body.classList.toggle("dark-mode", stored === "dark");
    body.classList.toggle("light-mode", stored !== "dark");
    const header = qs(".site-header");
    if (header) {
      header.classList.toggle("light", stored !== "dark");
    }

    qsa("[data-theme-toggle]").forEach((toggle) => {
      toggle.innerHTML = stored === "dark"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    });
  }

  function initThemeToggles() {
    qsa("[data-theme-toggle]").forEach((toggle) => {
      if (toggle.dataset.boundTheme === "true") return;
      toggle.dataset.boundTheme = "true";
      toggle.addEventListener("click", () => {
        const next = body.classList.contains("dark-mode") ? "light" : "dark";
        localStorage.setItem(STORAGE_KEYS.theme, next);
        initTheme();
      });
    });
  }

  function initNavigation() {
    const current = body.dataset.nav;
    if (current) {
      qsa("[data-nav-link]").forEach((link) => {
        link.classList.toggle("is-active", link.dataset.navLink === current);
      });
    }

    const menuButton = qs("[data-menu-toggle]");
    const navLinks = qs(".nav-links");
    if (menuButton && navLinks) {
      menuButton.addEventListener("click", () => {
        navLinks.classList.toggle("is-open");
      });
    }
  }

  function initCounters() {
    qsa("[data-counter]").forEach((counter) => {
      const target = Number(counter.dataset.counter);
      let current = 0;
      const step = Math.max(1, Math.round(target / 40));

      const tick = () => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          return;
        }
        counter.textContent = current;
        requestAnimationFrame(tick);
      };

      tick();
    });
  }

  function initReveal() {
    const items = qsa(".reveal");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function initFaqs() {
    const accordion = qs("#faq-accordion");
    if (!accordion) return;
    accordion.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-faq-toggle]");
      if (!trigger) return;
      const item = trigger.closest(".faq-item");
      if (!item) return;
      qsa(".faq-item", accordion).forEach((faqItem) => {
        if (faqItem !== item) faqItem.classList.remove("is-open");
      });
      item.classList.toggle("is-open");
    });
  }

  function initProfileForm() {
    const form = qs("#profile-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(form).entries());
      writeStorage(STORAGE_KEYS.profile, payload);
      const completion = getProfileCompletion(payload);
      const completionNode = qs("#profile-completion");
      if (completionNode) completionNode.textContent = `${completion}%`;
      renderStudentSidebar();
      showToast("Profile saved", "Your student profile simulation was updated locally.");
    });

    const cvInput = qs("#cv-upload");
    const cvName = qs("#cv-file-name");
    if (cvInput && cvName) {
      const savedCv = localStorage.getItem(STORAGE_KEYS.cvName);
      if (savedCv) cvName.textContent = savedCv;
      cvInput.addEventListener("change", () => {
        const fileName = cvInput.files && cvInput.files[0] ? cvInput.files[0].name : "No file selected";
        localStorage.setItem(STORAGE_KEYS.cvName, fileName);
        cvName.textContent = fileName;
        renderStudentSidebar();
        showToast("CV stored", "The uploaded CV name was saved in localStorage.");
      });
    }
  }

  function initAddStageForm() {
    const form = qs("#add-stage-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(form).entries());
      const custom = getCustomInternships();
      custom.unshift({
        id: `custom-${Date.now()}`,
        title: payload.title,
        company: payload.company,
        initials: (payload.company || "SC").slice(0, 2).toUpperCase(),
        department: payload.department,
        level: payload.level,
        duration: Number(payload.duration),
        location: payload.location,
        salary: payload.salary,
        featured: true,
        banner: payload.banner,
        skills: payload.skills.split(",").map((item) => item.trim()).filter(Boolean),
        summary: payload.summary,
        responsibilities: payload.responsibilities.split("\n").map((line) => line.trim()).filter(Boolean)
      });
      writeStorage(STORAGE_KEYS.internships, custom);
      showToast("Internship added", "The new stage is now visible in dashboards and search.");
      form.reset();
      renderCompanyDashboard();
      renderSearchResults();
      renderAdminStages();
    });
  }

  function initReviewForm() {
    const form = qs("#review-form");
    const picker = qs("#star-picker");
    if (!form || !picker) return;
    let rating = 5;
    const input = qs("#review-rating");

    picker.addEventListener("click", (event) => {
      const button = event.target.closest("[data-rating]");
      if (!button) return;
      rating = Number(button.dataset.rating);
      input.value = String(rating);
      qsa("[data-rating]", picker).forEach((node) => node.classList.toggle("is-active", Number(node.dataset.rating) <= rating));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(form).entries());
      const reviews = getReviews();
      reviews.unshift({
        id: `review-${Date.now()}`,
        name: payload.name,
        role: payload.role,
        company: payload.company,
        rating: Number(payload.rating),
        content: payload.content
      });
      writeStorage(STORAGE_KEYS.reviews, reviews);
      form.reset();
      input.value = "5";
      qsa("[data-rating]", picker).forEach((node) => node.classList.toggle("is-active", Number(node.dataset.rating) <= 5));
      renderReviewList();
      showToast("Review submitted", "Your review was saved locally and added to the list.");
    });
  }

  function initNotificationsActions() {
    document.addEventListener("click", (event) => {
      const favorite = event.target.closest("[data-favorite-id]");
      if (favorite) {
        toggleFavorite(favorite.dataset.favoriteId);
      }

      const markRead = event.target.closest("[data-mark-read]");
      if (markRead) {
        const notifications = getNotifications().map((item) =>
          item.id === markRead.dataset.markRead ? { ...item, read: true } : item
        );
        writeStorage(STORAGE_KEYS.notifications, notifications);
        syncUnreadBadges();
        renderNotificationsPreview();
        renderNotificationsPage();
      }

      const apply = event.target.closest("[data-apply-id]");
      if (apply) {
        addNotification("Application submitted", "Your internship application has been simulated successfully.", "Application");
        showToast("Application sent", "A confirmation notification was added to your center.");
      }

      const share = event.target.closest("[data-share-id]");
      if (share) {
        const url = `${window.location.href.split("?")[0]}?id=${share.dataset.shareId}`;
        if (navigator.share) {
          navigator.share({ title: "StageConnect Internship", url }).catch(() => {});
        } else {
          navigator.clipboard.writeText(url).catch(() => {});
          showToast("Link copied", "The internship link was copied to your clipboard.");
        }
      }
    });
  }

  function initSearchInputs() {
    ["#search-input", "#department-filter", "#level-filter", "#duration-filter"].forEach((selector) => {
      const field = qs(selector);
      if (field) {
        field.addEventListener("input", renderSearchResults);
        field.addEventListener("change", renderSearchResults);
      }
    });
  }

  function initChatActions() {
    const contactsNode = qs("#chat-contacts");
    const form = qs("#chat-form");
    const typing = qs("#typing-indicator");
    if (contactsNode) {
      contactsNode.addEventListener("click", (event) => {
        const button = event.target.closest("[data-chat-contact]");
        if (!button) return;
        localStorage.setItem(STORAGE_KEYS.selectedChat, button.dataset.chatContact);
        renderChat();
      });
    }

    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = qs("#chat-message");
        const text = input.value.trim();
        if (!text) return;

        const contacts = getMessages();
        const activeId = localStorage.getItem(STORAGE_KEYS.selectedChat) || contacts[0].id;
        const contact = contacts.find((item) => item.id === activeId);
        if (!contact) return;

        contact.messages.push({ from: "me", text, time: "Now" });
        contact.snippet = text;
        writeStorage(STORAGE_KEYS.messages, contacts);
        renderChat();
        form.reset();

        if (typing) typing.classList.add("is-visible");
        setTimeout(() => {
          const replyBase = {
            "contact-1": "Received. I will attach your updated profile before the noon review.",
            "contact-2": "Confirmed. We will send the final interview agenda shortly.",
            "contact-3": "Thanks. Please prepare two design questions for the session."
          };
          contact.messages.push({
            from: "them",
            text: replyBase[contact.id] || "Thanks, I will get back to you shortly.",
            time: "Now"
          });
          contact.snippet = replyBase[contact.id] || "Thanks, I will get back to you shortly.";
          writeStorage(STORAGE_KEYS.messages, contacts);
          if (typing) typing.classList.remove("is-visible");
          renderChat();
        }, 1200);
      });
    }
  }

  function initContactForm() {
    const form = qs("#contact-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(form).entries());
      if (!payload.name || !payload.email || !payload.message) {
        showToast("Validation error", "Please fill in your name, email, and message.");
        return;
      }
      form.reset();
      showToast("Message queued", "Your support request was simulated successfully.");
    });
  }

  function initFooterYear() {
    qsa("[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  }

  function initCreatorCredit() {
    qsa(".footer").forEach((footer) => {
      if (qs(".footer-credit", footer)) return;
      const credit = document.createElement("div");
      credit.className = "footer-credit";
      credit.innerHTML = 'Created by <strong>BMS</strong>';
      footer.appendChild(credit);
    });
  }

  function bootstrap() {
    ensureState();
    createLoader();
    initTheme();
    initThemeToggles();
    initNavigation();
    initFooterYear();
    initCreatorCredit();
    initCounters();
    renderFeaturedInternships();
    renderTestimonials();
    renderFaqs();
    initFaqs();
    renderStudentDashboard();
    renderProfilePage();
    renderFavoritesPage();
    renderCompanyDashboard();
    renderApplications();
    renderSearchResults();
    renderInternshipDetails();
    renderReviewList();
    renderNotificationsPage();
    renderAdminUsers();
    renderAdminStages();
    renderAdminReports();
    renderChat();
    initProfileForm();
    initAddStageForm();
    initReviewForm();
    initNotificationsActions();
    initSearchInputs();
    initChatActions();
    initContactForm();
    syncUnreadBadges();
    syncFavoriteButtons();
    initReveal();
  }

  window.StageConnectData = {
    getInternships: getAllInternships,
    getReviews,
    getNotifications,
    getStudents: () => initialStudents,
    getReports: () => initialReports,
    getApplications,
    departmentConfig,
    levelConfig,
    getProfile
  };

  document.addEventListener("DOMContentLoaded", bootstrap);
  window.addEventListener("load", hideLoader);
})();
