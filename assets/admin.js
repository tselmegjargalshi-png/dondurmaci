(function () {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const VARSAYILAN_PIN = "dondurma2026";
  let V = MD.yukle();
  let sekme = "urunler";
  let filtreKat = "hepsi";

  const pinAl = () => { try { return localStorage.getItem(MD.PIN_ANAHTAR) || VARSAYILAN_PIN; } catch (e) { return VARSAYILAN_PIN; } };
  const oturumVar = () => { try { return sessionStorage.getItem("md.oturum") === "1"; } catch (e) { return false; } };

  function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("goster"); clearTimeout(toast.z); toast.z = setTimeout(() => t.classList.remove("goster"), 2200); }
  function kaydet(mesaj) {
    if (MD.kaydet(V)) toast(mesaj || "Kaydedildi ✓");
    else toast("Kayıt başarısız: görseller çok büyük olabilir");
    ciz();
  }

  /* Giriş */
  function girisDene() {
    if ($("#pin").value === pinAl()) { try { sessionStorage.setItem("md.oturum", "1"); } catch (e) { /* yoksay */ } goster(); }
    else $("#girisHata").textContent = "Şifre yanlış";
  }
  $("#girisBtn").addEventListener("click", girisDene);
  $("#pin").addEventListener("keydown", (e) => { if (e.key === "Enter") girisDene(); });
  $("#cikis").addEventListener("click", (e) => { e.preventDefault(); try { sessionStorage.removeItem("md.oturum"); } catch (x) { /* yoksay */ } location.reload(); });
  function goster() { $("#giris").hidden = true; $("#uygulama").hidden = false; ciz(); }
  if (oturumVar()) goster();

  $("#admSek").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    sekme = b.dataset.t;
    document.querySelectorAll("#admSek button").forEach((x) => x.classList.toggle("aktif", x === b));
    ciz();
  });

  function ciz() {
    const foto = V.urunler.filter((u) => u.foto).length;
    $("#istat").innerHTML = '<div><b>' + V.urunler.length + "</b><span>Ürün</span></div><div><b>" + V.kategoriler.length + "</b><span>Kategori</span></div><div><b>" + foto + "</b><span>Fotoğraflı ürün</span></div><div><b>" + V.urunler.filter((u) => u.tukendi).length + "</b><span>Tükenen</span></div>";
    if (sekme === "urunler") urunlerCiz();
    else if (sekme === "kategoriler") kategorilerCiz();
    else if (sekme === "isletme") isletmeCiz();
    else yedekCiz();
  }

  /* Ürünler */
  function urunlerCiz() {
    const kats = V.kategoriler;
    const liste = V.urunler.filter((u) => filtreKat === "hepsi" || u.kat === filtreKat);
    let h = '<div class="kutu"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between"><h2 style="margin:0">Ürünler</h2><button class="btn pembe" id="yeniUrun">+ Yeni ürün</button></div>';
    h += '<select class="alan" id="katSec" style="margin-top:12px"><option value="hepsi">Tüm kategoriler</option>' + kats.map((k) => '<option value="' + k.id + '"' + (filtreKat === k.id ? " selected" : "") + ">" + esc(k.ad) + "</option>").join("") + "</select>";
    h += liste.map((u) => {
      const k = kats.find((x) => x.id === u.kat);
      return '<div class="satir"><div>' + (u.foto ? '<img class="kucukfoto" src="' + u.foto + '" alt="">' : '<div class="kucukfoto">' + esc(k ? k.emoji : "🍦") + "</div>") + "</div>" +
        "<div><b>" + esc(u.ad) + (u.tukendi ? " (Tükendi)" : "") + "</b><small>" + esc(k ? k.ad : "") + " · " + esc(u.kcal) + " kcal · " + MD.para(u.fiyat) + "</small></div>" +
        '<div class="islem"><button class="btn hafif kucuk" data-duz="' + u.id + '">Düzenle</button><button class="btn sil kucuk" data-sil="' + u.id + '">Sil</button></div></div>';
    }).join("") || '<p class="bos">Bu kategoride ürün yok</p>';
    h += "</div>";
    $("#icerik").innerHTML = h;
    $("#yeniUrun").onclick = () => urunForm(null);
    $("#katSec").onchange = (e) => { filtreKat = e.target.value; urunlerCiz(); };
    document.querySelectorAll("[data-duz]").forEach((b) => (b.onclick = () => urunForm(b.dataset.duz)));
    document.querySelectorAll("[data-sil]").forEach((b) => (b.onclick = () => {
      const u = V.urunler.find((x) => x.id === b.dataset.sil);
      if (confirm('"' + u.ad + '" silinsin mi?')) { V.urunler = V.urunler.filter((x) => x.id !== u.id); kaydet("Ürün silindi"); }
    }));
  }

  function fotoKucult(dosya, cb) {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maks = 640; const o = Math.min(1, maks / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width * o); c.height = Math.round(img.height * o);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL("image/jpeg", 0.8));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(dosya);
  }

  function urunForm(id) {
    const yeni = !id;
    const u = yeni ? { id: "u" + Date.now(), kat: V.kategoriler[0].id, ad: "", acik: "", kcal: 0, fiyat: 0, alerjen: [], rozet: "", foto: "", tukendi: false } : MD.kopya(V.urunler.find((x) => x.id === id));
    let h = "<h2>" + (yeni ? "Yeni ürün" : "Ürünü düzenle") + "</h2>";
    h += '<div class="yukle-alan" id="yukleAlan">' + (u.foto ? '<img id="onizle" src="' + u.foto + '" alt="">' : '<div id="onizle" style="font-size:40px">📷</div>') +
      '<input type="file" id="dosya" accept="image/*" hidden><button class="btn pembe kucuk" id="fotoSec" type="button">Fotoğraf yükle</button> ' +
      '<button class="btn sil kucuk" id="fotoSil" type="button">Kaldır</button></div>';
    h += '<div class="form-izgara"><div class="tam"><label class="et">Ürün adı</label><input class="alan" id="fAd" value="' + esc(u.ad) + '"></div>' +
      '<div class="tam"><label class="et">Açıklama</label><textarea class="alan" id="fAcik">' + esc(u.acik) + "</textarea></div>" +
      '<div><label class="et">Kategori</label><select class="alan" id="fKat">' + V.kategoriler.map((k) => '<option value="' + k.id + '"' + (k.id === u.kat ? " selected" : "") + ">" + esc(k.ad) + "</option>").join("") + "</select></div>" +
      '<div><label class="et">Rozet</label><select class="alan" id="fRozet"><option value="">Yok</option><option' + (u.rozet === "İmza" ? " selected" : "") + '>İmza</option><option' + (u.rozet === "Yeni" ? " selected" : "") + ">Yeni</option></select></div>" +
      '<div><label class="et">Kalori (kcal)</label><input class="alan" id="fKcal" type="number" min="0" value="' + esc(u.kcal) + '"></div>' +
      '<div><label class="et">Fiyat (₺)</label><input class="alan" id="fFiyat" type="number" min="0" step="1" value="' + esc(u.fiyat) + '"></div></div>';
    h += '<label class="et">Alerjenler</label><div class="alerji-sec-adm">' + MD.ALLERGENS.map((a) => '<label><input type="checkbox" value="' + a.id + '"' + (u.alerjen.includes(a.id) ? " checked" : "") + ">" + MD.ikonSvg(a.id, 24) + "<span>" + esc(a.ad) + "</span></label>").join("") + "</div>";
    h += '<label style="display:flex;gap:8px;align-items:center;font-weight:800;margin-bottom:8px"><input type="checkbox" id="fTuk"' + (u.tukendi ? " checked" : "") + ' style="width:18px;height:18px"> Tükendi olarak işaretle</label>';
    h += '<div class="alt-islem"><button class="btn hafif" id="vazgec" type="button">Vazgeç</button><button class="btn" id="tamam" type="button">Kaydet</button></div>';
    $("#modal").innerHTML = h; $("#modalArka").classList.add("acik");
    $("#fotoSec").onclick = () => $("#dosya").click();
    $("#dosya").onchange = (e) => { const f = e.target.files[0]; if (!f) return; fotoKucult(f, (d) => { u.foto = d; $("#yukleAlan").querySelector("#onizle").outerHTML = '<img id="onizle" src="' + d + '" alt="">'; }); };
    $("#fotoSil").onclick = () => { u.foto = ""; $("#onizle").outerHTML = '<div id="onizle" style="font-size:40px">📷</div>'; };
    $("#vazgec").onclick = modalKapat;
    $("#tamam").onclick = () => {
      u.ad = $("#fAd").value.trim(); if (!u.ad) { toast("Ürün adı gerekli"); return; }
      u.acik = $("#fAcik").value.trim(); u.kat = $("#fKat").value; u.rozet = $("#fRozet").value;
      u.kcal = Number($("#fKcal").value) || 0; u.fiyat = Number($("#fFiyat").value) || 0;
      u.alerjen = [...document.querySelectorAll(".alerji-sec-adm input:checked")].map((x) => x.value);
      u.tukendi = $("#fTuk").checked;
      if (yeni) V.urunler.push(u); else V.urunler = V.urunler.map((x) => (x.id === u.id ? u : x));
      modalKapat(); kaydet(yeni ? "Ürün eklendi ✓" : "Ürün güncellendi ✓");
    };
  }
  function modalKapat() { $("#modalArka").classList.remove("acik"); }
  $("#modalArka").addEventListener("click", (e) => { if (e.target.id === "modalArka") modalKapat(); });

  /* Kategoriler */
  function kategorilerCiz() {
    let h = '<div class="kutu"><h2>Kategoriler</h2>';
    h += V.kategoriler.map((k, i) => '<div class="satir" style="grid-template-columns:1fr auto"><div><b>' + esc(k.emoji) + " " + esc(k.ad) + "</b><small>" + esc(k.alt) + " · " + V.urunler.filter((u) => u.kat === k.id).length + ' ürün</small></div><div class="islem"><button class="btn hafif kucuk" data-yu="' + i + '">↑</button><button class="btn hafif kucuk" data-as="' + i + '">↓</button><button class="btn hafif kucuk" data-kd="' + i + '">Düzenle</button><button class="btn sil kucuk" data-ks="' + i + '">Sil</button></div></div>').join("");
    h += '<button class="btn pembe" id="yeniKat" style="margin-top:12px">+ Yeni kategori</button></div>';
    $("#icerik").innerHTML = h;
    const tasi = (i, d) => { const j = i + d; if (j < 0 || j >= V.kategoriler.length) return; [V.kategoriler[i], V.kategoriler[j]] = [V.kategoriler[j], V.kategoriler[i]]; kaydet("Sıra güncellendi"); };
    document.querySelectorAll("[data-yu]").forEach((b) => (b.onclick = () => tasi(+b.dataset.yu, -1)));
    document.querySelectorAll("[data-as]").forEach((b) => (b.onclick = () => tasi(+b.dataset.as, 1)));
    document.querySelectorAll("[data-kd]").forEach((b) => (b.onclick = () => katForm(+b.dataset.kd)));
    document.querySelectorAll("[data-ks]").forEach((b) => (b.onclick = () => {
      const k = V.kategoriler[+b.dataset.ks];
      if (V.urunler.some((u) => u.kat === k.id)) { toast("Önce bu kategorideki ürünleri taşı veya sil"); return; }
      if (confirm('"' + k.ad + '" silinsin mi?')) { V.kategoriler.splice(+b.dataset.ks, 1); kaydet("Kategori silindi"); }
    }));
    $("#yeniKat").onclick = () => katForm(-1);
  }
  function katForm(i) {
    const k = i < 0 ? { id: "k" + Date.now(), ad: "", alt: "", emoji: "🍦" } : V.kategoriler[i];
    $("#modal").innerHTML = "<h2>" + (i < 0 ? "Yeni kategori" : "Kategoriyi düzenle") + '</h2><label class="et">Ad</label><input class="alan" id="kAd" value="' + esc(k.ad) + '"><label class="et">Alt başlık</label><input class="alan" id="kAlt" value="' + esc(k.alt) + '"><label class="et">Emoji</label><input class="alan" id="kEm" value="' + esc(k.emoji) + '"><div class="alt-islem"><button class="btn hafif" id="vazgec">Vazgeç</button><button class="btn" id="tamam">Kaydet</button></div>';
    $("#modalArka").classList.add("acik");
    $("#vazgec").onclick = modalKapat;
    $("#tamam").onclick = () => {
      const ad = $("#kAd").value.trim(); if (!ad) { toast("Kategori adı gerekli"); return; }
      k.ad = ad; k.alt = $("#kAlt").value.trim(); k.emoji = $("#kEm").value.trim() || "🍦";
      if (i < 0) V.kategoriler.push(k);
      modalKapat(); kaydet();
    };
  }

  /* İşletme */
  function isletmeCiz() {
    const I = V.isletme;
    const alan = (id, et, v, tam, area) => '<div class="' + (tam ? "tam" : "") + '"><label class="et">' + et + "</label>" + (area ? '<textarea class="alan" id="' + id + '">' + esc(v) + "</textarea>" : '<input class="alan" id="' + id + '" value="' + esc(v) + '">') + "</div>";
    $("#icerik").innerHTML = '<div class="kutu"><h2>İşletme bilgileri</h2><div class="form-izgara">' +
      alan("iAd", "İşletme adı", I.ad) + alan("iIns", "Instagram kullanıcı adı (@ olmadan)", I.instagram) +
      alan("iSlo", "Slogan", I.slogan, true) + alan("iAlt", "Alt slogan", I.altSlogan, true) +
      alan("iDuy", "Duyuru bandı (boşsa gizlenir)", I.duyuru, true) + alan("iAdr", "Adres", I.adres, true, true) +
      alan("iTel", "Telefon", I.telefon) + alan("iSaat", "Çalışma saatleri", I.saatler) +
      '</div><button class="btn" id="iKaydet">Kaydet</button></div>';
    $("#iKaydet").onclick = () => {
      Object.assign(V.isletme, { ad: $("#iAd").value.trim(), instagram: $("#iIns").value.trim().replace(/^@/, ""), slogan: $("#iSlo").value.trim(), altSlogan: $("#iAlt").value.trim(), duyuru: $("#iDuy").value.trim(), adres: $("#iAdr").value.trim(), telefon: $("#iTel").value.trim(), saatler: $("#iSaat").value.trim() });
      kaydet();
    };
  }

  /* Yedek */
  function yedekCiz() {
    $("#icerik").innerHTML = '<div class="kutu"><h2>Yedekle ve taşı</h2><p style="font-weight:700;color:var(--soluk)">Değişiklikler bu tarayıcıda saklanır. Başka bir cihazda aynı menüyü görmek için yedeği indirip diğer cihazda içe aktar.</p>' +
      '<button class="btn" id="indir">Yedeği indir</button> <button class="btn hafif" id="iceAkt">Yedeği içe aktar</button><input type="file" id="yedekDosya" accept="application/json" hidden></div>' +
      '<div class="kutu"><h2>Şifre</h2><input class="alan" id="yeniPin" type="text" placeholder="Yeni şifre (en az 6 karakter)"><button class="btn" id="pinKaydet">Şifreyi değiştir</button></div>' +
      '<div class="kutu"><h2>Başa dön</h2><p style="font-weight:700;color:var(--soluk)">Tüm ürünler ve fotoğraflar varsayılan menüye döner.</p><button class="btn sil" id="sifirla">Varsayılana sıfırla</button></div>';
    $("#indir").onclick = () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(V, null, 2)], { type: "application/json" }));
      a.download = "maras-dondurmacisi-menu-yedek.json"; a.click();
    };
    $("#iceAkt").onclick = () => $("#yedekDosya").click();
    $("#yedekDosya").onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => { try { const d = JSON.parse(r.result); if (!d.urunler || !d.kategoriler || !d.isletme) throw 0; V = d; kaydet("Yedek yüklendi ✓"); } catch (x) { toast("Geçersiz yedek dosyası"); } };
      r.readAsText(f);
    };
    $("#pinKaydet").onclick = () => {
      const p = $("#yeniPin").value; if (p.length < 6) { toast("Şifre en az 6 karakter olmalı"); return; }
      try { localStorage.setItem(MD.PIN_ANAHTAR, p); toast("Şifre değişti ✓"); } catch (x) { toast("Şifre kaydedilemedi"); }
    };
    $("#sifirla").onclick = () => { if (confirm("Tüm değişiklikler silinecek. Emin misin?")) { MD.sifirla(); V = MD.yukle(); toast("Sıfırlandı"); ciz(); } };
  }
})();
