import { useState, useEffect } from "react";
import { FAKULTELER, DONEMLER } from "./data/bolumler";
import { DERSLER } from "./data/dersler";
import { gpaHesapla } from "./utils/hesapla";
import DonemGorunumu from "./components/DonemGorunumu";
import SinifGorunumu from "./components/SinifGorunumu";
import TumGorunum from "./components/TumGorunum";
import KumulatifGpa from "./components/KumulatifGpa";
import GorunumToggle from "./components/GorunumToggle";
import TemaToggle from "./components/TemaToggle";
import { useDarkMode } from "./hooks/useDarkMode";
function localKey(fid, bolum, donem) {
  return `ytugpa_${fid}_${encodeURIComponent(bolum)}_${donem}`;
}

function Dropdown({ label, value, onChange, options, disabled }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="dropdown-select w-full px-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer transition-all duration-150 focus:outline-none focus:border-ytu-red focus:ring-2 focus:ring-ytu-red/10 disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed"
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
  const [karanlik, setKaranlik] = useDarkMode();

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


  const [gorunumModu, setGorunumModu] = useState(() => {
  return localStorage.getItem("ytugpa_gorunum") || "donem";
});

function gorunumDegisti(yeniMod) {
  setGorunumModu(yeniMod);
  localStorage.setItem("ytugpa_gorunum", yeniMod);
}

  const bolumSecili = Boolean(secilenFakulteId && secilenBolum);

return (
  <>
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-6 bg-ytu-red rounded-full" />
          <div>
            <h1 className="font-display text-base font-bold text-gray-900 dark:text-white leading-tight">
              YTÜ GPA Hesaplayıcı
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">
              Bölümünü seç · notlarını gir · ortalamana bak
            </p>
          </div>
        </div>
        <TemaToggle karanlik={karanlik} onToggle={setKaranlik} />
      </div>
    </header>

    <main className="max-w-3xl mx-auto px-6 pt-8 pb-20">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-200">

        {/* Görünüm modu */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Görünüm
          </span>
          <GorunumToggle mod={gorunumModu} onChange={gorunumDegisti} />
        </div>

        {/* Seçiciler */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-[2_1_200px]">
            <Dropdown label="Fakülte" value={secilenFakulteId}
              onChange={fakulteDegisti} options={fakulteOptions} />
          </div>
          <div className="flex-[2_1_200px]">
            <Dropdown label="Bölüm" value={secilenBolum}
              onChange={bolumDegisti} options={bolumOptions}
              disabled={!secilenFakulteId} />
          </div>
          {gorunumModu === "donem" && (
            <div className="flex-[1_1_120px]">
              <Dropdown label="Dönem" value={secilenDonem}
                onChange={donemDegisti} options={donemOptions}
                disabled={!secilenBolum} />
            </div>
          )}
        </div>
      </div>

      {bolumSecili && (
        <>
          {gorunumModu === "donem" && dersler !== null && (
            <DonemGorunumu
              dersler={dersler} notlar={notlar}
              onNotDegisti={notDegisti} donem={secilenDonem}
              gpasonucu={gpasonucu} notlariTemizle={notlariTemizle}
            />
          )}
          {gorunumModu === "donem" && dersler === null && (
            <div className="mt-8 text-sm text-gray-400 dark:text-gray-500 text-center py-6">
              Görmek istediğin dönemi seç.
            </div>
          )}
          {gorunumModu === "sinif" && (
            <SinifGorunumu fakulteId={secilenFakulteId} bolum={secilenBolum} />
          )}
          {gorunumModu === "tumu" && (
            <TumGorunum fakulteId={secilenFakulteId} bolum={secilenBolum} />
          )}

          <KumulatifGpa donemVerileri={donemVerileri} />
        </>
      )}
    </main>
  </>
);
}