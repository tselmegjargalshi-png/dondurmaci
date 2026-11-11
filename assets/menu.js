(function () {
  const V = MD.yukle();
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const gizli = new Set();
  let arama = "";

  /* Üst bölüm */
  const I = V.isletme;
  document.title = I.ad + " Dijital Menü";
  $("#slogan").textContent = I.slogan;
  $("#altSlogan").textContent = I.altSlogan;
  if (I.duyuru) { const d = $("#duyuru"); d.hidden = false; d.innerHTML = "📣 " + esc(I.duyuru); }
  const sozler = [I.slogan, "Keçi sütü", "Salep", "Sakız", "Antep fıstığı", "Kahramanmaraş'tan sevgiyle", I.altSlogan];
  $("#serit").innerHTML = sozler.concat(sozler).map((s) => "<span>" + esc(s) + "</span>").join("");
  $("#imzaAd").textContent = I.ad;

  /* Konfeti */
  const RENKLER = ["#e83e7c", "#8c1236", "#e0a53a", "#9db04a", "#fff", "#5b2a18"];
  function konfeti(x, y, n) {
    for (let i = 0; i < (n || 18); i++) {
      const e = document.createElement("i");
      e.className = "konfeti";
      e.style.left = x + "px"; e.style.top = y + "px";
      e.style.background = RENKLER[i % RENKLER.length];
      e.style.setProperty("--x", (Math.random() - .5) * 260 + "px");
      e.style.setProperty("--y", (Math.random() * 220 + 40) + "px");
      e.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      document.body.appendChild(e);
      setTimeout(() => e.remove(), 1200);
    }
  }
  $("#logo").addEventListener("click", (e) => { const r = e.target.getBoundingClientRect(); konfeti(r.left + r.width / 2, r.top + r.height / 2, 30); });

  /* Külah yapıcı */
  const tatRenk = { u1: "#fff3d6", u2: "#c9d98a", u3: "#6b3a22", u4: "#f59bb5", u5: "#b0214a", u6: "#ffe9b0", u7: "#c98a4a", u8: "#f6e86a" };
  const diger = ["#f3b7c8", "#d9a066", "#bfd37a", "#f7d88a"];
  const dondurmalar = V.urunler.filter((u) => u.kat === "dondurma" && !u.tukendi);
  const secili = [];
  const renkOf = (u, i) => tatRenk[u.id] || diger[i % diger.length];

  function yapiciCiz() {
    const tatlar = $("#tatlar");
    tatlar.innerHTML = dondurmalar.map((u) => '<button type="button" data-id="' + u.id + '" class="' + (secili.includes(u.id) ? "secili" : "") + '">' + esc(u.ad) + "</button>").join("");
    const ys = [96, 62, 28];
    $("#toplar").innerHTML = secili.map((id, k) => {
      const u = dondurmalar.find((x) => x.id === id);
      const c = renkOf(u, k);
      const y = ys[k];
      return '<g class="top" style="animation:gel .4s both"><circle cx="75" cy="' + y + '" r="35" fill="' + c + '"/>' +
        '<path d="M42 ' + (y + 8) + 'q8 14 17 6t17 6 17-6 17 6" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="5" stroke-linecap="round"/>' +
        '<circle cx="64" cy="' + (y - 14) + '" r="6" fill="rgba(255,255,255,.35)"/></g>';
    }).join("");
    let kcal = 0, fiyat = 0; const al = new Set();
    secili.forEach((id) => { const u = dondurmalar.find((x) => x.id === id); kcal += u.kcal; fiyat += u.fiyat; u.alerjen.forEach((a) => al.add(a)); });
    if ($("#kulahSec").checked && secili.length) { kcal += 80; fiyat += 15; al.add("gluten"); al.add("yumurta"); al.add("sut"); }
    $("#ykcal").textContent = kcal;
    $("#yfiyat").textContent = MD.para(fiyat);
    $("#yalerji").innerHTML = secili.length ? (al.size ? [...al].map((a) => MD.ikonSvg(a, 26)).join("") : '<span class="kcal">Alerjen yok</span>') : '<span class="kcal">Bir tat seç</span>';
  }
  $("#tatlar").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const id = b.dataset.id; const i = secili.indexOf(id);
    if (i >= 0) secili.splice(i, 1);
    else { if (secili.length >= 3) secili.shift(); secili.push(id); const r = b.getBoundingClientRect(); konfeti(r.left + r.width / 2, r.top, 14); }
    yapiciCiz();
  });
  $("#kulahSec").addEventListener("change", yapiciCiz);
  $("#yTemizle").addEventListener("click", () => { secili.length = 0; yapiciCiz(); });
  yapiciCiz();

  /* Sekmeler ve liste */
  $("#sekmeler").innerHTML = V.kategoriler.map((k, i) => '<button class="sekme' + (i === 0 ? " aktif" : "") + '" data-k="' + k.id + '" type="button">' + esc(k.ad) + "</button>").join("");

  function kartHtml(u, i) {
    const foto = u.foto ? '<img class="foto" loading="lazy" src="' + u.foto + '" alt="' + esc(u.ad) + '">' : "";
    const rozet = u.rozet ? '<span class="rozet' + (u.rozet === "Yeni" ? " yeni" : "") + '">' + esc(u.rozet) + "</span>" : "";
    return '<article class="kart' + (u.tukendi ? " tukendi" : "") + '" style="animation-delay:' + Math.min(i * 40, 400) + 'ms">' + rozet +
      '<div class="sol"><h3>' + esc(u.ad) + "</h3><p>" + esc(u.acik) + "</p>" +
      '<div class="alt-satir"><span class="kcal">' + esc(u.kcal) + " kcal</span>" + (u.alerjen || []).map((a) => MD.ikonSvg(a, 26)).join("") + "</div></div>" +
      '<div class="sag">' + foto + '<span class="fiyat">' + MD.para(u.fiyat) + "</span></div></article>";
  }

  function listeCiz() {
    const q = arama.trim().toLocaleLowerCase("tr");
    let html = "";
    V.kategoriler.forEach((k) => {
      const ur = V.urunler.filter((u) => u.kat === k.id &&
        !(u.alerjen || []).some((a) => gizli.has(a)) &&
        (!q || (u.ad + " " + u.acik).toLocaleLowerCase("tr").includes(q)));
      if (!ur.length) return;
      html += '<section class="bolum" id="k_' + k.id + '"><h2>' + esc(k.emoji || "") + " " + esc(k.ad) + '</h2><p class="alt">' + esc(k.alt || "") + '</p><div class="izgara">' + ur.map(kartHtml).join("") + "</div></section>";
    });
    $("#liste").innerHTML = html || '<div class="bos">Bu aramaya uygun ürün bulunamadı 🍦</div>';
  }
  listeCiz();

  $("#sekmeler").addEventListener("click", (e) => {
    const b = e.target.closest(".sekme"); if (!b) return;
    const el = document.getElementById("k_" + b.dataset.k);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  window.addEventListener("scroll", () => {
    let aktif = null;
    document.querySelectorAll(".bolum").forEach((s) => { if (s.getBoundingClientRect().top < 160) aktif = s.id.slice(2); });
    document.querySelectorAll(".sekme").forEach((b) => {
      const on = b.dataset.k === aktif; b.classList.toggle("aktif", on);
      if (on) { const c = $("#sekmeler"); c.scrollTo({ left: b.offsetLeft - 20, behavior: "smooth" }); }
    });
  }, { passive: true });

  $("#aramaBtn").addEventListener("click", () => { $("#arama").classList.toggle("acik"); if ($("#arama").classList.contains("acik")) $("#aramaInput").focus(); });
  $("#aramaInput").addEventListener("input", (e) => { arama = e.target.value; listeCiz(); });

  /* Alerji çekmecesi */
  $("#alerjiIzgara").innerHTML = MD.ALLERGENS.map((a) => '<button type="button" class="alerji-sec" data-a="' + a.id + '">' + MD.ikonSvg(a.id, 54) + "<span>" + esc(a.ad) + "</span></button>").join("");
  const ac = (v) => { $("#cekmece").classList.toggle("acik", v); $("#arka").classList.toggle("acik", v); };
  $("#filtreBtn").addEventListener("click", () => ac(true));
  $("#arka").addEventListener("click", () => ac(false));
  $("#bitti").addEventListener("click", () => ac(false));
  $("#alerjiIzgara").addEventListener("click", (e) => {
    const b = e.target.closest(".alerji-sec"); if (!b) return;
    const a = b.dataset.a; if (gizli.has(a)) gizli.delete(a); else gizli.add(a);
    b.classList.toggle("secili", gizli.has(a));
    $("#filtreBtn").classList.toggle("dolu", gizli.size > 0);
    listeCiz();
  });

  /* Altbilgi */
  $("#lejant").innerHTML = MD.ALLERGENS.map((a) => "<div>" + MD.ikonSvg(a.id, 46) + "<span>" + esc(a.ad) + "</span></div>").join("");
  const harita = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(I.adres);
  let b = '<a href="' + harita + '" target="_blank" rel="noopener"><span class="e">📍</span><span>' + esc(I.adres) + "</span></a>";
  b += '<a href="tel:' + esc(I.telefon.replace(/\s/g, "")) + '"><span class="e">📞</span><span>' + esc(I.telefon) + "</span></a>";
  b += '<a href="https://instagram.com/' + esc(I.instagram) + '" target="_blank" rel="noopener"><span class="e">📸</span><span>@' + esc(I.instagram) + "</span></a>";
  b += '<div class="k"><span class="e">🕙</span><span>' + esc(I.saatler) + "</span></div>";
  $("#bilgi").innerHTML = b;
})();
