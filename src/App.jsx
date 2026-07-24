import { useState, useEffect } from "react";
import { FAKULTELER, DONEMLER } from "./data/bolumler";
import { DERSLER } from "./data/dersler";
import { gpaHesapla } from "./utils/hesapla";
import { dersHavuzuGetir } from "./utils/dersHavuzu";
import DonemGorunumu from "./components/DonemGorunumu";
import SinifGorunumu from "./components/SinifGorunumu";
import TumGorunum from "./components/TumGorunum";
import EkstraDersler from "./components/EkstraDersler";
import KumulatifGpa from "./components/KumulatifGpa";
import GorunumToggle from "./components/GorunumToggle";
import TemaToggle from "./components/TemaToggle";
import AramaTetikleyici from "./components/AramaTetikleyici";
import DersAramaModal from "./components/DersAramaModal";
import { useDarkMode } from "./hooks/useDarkMode";
import { ekstraAnahtar } from "./utils/ekstra";

function localKey(fid, bolum, donem) {
  return `ytugpa_${fid}_${encodeURIComponent(bolum)}_${donem}`;
}
function ekstraKey(fid, bolum) {
  return `ytugpa_ekstra_${fid}_${encodeURIComponent(bolum)}`;
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
  const [ekstraDersler, setEkstraDersler]       = useState({}); // { "kod::donem": harf }
  const [gorunumModu, setGorunumModu]           = useState(() => localStorage.getItem("ytugpa_gorunum") || "donem");


  const [aramaAcik, setAramaAcik] = useState(false);
  const [vurgulananKod, setVurgulananKod] = useState(null);

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
      localStorage.setItem(localKey(secilenFakulteId, secilenBolum, donem), JSON.stringify(buDonem));
      return { ...onceki, [donem]: buDonem };
    });
  }

  function notlariTemizle(donem) {
    localStorage.removeItem(localKey(secilenFakulteId, secilenBolum, donem));
    setTumNotlar((onceki) => {
      const yeni = { ...onceki };
      delete yeni[donem];
      return yeni;
    });
  }

  
  function ekstraEkle(kod, donem) {
    setEkstraDersler((onceki) => {
      const yeni = { ...onceki, [ekstraAnahtar(kod, donem)]: "" };
      localStorage.setItem(ekstraKey(secilenFakulteId, secilenBolum), JSON.stringify(yeni));
      return yeni;
    });
  }
  function ekstraNotDegisti(kod, donem, yeniNot) {
    setEkstraDersler((onceki) => {
      const yeni = { ...onceki, [ekstraAnahtar(kod, donem)]: yeniNot };
      localStorage.setItem(ekstraKey(secilenFakulteId, secilenBolum), JSON.stringify(yeni));
      return yeni;
    });
  }
  function ekstraSil(kod, donem) {
    setEkstraDersler((onceki) => {
      const yeni = { ...onceki };
      delete yeni[ekstraAnahtar(kod, donem)];
      localStorage.setItem(ekstraKey(secilenFakulteId, secilenBolum), JSON.stringify(yeni));
      return yeni;
    });
  }
  
  
  function dersSecildi(sonuc) {
    setSecilenFakulteId(sonuc.fakulteId);
    setSecilenBolum(sonuc.bolum);
    setSecilenDonem(String(sonuc.donem));
    setGorunumModu("donem");
    localStorage.setItem("ytugpa_gorunum", "donem");
    setAramaAcik(false);
    setVurgulananKod(sonuc.kod);
    setTimeout(() => setVurgulananKod(null), 2200);
  }

  useEffect(() => {
    if (!secilenFakulteId || !secilenBolum) {
      setTumNotlar({});
      setEkstraDersler({});
      return;
    }
    const yukle = {};
    for (const donem of DONEMLER) {
      const kayitli = localStorage.getItem(localKey(secilenFakulteId, secilenBolum, donem));
      if (kayitli) yukle[donem] = JSON.parse(kayitli);
    }
    setTumNotlar(yukle);

    const ekstraKayitli = localStorage.getItem(ekstraKey(secilenFakulteId, secilenBolum));
    setEkstraDersler(ekstraKayitli ? JSON.parse(ekstraKayitli) : {});
  }, [secilenFakulteId, secilenBolum]);


  useEffect(() => {
    function kisayolDinle(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAramaAcik(true);
      }
    }
    document.addEventListener("keydown", kisayolDinle);
    return () => document.removeEventListener("keydown", kisayolDinle);
  }, []);

  const dersler =
    secilenFakulteId && secilenBolum && secilenDonem
      ? (DERSLER[secilenFakulteId]?.[secilenBolum]?.[Number(secilenDonem)] ?? [])
      : null;

  const donemNotlari = tumNotlar[Number(secilenDonem)] ?? {};
  const gpasonucu = dersler ? gpaHesapla(dersler, donemNotlari) : null;

  
  const havuzTumu = (secilenFakulteId && secilenBolum) ? dersHavuzuGetir(secilenFakulteId, secilenBolum) : [];
  const ekstraAnahtarlari = Object.keys(ekstraDersler);
  const ekstraDersListesi = havuzTumu.filter((d) =>
    ekstraAnahtarlari.includes(ekstraAnahtar(d.kod, d.donem))
  );

  
  const ekstraNotlarKodBazli = Object.fromEntries(
    ekstraDersListesi.map((d) => [d.kod, ekstraDersler[ekstraAnahtar(d.kod, d.donem)]])
  );

  
  const donemVerileri = (secilenFakulteId && secilenBolum)
    ? [
        ...DONEMLER
          .map((donem) => {
            const dl = DERSLER[secilenFakulteId]?.[secilenBolum]?.[donem] ?? [];
            const nt = tumNotlar[donem] ?? {};
            if (dl.length === 0 || Object.keys(nt).length === 0) return null;
            return { donem, dersler: dl, notlar: nt };
          })
          .filter(Boolean),
        ...(ekstraDersListesi.length > 0
          ? [{ etiket: "Ekstra Dersler", dersler: ekstraDersListesi, notlar: ekstraNotlarKodBazli }]
          : []),
      ]
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
          <div className = "flex items-center gap-2">
            <AramaTetikleyici onClick = {() => setAramaAcik(true)} />
            <TemaToggle karanlik={karanlik} onToggle={setKaranlik} />
          </div>
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
                ekstraDersler = {ekstraDersler}
                vurgulananKod = {vurgulananKod}
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
                ekstraDersler = {ekstraDersler}
              />
            )}
            {gorunumModu === "tumu" && (
              <TumGorunum
                fakulteId={secilenFakulteId} bolum={secilenBolum}
                tumNotlar={tumNotlar} onNotDegisti={notDegisti}
                ekstraDersler = {ekstraDersler}
              />
            )}

            <EkstraDersler
              fakulteId={secilenFakulteId} bolum={secilenBolum}
              tumNotlar={tumNotlar} ekstraDersler={ekstraDersler}
              onEkstraEkle={ekstraEkle}
              onEkstraNotDegisti={ekstraNotDegisti}
              onEkstraSil={ekstraSil}
            />

            <KumulatifGpa donemVerileri={donemVerileri} />
          </>
        )}


        {!bolumSecili && (
          <div className = "mt-10 text-center">
            <p className = "text-sm text-gray-400 dark:text-gray-500 mb-3">
              Bölümünü seçmeden dersi doğrudan arayabilirsin.
            </p>
            <button
              onClick = {() => setAramaAcik(true)}
              className = "text-sm font-semibold text-ytu-red dark:text-red-400 hover:underline"
            >
              Ders ara →
            </button>
          </div>
        )}
      </main>


      <DersAramaModal
        acik = {aramaAcik}
        onKapat = {() => setAramaAcik(false)}
        onSecim = {dersSecildi}
      />
    </>
  );
}