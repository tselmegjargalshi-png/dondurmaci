/* Maraş Dondurmacısı ortak veri ve depolama */
(function () {
  const ALLERGENS = [
    { id: "fistik", ad: "Yer fıstığı", renk: "#F0B84A", ikon: '<path d="M12 3c-2.6 0-4 1.8-4 3.6 0 1 .5 1.7 1 2.3-.9.8-1.6 1.9-1.6 3.4 0 2.6 2 4.7 4.6 4.7s4.6-2.1 4.6-4.7c0-1.5-.7-2.6-1.6-3.4.5-.6 1-1.3 1-2.3C16 4.8 14.600 3 12 3z" fill="#fff"/><circle cx="10.500" cy="11.500" r=".9" fill="currentColor"/><circle cx="13.500" cy="14.500" r=".9" fill="currentColor"/>' },
    { id: "kuruyemis", ad: "Sert kabuklu yemişler", renk: "#E8953A", ikon: '<path d="M12 4.500c-2.800 0-5 1.600-5 3.800h10c0-2.200-2.200-3.800-5-3.800z" fill="#fff"/><path d="M7.500 9.500h9c0 4.200-1.600 8-4.500 10-2.900-2-4.500-5.800-4.500-10z" fill="#fff"/>' },
    { id: "kabuklu", ad: "Kabuklu deniz ürünleri", renk: "#3A7BD5", ikon: '<circle cx="12" cy="12.500" r="3.800" fill="#fff"/><path d="M5 8l3 2.500M19 8l-3 2.500M5 17l3-2.500M19 17l-3-2.500M9 5l1.500 3M15 5l-1.500 3" stroke="#fff" stroke-width="1.600" stroke-linecap="round"/>' },
    { id: "yumusakca", ad: "Yumuşakçalar", renk: "#2FB5A8", ikon: '<path d="M12 5c-4.200 0-7 3.200-7 7.200 0 2.300 1.100 3.800 2.200 4.800h9.600c1.100-1 2.200-2.500 2.200-4.800C19 8.200 16.200 5 12 5z" fill="#fff"/><path d="M12 6v10M8.500 7.500l1.800 8.500M15.500 7.500l-1.800 8.500" stroke="currentColor" stroke-width=".9"/>' },
    { id: "balik", ad: "Balık", renk: "#1E9BE0", ikon: '<path d="M3.500 12c2.200-3.600 5.500-5 9-5 2.300 0 4.300 1.200 5.500 3l2.500-1.800v7.600L18 14c-1.200 1.800-3.200 3-5.500 3-3.500 0-6.800-1.400-9-5z" fill="#fff"/><circle cx="8.500" cy="11" r=".9" fill="currentColor"/>' },
    { id: "yumurta", ad: "Yumurta", renk: "#E8CF12", ikon: '<path d="M12 4.500c3 0 4.500 1.600 5.500 3.200 1.200 2 2 3.600 1 6-1 2.500-3.600 4-6.500 4-3.800 0-6.500-2.200-6.500-5.600 0-3.800 3-7.600 6.500-7.600z" fill="#fff"/><circle cx="12" cy="12" r="2.800" fill="currentColor"/>' },
    { id: "sut", ad: "Süt", renk: "#D69ACB", ikon: '<rect x="5" y="9" width="6" height="10" rx="1.200" fill="#fff"/><rect x="6.500" y="5.500" width="3" height="3.500" rx=".8" fill="#fff"/><rect x="12.500" y="12" width="6.500" height="7" rx="1.200" fill="#fff"/>' },
    { id: "gluten", ad: "Gluten", renk: "#A9522D", ikon: '<path d="M12 20V6" stroke="#fff" stroke-width="1.600" stroke-linecap="round"/><path d="M12 8c-2.500 0-3.500-1.800-3.500-3.500 2.400 0 3.500 1.500 3.500 3.500zM12 8c2.500 0 3.500-1.800 3.500-3.500-2.400 0-3.500 1.500-3.500 3.500zM12 12.500c-2.500 0-3.800-1.800-3.800-3.500 2.600 0 3.800 1.500 3.800 3.500zM12 12.500c2.500 0 3.800-1.800 3.800-3.500-2.600 0-3.800 1.500-3.800 3.500zM12 17c-2.500 0-3.800-1.800-3.800-3.500 2.600 0 3.800 1.500 3.800 3.500zM12 17c2.500 0 3.800-1.800 3.800-3.500-2.600 0-3.800 1.500-3.800 3.500z" fill="#fff"/>' },
    { id: "soya", ad: "Soya", renk: "#34A853", ikon: '<path d="M4.500 15.500c-.5-4 2.500-8.500 7.500-9.500 3.500-.7 7 .8 7.500 3.500.6 3.200-2.500 8-8 8.700-3.800.5-6.600-.7-7-2.700z" fill="#fff"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="12.500" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="12.500" r="1" fill="currentColor"/>' },
    { id: "susam", ad: "Susam", renk: "#F0822D", ikon: '<g fill="#fff"><ellipse cx="12" cy="6.500" rx="2" ry="3" /><ellipse cx="12" cy="17.500" rx="2" ry="3"/><ellipse cx="6.500" cy="12" rx="3" ry="2"/><ellipse cx="17.500" cy="12" rx="3" ry="2"/></g>' },
    { id: "kereviz", ad: "Kereviz", renk: "#8DC973", ikon: '<path d="M8 20L11 6M12 20l1-14M16 20L15 6" stroke="#fff" stroke-width="2.200" stroke-linecap="round"/><path d="M10 6c0-1.500 1-2.500 2-2.500s2 1 2 2.500" stroke="#fff" stroke-width="1.600" fill="none" stroke-linecap="round"/>' },
    { id: "hardal", ad: "Hardal", renk: "#C9963F", ikon: '<rect x="9" y="4" width="6" height="3" rx="1" fill="#fff"/><path d="M8.500 8h7l1 11.500c0 .6-.4 1-1 1h-7c-.6 0-1-.4-1-1z" fill="#fff"/><circle cx="12" cy="14" r="2" fill="currentColor"/>' },
    { id: "aci", ad: "Acı bakla (Lupin)", renk: "#9B86C6", ikon: '<path d="M12 20V8" stroke="#fff" stroke-width="1.600" stroke-linecap="round"/><g fill="#fff"><circle cx="12" cy="5" r="1.600"/><circle cx="9.500" cy="8.500" r="1.600"/><circle cx="14.500" cy="8.500" r="1.600"/><circle cx="9" cy="12" r="1.600"/><circle cx="15" cy="12" r="1.600"/><circle cx="12" cy="11" r="1.600"/></g>' },
    { id: "sulfit", ad: "Sülfitler", renk: "#8E1B25", ikon: '<path d="M7 4.500h10c0 4-1.800 6.500-5 6.800-3.200-.3-5-2.800-5-6.800z" fill="#fff"/><path d="M12 11.500V19M8.500 19.500h7" stroke="#fff" stroke-width="1.600" stroke-linecap="round"/>' }
  ];

  const VARSAYILAN = {
    isletme: {
      ad: "Maraş Dondurmacısı",
      slogan: "Dövülür, uzar, bir daha sorulur: bir tane daha?",
      altSlogan: "Keçi sütü, salep ve sakızın yüzyıllık dansı",
      adres: "Trabzon Caddesi No 24, Onikişubat, Kahramanmaraş",
      telefon: "0344 123 45 67",
      instagram: "marasdondurmacisi",
      saatler: "Her gün 10:00 ile 24:00 arası",
      duyuru: "Bugün yeni: Kaymaklı Antep fıstıklı kupa",
      harita: ""
    },
    kategoriler: [
      { id: "dondurma", ad: "Maraş Dondurmaları", alt: "Dövülerek yoğrulan gerçek Maraş dondurması", emoji: "🍦" },
      { id: "servis", ad: "Külah ve Kupa", alt: "Toplarını sen seç, kalanı bize bırak", emoji: "🍨" },
      { id: "tatli", ad: "Tatlılar", alt: "Dondurmanın en yakın arkadaşları", emoji: "🍯" },
      { id: "soguk", ad: "Soğuk İçecekler", alt: "Sıcak günlerin kurtarıcıları", emoji: "🥤" },
      { id: "sicak", ad: "Sıcak İçecekler", alt: "Dondurma sonrası ısınma turu", emoji: "☕" }
    ],
    urunler: [
      { id: "u1", kat: "dondurma", ad: "Sade Maraş", acik: "Keçi sütü, salep, sakız. Başka hiçbir şey yok.", kcal: 190, fiyat: 55, alerjen: ["sut"], rozet: "İmza", foto: "" },
      { id: "u2", kat: "dondurma", ad: "Antep Fıstıklı", acik: "Sade Maraş üzerine bol Antep fıstığı", kcal: 235, fiyat: 70, alerjen: ["sut", "kuruyemis"], rozet: "", foto: "" },
      { id: "u3", kat: "dondurma", ad: "Çikolatalı", acik: "Bitter çikolata, ince bir sütlü dokunuş", kcal: 215, fiyat: 60, alerjen: ["sut", "soya"], rozet: "", foto: "" },
      { id: "u4", kat: "dondurma", ad: "Çilekli", acik: "Taze çilek ezmesi ve sütün ilk buluşması", kcal: 175, fiyat: 60, alerjen: ["sut"], rozet: "", foto: "" },
      { id: "u5", kat: "dondurma", ad: "Vişneli", acik: "Ekşi vişne, tatlı süt, kusursuz denge", kcal: 170, fiyat: 60, alerjen: ["sut"], rozet: "", foto: "" },
      { id: "u6", kat: "dondurma", ad: "Kaymaklı", acik: "Kalın kaymak, yavaş yavaş eriyen mutluluk", kcal: 250, fiyat: 65, alerjen: ["sut"], rozet: "Yeni", foto: "" },
      { id: "u7", kat: "dondurma", ad: "Karamelli Fındık", acik: "Tuzlu karamel ve kavrulmuş fındık", kcal: 240, fiyat: 70, alerjen: ["sut", "kuruyemis"], rozet: "", foto: "" },
      { id: "u8", kat: "dondurma", ad: "Limon Sorbe", acik: "Süt yok, ferahlık var", kcal: 110, fiyat: 50, alerjen: [], rozet: "", foto: "" },
      { id: "u9", kat: "servis", ad: "Tek Top Külah", acik: "Çıtır waffle külah içinde bir top", kcal: 270, fiyat: 70, alerjen: ["sut", "gluten"], rozet: "", foto: "" },
      { id: "u10", kat: "servis", ad: "Çift Top Külah", acik: "İki top, iki ayrı hikaye", kcal: 470, fiyat: 120, alerjen: ["sut", "gluten"], rozet: "", foto: "" },
      { id: "u11", kat: "servis", ad: "Üç Top Külah", acik: "Pembe, kahve, krem: logodaki gibi", kcal: 670, fiyat: 165, alerjen: ["sut", "gluten", "kuruyemis"], rozet: "İmza", foto: "" },
      { id: "u12", kat: "servis", ad: "Maraş Kupa", acik: "Dört top, fıstık yağmuru ve çikolata sosu", kcal: 820, fiyat: 210, alerjen: ["sut", "kuruyemis", "soya"], rozet: "", foto: "" },
      { id: "u13", kat: "tatli", ad: "Dondurmalı Künefe", acik: "Sıcak künefe, soğuk Maraş dondurması", kcal: 780, fiyat: 240, alerjen: ["sut", "gluten", "kuruyemis"], rozet: "İmza", foto: "" },
      { id: "u14", kat: "tatli", ad: "Fıstıklı Baklava", acik: "Dört dilim, bol Antep fıstığı", kcal: 520, fiyat: 190, alerjen: ["gluten", "kuruyemis", "sut"], rozet: "", foto: "" },
      { id: "u15", kat: "tatli", ad: "Kaymaklı Sütlaç", acik: "Fırında kızartılmış, kaymağı bol", kcal: 360, fiyat: 130, alerjen: ["sut"], rozet: "", foto: "" },
      { id: "u16", kat: "tatli", ad: "Tahin Pekmezli Waffle", acik: "Sıcak waffle, tahin, pekmez, bir top dondurma", kcal: 690, fiyat: 215, alerjen: ["gluten", "yumurta", "sut", "susam"], rozet: "", foto: "" },
      { id: "u17", kat: "soguk", ad: "Fıstıklı Milkshake", acik: "Maraş dondurması ve Antep fıstığı", kcal: 540, fiyat: 150, alerjen: ["sut", "kuruyemis"], rozet: "", foto: "" },
      { id: "u18", kat: "soguk", ad: "Naneli Limonata", acik: "Taze sıkılmış, bol buzlu", kcal: 120, fiyat: 80, alerjen: [], rozet: "", foto: "" },
      { id: "u19", kat: "soguk", ad: "Ayran", acik: "Köpüklü, bakır tasta gibi", kcal: 75, fiyat: 45, alerjen: ["sut"], rozet: "", foto: "" },
      { id: "u20", kat: "soguk", ad: "Soğuk Çay", acik: "Şeftali veya limon", kcal: 95, fiyat: 55, alerjen: ["sulfit"], rozet: "", foto: "" },
      { id: "u21", kat: "sicak", ad: "Dövme Salep", acik: "Tarçınlı, bol köpüklü", kcal: 210, fiyat: 95, alerjen: ["sut"], rozet: "Yeni", foto: "" },
      { id: "u22", kat: "sicak", ad: "Türk Kahvesi", acik: "Közde, lokumla", kcal: 25, fiyat: 70, alerjen: [], rozet: "", foto: "" },
      { id: "u23", kat: "sicak", ad: "Sıcak Çikolata", acik: "Yoğun, koyu, kaşıkla yenir", kcal: 290, fiyat: 100, alerjen: ["sut", "soya"], rozet: "", foto: "" },
      { id: "u24", kat: "sicak", ad: "Demli Çay", acik: "İnce belli bardakta", kcal: 2, fiyat: 25, alerjen: [], rozet: "", foto: "" }
    ]
  };

  const ANAHTAR = "marasdondurma.veri.v1";
  const PIN_ANAHTAR = "marasdondurma.pin.v1";

  function kopya(x) { return JSON.parse(JSON.stringify(x)); }

  function yukle() {
    try {
      const ham = localStorage.getItem(ANAHTAR);
      if (ham) {
        const v = JSON.parse(ham);
        if (v && v.urunler && v.kategoriler && v.isletme) return v;
      }
    } catch (e) { /* yoksay */ }
    return kopya(VARSAYILAN);
  }

  function kaydet(veri) {
    try { localStorage.setItem(ANAHTAR, JSON.stringify(veri)); return true; }
    catch (e) { return false; }
  }

  function sifirla() { try { localStorage.removeItem(ANAHTAR); } catch (e) { /* yoksay */ } }

  function para(n) {
    return new Intl.NumberFormat("tr-TR").format(Number(n) || 0) + " ₺";
  }

  function ikonSvg(id, boyut) {
    const a = ALLERGENS.find(x => x.id === id);
    if (!a) return "";
    const b = boyut || 28;
    return '<span class="alerjen-ikon" title="' + a.ad + '" style="background:' + a.renk + ';color:' + a.renk + ';width:' + b + 'px;height:' + b + 'px">' +
      '<svg viewBox="0 0 24 24" width="' + (b * 0.7) + '" height="' + (b * 0.7) + '" aria-hidden="true">' + a.ikon + '</svg></span>';
  }

  window.MD = { ALLERGENS, VARSAYILAN, yukle, kaydet, sifirla, para, ikonSvg, kopya, PIN_ANAHTAR };
})();
