/**
 * opinion.js — Student opinion form → Google Sheets + public display
 *
 * Google Sheets Web App URL (configured, do not change):
 * See GOOGLE_SCRIPT_URL below.
 */

(function () {
  "use strict";

  // ─── CONFIG (DO NOT CHANGE — already configured) ────────────────────────────
  var GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynx1NYxxeKaAsrj8gPahdn8G2xOk4a6cJG8KowM7oYmMsiFC1n8iWiXXQOA93aozdnVA/exec";
  var LOCAL_KEY = "stageconnect-student-opinions";
  // ───────────────────────────────────────────────────────────────────────────

  // ─── SEEDED DEMO OPINIONS (visible to everyone, always) ────────────────────
  var INITIAL_OPINIONS = [
    {
      timestamp: "09/05/2026, 14:30",
      studentName: "Ines Fakhfakh",
      department: "IT",
      level: "3rd year",
      societyName: "Nexora Labs",
      overallOpinion: "Une expérience vraiment enrichissante. L'équipe m'a traitée comme un vrai membre dès la première semaine. Les projets sont concrets et les retours rapides.",
      pros: "Bonne ambiance, tâches réelles, mentoring de qualité",
      cons: "Les horaires peuvent être intenses en période de release",
      recommend: "Yes"
    },
    {
      timestamp: "08/05/2026, 09:15",
      studentName: "Walid Gharbi",
      department: "Mechanical",
      level: "2nd year",
      societyName: "Atlas Motion",
      overallOpinion: "J'ai eu accès à de vrais projets CAO et à l'atelier de production. Beaucoup plus pratique que ce à quoi je m'attendais.",
      pros: "Équipements modernes, ingénieurs accessibles, tâches variées",
      cons: "Peu de documentation interne disponible au départ",
      recommend: "Yes"
    },
    {
      timestamp: "07/05/2026, 16:45",
      studentName: "Sarra Mzoughi",
      department: "Management",
      level: "1st year",
      societyName: "NorthStar Advisory",
      overallOpinion: "Stage utile pour découvrir la gestion opérationnelle. J'ai appris à structurer mes rapports et à communiquer avec des clients professionnels.",
      pros: "Bonne introduction au monde professionnel, superviseur disponible",
      cons: "Tâches un peu répétitives sur la fin du stage",
      recommend: "Maybe"
    },
    {
      timestamp: "06/05/2026, 11:00",
      studentName: "Youssef Trabelsi",
      department: "Electrical",
      level: "3rd year",
      societyName: "VoltEdge",
      overallOpinion: "Très bon environnement technique. J'ai travaillé sur des cartes PCB réelles et participé aux tests de validation en laboratoire.",
      pros: "Labo bien équipé, projets réels, équipe soudée",
      cons: "Peu d'interactions avec les autres départements",
      recommend: "Yes"
    }
  ];

  // ─── HELPERS ───────────────────────────────────────────────────────────────
  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getStoredOpinions() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    } catch (_) { return []; }
  }

  function saveLocalOpinion(data) {
    try {
      var list = getStoredOpinions();
      list.unshift(data);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (_) {}
  }

  function deptClass(dept) {
    var map = { IT: "dept-it", Mechanical: "dept-mechanical", Electrical: "dept-electrical", Management: "dept-management" };
    return map[dept] || "dept-it";
  }

  function recStyle(rec) {
    if (rec === "Yes")   return { bg: "rgba(61,213,152,0.16)",  color: "var(--success)", icon: "fa-thumbs-up" };
    if (rec === "No")    return { bg: "rgba(255,107,129,0.16)", color: "var(--danger)",  icon: "fa-thumbs-down" };
    return                      { bg: "rgba(255,155,95,0.16)",  color: "var(--warning)", icon: "fa-circle-half-stroke" };
  }

  // ─── RENDER OPINION CARDS ──────────────────────────────────────────────────
  function renderOpinionCards(containerId, limit) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var stored = getStoredOpinions();
    var all = stored.concat(INITIAL_OPINIONS);
    if (typeof limit === "number") all = all.slice(0, limit);

    if (!all.length) {
      container.innerHTML = '<div class="empty-state">Aucune opinion pour le moment. Soyez le premier à partager !</div>';
      return;
    }

    container.innerHTML = all.map(function (op) {
      var initials = (op.studentName || "?").trim().split(" ").map(function (w) { return w[0] || ""; }).join("").slice(0, 2).toUpperCase();
      var rec = recStyle(op.recommend);
      var dc  = deptClass(op.department);

      return (
        '<article class="opinion-card reveal">' +
          '<div class="opinion-card-top">' +
            '<div class="company-logo">' + esc(initials) + '</div>' +
            '<div class="opinion-card-meta">' +
              '<strong>' + esc(op.studentName) + '</strong>' +
              '<div class="subtle">' + esc(op.department) + ' · ' + esc(op.level) + '</div>' +
            '</div>' +
            '<span class="opinion-rec-badge" style="background:' + rec.bg + ';color:' + rec.color + '">' +
              '<i class="fa-solid ' + rec.icon + '"></i> ' + esc(op.recommend) +
            '</span>' +
          '</div>' +
          '<div class="opinion-society">' +
            '<span class="dept-badge ' + dc + '"><i class="fa-solid fa-building"></i> ' + esc(op.societyName) + '</span>' +
          '</div>' +
          '<p class="opinion-text">"' + esc(op.overallOpinion) + '"</p>' +
          (op.pros ? '<div class="opinion-detail"><i class="fa-solid fa-circle-check" style="color:var(--success)"></i> <span>' + esc(op.pros) + '</span></div>' : '') +
          (op.cons ? '<div class="opinion-detail"><i class="fa-solid fa-circle-xmark" style="color:var(--danger)"></i> <span>' + esc(op.cons) + '</span></div>' : '') +
          '<div class="opinion-timestamp">' + esc(op.timestamp || "") + '</div>' +
        '</article>'
      );
    }).join("");

    // trigger reveal animations if available
    if (typeof initReveal === "function") initReveal();
  }

  // ─── STATUS BANNER ─────────────────────────────────────────────────────────
  var statusBanner = document.getElementById("opinion-status");
  var submitBtn    = document.getElementById("opinion-submit");

  function showStatus(type, message) {
    if (!statusBanner) return;
    statusBanner.removeAttribute("hidden");
    statusBanner.className = "opinion-status opinion-status--" + type;
    var icons = { loading: "fa-circle-notch fa-spin", success: "fa-circle-check", error: "fa-triangle-exclamation" };
    statusBanner.innerHTML = '<i class="fa-solid ' + (icons[type] || "fa-info") + '"></i> ' + message;
    if (type === "success") {
      setTimeout(function () { statusBanner.setAttribute("hidden", ""); }, 8000);
    }
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading
      ? '<i class="fa-solid fa-circle-notch fa-spin"></i> Envoi en cours…'
      : '<i class="fa-solid fa-cloud-arrow-up"></i> Envoyer mon opinion à Google Sheets';
  }

  // ─── RECOMMENDATION RADIO HIGHLIGHT ────────────────────────────────────────
  var form = document.getElementById("opinion-form");
  if (form) {
    form.querySelectorAll('input[name="recommend"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        form.querySelectorAll(".recommend-option").forEach(function (l) { l.classList.remove("is-selected"); });
        if (radio.checked) radio.closest(".recommend-option").classList.add("is-selected");
      });
    });

    // ─── VALIDATION ──────────────────────────────────────────────────────────
    function validate(d) {
      if (!d.studentName || !d.studentName.trim()) return "Veuillez entrer votre nom complet.";
      if (!d.department)                           return "Veuillez sélectionner votre département.";
      if (!d.level)                                return "Veuillez sélectionner votre niveau d'études.";
      if (!d.societyName || !d.societyName.trim()) return "Veuillez entrer le nom de l'entreprise / société.";
      if (!d.overallOpinion || !d.overallOpinion.trim()) return "Veuillez écrire votre opinion générale.";
      if (!d.recommend)                            return "Veuillez indiquer si vous recommandez cette entreprise.";
      return null;
    }

    // ─── FORM SUBMIT → GOOGLE SHEETS ─────────────────────────────────────────
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (statusBanner) statusBanner.setAttribute("hidden", "");

      var raw = Object.fromEntries(new FormData(form).entries());
      var err = validate(raw);
      if (err) { showStatus("error", err); return; }

      raw.timestamp = new Date().toLocaleString("fr-DZ", { dateStyle: "short", timeStyle: "short" });

      setLoading(true);
      showStatus("loading", "Envoi de votre opinion vers Google Sheets…");

      var body = new URLSearchParams(raw);

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: body,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Serveur: " + res.status);
          return res.json();
        })
        .then(function (json) {
          setLoading(false);
          if (json && json.result === "success") {
            showStatus("success", "✅ Votre opinion a été enregistrée dans Google Sheets ! Merci.");
            saveLocalOpinion(raw);
            form.reset();
            form.querySelectorAll(".recommend-option").forEach(function (l) { l.classList.remove("is-selected"); });
            // Refresh opinion list on same page if present
            renderOpinionCards("opinions-list");
          } else {
            throw new Error(json && json.error ? json.error : "Réponse inattendue.");
          }
        })
        .catch(function (err) {
          setLoading(false);
          console.error("[opinion.js]", err);
          showStatus("error", "Impossible d'atteindre Google Sheets. Vérifiez votre connexion. (" + err.message + ")");
        });
    });
  }

  // ─── AUTO-RENDER ON PAGE LOAD ───────────────────────────────────────────────
  // index.html preview (3 cards)
  renderOpinionCards("opinions-preview", 3);
  // reviews/list.html full list
  renderOpinionCards("opinions-list");

})();
