import { useState } from "react";
import { DERSLER } from "../data/dersler";
import { gpaHesapla } from "../utils/hesapla";
import DersListesi from "./DersListesi";
import GpaKarti from "./GpaKarti";

const SINIFLAR = [
    { sinif: 1, donemler: [1, 2] },
    { sinif: 2, donemler: [3, 4] },
    { sinif: 3, donemler: [5, 6] },
    { sinif: 4, donemler: [7, 8] },
];

export default function SinifGorunumu({ fakulteId, bolum, tumNotlar, onNotDegisti }) {
    const [secilenSinif, setSecilenSinif] = useState(1);
    const aktif = SINIFLAR.find((s) => s.sinif === secilenSinif);

    return (
        <div className="mt-6">
        <div className="flex gap-2 mb-6">
            {SINIFLAR.map((s) => (
            <button
                key={s.sinif}
                onClick={() => setSecilenSinif(s.sinif)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                secilenSinif === s.sinif
                    ? "bg-ytu-red text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
                {s.sinif}. Sınıf
            </button>
            ))}
        </div>

        <div className="space-y-8">
            {aktif.donemler.map((donem) => {
            const dersler = DERSLER[fakulteId]?.[bolum]?.[donem] ?? [];
            const notlar  = tumNotlar[donem] ?? {};
            const sonuc   = dersler.length > 0 ? gpaHesapla(dersler, notlar) : null;

            return (
                <div key={donem}>
                <h3 className="font-display font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-ytu-red rounded-full" />
                    {donem}. Dönem
                </h3>
                <DersListesi
                    dersler={dersler}
                    notlar={notlar}
                    onNotDegisti={(kod, yeniNot) => onNotDegisti(donem, kod, yeniNot)}
                    donem={donem}
                />
                <GpaKarti sonuc={sonuc} />
                </div>
            );
            })}
        </div>
        </div>
    );
}