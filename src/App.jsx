import { useState, useEffect } from "react";
import { FAKULTELER, DONEMLER } from "./data/bolumler";
import { DERSLER } from "./data/dersler";
import DersListesi from "./components/DersListesi";
import { gpaHesapla } from "./utils/hesapla";
import GpaKarti from "./components/GpaKarti";
import KumulatifGpa from "./components/KumulatifGpa";
import styles from "./App.module.css";


function localKey(fid, bolum, donem) {
  return `ytugpa_${fid}_${encodeURIComponent(bolum)}_${donem}`;
}

// ── Dropdown ────────────────────────────────────────────────────────────────
function Dropdown({ label, value, onChange, options, disabled }) {
  return (
    <div className={styles.dropdownSarti}>
      <label className={styles.dropdownLabel}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={styles.dropdownSelect}
      >
        <option value="">{disabled ? "— önce üstü seç —" : "— seçiniz —"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Ana bileşen ──────────────────────────────────────────────────────────────
export default function App() {
  const [secilenFakulteId, setSecilenFakulteId] = useState("");
  const [secilenBolum, setSecilenBolum]         = useState("");
  const [secilenDonem, setSecilenDonem]         = useState("");
  const [notlar, setNotlar]                     = useState({});
  const [donemVerileri, setDonemVerileri]       = useState([]);

  const secilenFakulte = FAKULTELER.find((f) => f.id === secilenFakulteId);

  function fakulteDegisti(yeniId) {
    setSecilenFakulteId(yeniId);
    setSecilenBolum("");
    setSecilenDonem("");
  }
  function bolumDegisti(yeniBolum) {
    setSecilenBolum(yeniBolum);
    setSecilenDonem("");
  }
  function donemDegisti(yeniDonem) { setSecilenDonem(yeniDonem); }

  function notDegisti(dersKodu, yeniNot) {
    setNotlar((onceki) => {
      const yeni = { ...onceki };
      if (yeniNot) { yeni[dersKodu] = yeniNot; }
      else         { delete yeni[dersKodu]; }
      const key = localKey(secilenFakulteId, secilenBolum, secilenDonem);
      localStorage.setItem(key, JSON.stringify(yeni));
      return yeni;
    });
  }

  function notlariTemizle() {
    const key = localKey(secilenFakulteId, secilenBolum, secilenDonem);
    localStorage.removeItem(key);
    setNotlar({});
  }

  const dersler =
    secilenFakulteId && secilenBolum && secilenDonem
      ? (DERSLER[secilenFakulteId]?.[secilenBolum]?.[Number(secilenDonem)] ?? [])
      : null;

  const fakulteOptions = FAKULTELER.map((f) => ({ value: f.id,  label: f.isim }));
  const bolumOptions   = secilenFakulte
  ? secilenFakulte.bolumler.map((b) => ({
    value: b,
    label: b
      .replace('(%100 Türkçe)', '🇹🇷')
      .replace('(%30 İngilizce)', '(%30 İng)')
      .replace('(%100 İngilizce)', '(%100 İng)'),
  }))
  : [];
  const donemOptions = DONEMLER.map((d) => ({ value: String(d), label: `${d}. Dönem` }));

  const gpasonucu = dersler ? gpaHesapla(dersler, notlar) : null;

  useEffect(() => {
    if (!secilenFakulteId || !secilenBolum || !secilenDonem) {
      setNotlar({});
      return;
    }
    const key = localKey(secilenFakulteId, secilenBolum, secilenDonem);
    const kayitli = localStorage.getItem(key);
    setNotlar(kayitli ? JSON.parse(kayitli) : {});
  }, [secilenFakulteId, secilenBolum, secilenDonem]);

  useEffect(() => {
    if (!secilenFakulteId || !secilenBolum) { setDonemVerileri([]); return; }
    const veriler = [];
    for (const donem of DONEMLER) {
      const key = localKey(secilenFakulteId, secilenBolum, donem);
      const kayitli = localStorage.getItem(key);
      if (!kayitli) continue;
      const kayitliNotlar = JSON.parse(kayitli);
      const dersListe = DERSLER[secilenFakulteId]?.[secilenBolum]?.[donem] ?? [];
      if (Object.keys(kayitliNotlar).length > 0 && dersListe.length > 0) {
        veriler.push({ donem, dersler: dersListe, notlar: kayitliNotlar });
      }
    }
    setDonemVerileri(veriler);
  }, [secilenFakulteId, secilenBolum, notlar]);

  return (
    <>
      {/* Header — sayfa dışında, tam genişlikte */}
      <header className={styles.header}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px" }}>
          <h1 className={styles.baslik}>YTÜ GPA Hesaplayıcı</h1>
          <p className={styles.altbaslik}>
            Bölümünü seç · notlarını gir · ortalamana bak
          </p>
        </div>
      </header>

      <main className={styles.sayfa}>
        {/* Seçiciler */}
        <div className={styles.seciciSatir}>
          <div className={styles.seciciGenis}>
            <Dropdown label="Fakülte" value={secilenFakulteId}
              onChange={fakulteDegisti} options={fakulteOptions} />
          </div>
          <div className={styles.seciciGenis}>
            <Dropdown label="Bölüm" value={secilenBolum}
              onChange={bolumDegisti} options={bolumOptions}
              disabled={!secilenFakulteId} />
          </div>
          <div className={styles.seciciDar}>
            <Dropdown label="Dönem" value={secilenDonem}
              onChange={donemDegisti} options={donemOptions}
              disabled={!secilenBolum} />
          </div>
        </div>

        {/* İçerik */}
        {dersler !== null && (
          <>
            <DersListesi dersler={dersler} notlar={notlar} onNotDegisti={notDegisti} donem = {secilenDonem} />
            <GpaKarti sonuc={gpasonucu} />
            {Object.keys(notlar).length > 0 && (
              <button onClick={notlariTemizle} className={styles.temizleBtn}>
                Notları Temizle
              </button>
            )}
            <KumulatifGpa donemVerileri={donemVerileri} />
          </>
        )}
      </main>
    </>
  );
}