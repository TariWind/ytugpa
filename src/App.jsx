import { useState, useEffect } from "react";
import { FAKULTELER, DONEMLER } from "./data/bolumler";
import { DERSLER } from "./data/dersler";
import DersListesi from "./components/DersListesi";
import { gpaHesapla } from "./utils/hesapla";
import GpaKarti from "./components/GpaKarti";
import KumulatifGpa from "./components/KumulatifGpa";
// ← import styles satırı silindi

function localKey(fid, bolum, donem) {
  return `ytugpa_${fid}_${encodeURIComponent(bolum)}_${donem}`;
}

function Dropdown({ label, value, onChange, options, disabled }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="dropdown-select w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white text-gray-900 cursor-pointer transition-all duration-150 focus:outline-none focus:border-ytu-red focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        <option value="">{disabled ? "— önce üstü seç —" : "— seçiniz —"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

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

  const fakulteOptions = FAKULTELER.map((f) => ({ value: f.id, label: f.isim }));
  const bolumOptions   = secilenFakulte
    ? secilenFakulte.bolumler.map((b) => ({
        value: b,
        label: b
          .replace("(%100 Türkçe)",   "🇹🇷")
          .replace("(%30 İngilizce)",  "(%30 İng)")
          .replace("(%100 İngilizce)", "(%100 İng)"),
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
      if (Object.keys(kayitliNotlar).length > 0 && dersListe.length > 0)
        veriler.push({ donem, dersler: dersListe, notlar: kayitliNotlar });
    }
    setDonemVerileri(veriler);
  }, [secilenFakulteId, secilenBolum, notlar]);

  return (
    <>
      <header className="bg-ytu-red text-white px-6 py-7 rounded-b-2xl mb-9 shadow-md">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">
            YTÜ GPA Hesaplayıcı
          </h1>
          <p className="text-sm opacity-80">
            Bölümünü seç · notlarını gir · ortalamana bak
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-20">
        <div className="flex gap-3 flex-wrap mb-6">
          <div className="flex-[2_1_200px]">
            <Dropdown label="Fakülte" value={secilenFakulteId}
              onChange={fakulteDegisti} options={fakulteOptions} />
          </div>
          <div className="flex-[2_1_200px]">
            <Dropdown label="Bölüm" value={secilenBolum}
              onChange={bolumDegisti} options={bolumOptions}
              disabled={!secilenFakulteId} />
          </div>
          <div className="flex-[1_1_120px]">
            <Dropdown label="Dönem" value={secilenDonem}
              onChange={donemDegisti} options={donemOptions}
              disabled={!secilenBolum} />
          </div>
        </div>

        {dersler !== null && (
          <>
            <DersListesi
              dersler={dersler} notlar={notlar}
              onNotDegisti={notDegisti} donem={secilenDonem}
            />
            <GpaKarti sonuc={gpasonucu} />
            {Object.keys(notlar).length > 0 && (
              <button
                onClick={notlariTemizle}
                className="mt-3 px-4 py-2 border-2 border-red-200 rounded-lg bg-white text-red-500 text-xs font-semibold cursor-pointer transition-colors hover:bg-red-50"
              >
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
