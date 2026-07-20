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
  const [tumNotlar, setTumNotlar]               = useState({}); 
  const [gorunumModu, setGorunumModu]           = useState(() => localStorage.getItem("ytugpa_gorunum") || "donem");

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

  function gorunumDegisti(yeniMod) {
    setGorunumModu(yeniMod);
    localStorage.setItem("ytugpa_gorunum", yeniMod);
  }

  
  function notDegisti(donem, dersKodu, yeniNot) {
    setTumNotlar((onceki) => {
      const buDonem = { ...(onceki[donem] || {}) };
      if (yeniNot) { buDonem[dersKodu] = yeniNot; }
      else         { delete buDonem[dersKodu]; }

      const key = localKey(secilenFakulteId, secilenBolum, donem);
      localStorage.setItem(key, JSON.stringify(buDonem));

      return { ...onceki, [donem]: buDonem };
    });
  }

  function notlariTemizle(donem) {
    const key = localKey(secilenFakulteId, secilenBolum, donem);
    localStorage.removeItem(key);
    setTumNotlar((onceki) => {
      const yeni = { ...onceki };
      delete yeni[donem];
      return yeni;
    });
  }

  
  useEffect(() => {
    if (!secilenFakulteId || !secilenBolum) {
      setTumNotlar({});
      return;
    }
    const yukle = {};
    for (const donem of DONEMLER) {
      const key = localKey(secilenFakulteId, secilenBolum, donem);
      const kayitli = localStorage.getItem(key);
      if (kayitli) yukle[donem] = JSON.parse(kayitli);
    }
    setTumNotlar(yukle);
  }, [secilenFakulteId, secilenBolum]);

  const dersler =
    secilenFakulteId && secilenBolum && secilenDonem
      ? (DERSLER[secilenFakulteId]?.[secilenBolum]?.[Number(secilenDonem)] ?? [])
      : null;

  const donemNotlari = tumNotlar[Number(secilenDonem)] ?? {};
  const gpasonucu = dersler ? gpaHesapla(dersler, donemNotlari) : null;

  const donemVerileri = (secilenFakulteId && secilenBolum)
    ? DONEMLER
        .map((donem) => {
          const dl = DERSLER[secilenFakulteId]?.[secilenBolum]?.[donem] ?? [];
          const nt = tumNotlar[donem] ?? {};
          if (dl.length === 0 || Object.keys(nt).length === 0) return null;
          return { donem, dersler: dl, notlar: nt };
        })
        .filter(Boolean)
    : [];

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

          <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Görünüm
            </span>
            <GorunumToggle mod={gorunumModu} onChange={gorunumDegisti} />
          </div>

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
                dersler={dersler} notlar={donemNotlari}
                onNotDegisti={notDegisti} donem={Number(secilenDonem)}
                gpasonucu={gpasonucu} notlariTemizle={notlariTemizle}
              />
            )}
            {gorunumModu === "donem" && dersler === null && (
              <div className="mt-8 text-sm text-gray-400 dark:text-gray-500 text-center py-6">
                Görmek istediğin dönemi seç.
              </div>
            )}
            {gorunumModu === "sinif" && (
              <SinifGorunumu
                fakulteId={secilenFakulteId} bolum={secilenBolum}
                tumNotlar={tumNotlar} onNotDegisti={notDegisti}
              />
            )}
            {gorunumModu === "tumu" && (
              <TumGorunum
                fakulteId={secilenFakulteId} bolum={secilenBolum}
                tumNotlar={tumNotlar} onNotDegisti={notDegisti}
              />
            )}

            <KumulatifGpa donemVerileri={donemVerileri} />
          </>
        )}
      </main>
    </>
  );
}