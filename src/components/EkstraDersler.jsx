import { useState, useMemo } from "react";
import { dersHavuzuGetir } from "../utils/dersHavuzu";
import { gpaHesapla } from "../utils/hesapla";
import { HARF_NOTLARI } from "../data/dersler";
import GpaKarti from "./GpaKarti";
import { ekstraAnahtar } from "../utils/ekstra";




export default function EkstraDersler({
    fakulteId, bolum, tumNotlar, ekstraDersler,
    onEkstraEkle, onEkstraNotDegisti, onEkstraSil,
}) {
    const [arama, setArama] = useState("");

    const havuz = useMemo(() => dersHavuzuGetir(fakulteId, bolum), [fakulteId, bolum]);

    const eklenebilirler = useMemo(() => {
    if (arama.trim().length < 2) return [];
    const q = arama.trim().toLocaleLowerCase("tr");
    return havuz
        .filter((d) => {
        const anahtar = ekstraAnahtar(d.kod, d.donem);
        const zatenEkstra   = anahtar in ekstraDersler;
        const zatenNormalde = Boolean(tumNotlar[d.donem]?.[d.kod]);
        if (zatenEkstra || zatenNormalde) return false;
        return (
            d.kod.toLocaleLowerCase("tr").includes(q) ||
            d.ad.toLocaleLowerCase("tr").includes(q)
        );
        })
        .slice(0, 6);
    }, [arama, havuz, ekstraDersler, tumNotlar]);


    const eklenenAnahtarlar = Object.keys(ekstraDersler);
    const eklenenDersler = havuz.filter((d) =>
        eklenenAnahtarlar.includes(ekstraAnahtar(d.kod, d.donem))
    );

    
    const ekstraNotlarKodBazli = Object.fromEntries(
        eklenenDersler.map((d) => [d.kod, ekstraDersler[ekstraAnahtar(d.kod, d.donem)]])
    );
    const ekstraSonuc = eklenenDersler.length > 0
    ? gpaHesapla(eklenenDersler, ekstraNotlarKodBazli)
    : null;

    return (
        <div className="mt-10">
        <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 whitespace-nowrap">
            Ekstra Dersler
            </span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Sırasının dışında (başka dönemden erken) aldığın dersler burada —
            dönem ortalamasına karışmaz, sadece kümülatife eklenir.
        </p>

        <div className="relative mb-3">
            <input
            type="text"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder="Ders kodu veya adıyla ara…"
            className="w-full px-3.5 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-ytu-red focus:ring-2 focus:ring-ytu-red/10"
            />
            {eklenebilirler.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden">
                {eklenebilirler.map((d) => (
                <button
                    key={ekstraAnahtar(d.kod, d.donem)}
                    onClick={() => { onEkstraEkle(d.kod, d.donem); setArama(""); }}
                    className="w-full text-left px-3.5 py-2.5 text-sm hover:bg-ytu-light dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                    <span className="text-gray-700 dark:text-gray-200">
                    <span className="font-mono text-xs text-gray-400 dark:text-gray-500 mr-2">{d.kod}</span>
                    {d.ad}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{d.donem}. Dönem</span>
                </button>
                ))}
            </div>
            )}
        </div>

        {eklenenDersler.length > 0 ? (
            <>
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800">
                    <tr>
                    <th className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-left whitespace-nowrap">Kod</th>
                    <th className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-left">Ders Adı</th>
                    <th className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-center">Kredi</th>
                    <th className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-center">Not</th>
                    <th className="px-3.5 py-2.5"></th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900">
                    {eklenenDersler.map((ders) => {
                    const anahtar = ekstraAnahtar(ders.kod, ders.donem);
                    const secilenNot = ekstraDersler[anahtar] || "";
                    return (
                        <tr key={anahtar} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                        <td className="px-3.5 py-2.5 font-mono text-xs text-gray-400 dark:text-gray-500">{ders.kod}</td>
                        <td className="px-3.5 py-2.5 text-gray-700 dark:text-gray-200">
                            {ders.ad}
                            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">({ders.donem}. Dönem dersi)</span>
                        </td>
                        <td className="px-3.5 py-2.5 text-center text-gray-700 dark:text-gray-300 tabular-nums">{ders.kredi}</td>
                        <td className="px-3.5 py-2.5 text-center">
                            <select
                            value={secilenNot}
                            onChange={(e) => onEkstraNotDegisti(ders.kod, ders.donem, e.target.value)}
                            className={`${secilenNot ? `not-${secilenNot}` : "bg-white dark:bg-gray-800"} font-mono w-[70px] px-2 py-1 border-2 border-gray-200 dark:border-gray-700 rounded-md text-xs font-bold cursor-pointer focus:outline-none focus:border-ytu-red text-gray-800 dark:text-gray-100`}
                            >
                            <option value="">—</option>
                            {HARF_NOTLARI.map((n) => (
                                <option key={n.harf} value={n.harf}>{n.harf}</option>
                            ))}
                            </select>
                        </td>
                        <td className="px-3.5 py-2.5 text-center">
                            <button
                            onClick={() => onEkstraSil(ders.kod, ders.donem)}
                            aria-label={`${ders.kod} dersini kaldır`}
                            className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                            ✕
                            </button>
                        </td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
            </div>
            <GpaKarti sonuc={ekstraSonuc} baslik="Ekstra Ders Ortalaması" />
            </>
        ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
            Henüz ekstra ders eklenmedi.
            </p>
        )}
        </div>
    );
}