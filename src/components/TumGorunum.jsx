import { DERSLER } from "../data/dersler";
import { DONEMLER } from "../data/bolumler";
import { gpaHesapla } from "../utils/hesapla";
import DersListesi from "./DersListesi";
import GpaKarti from "./GpaKarti";

export default function TumGorunum({ fakulteId, bolum, tumNotlar, onNotDegisti }) {
    return (
        <div className="mt-6 space-y-8">
        {DONEMLER.map((donem) => {
            const dersler = DERSLER[fakulteId]?.[bolum]?.[donem] ?? [];
            if (dersler.length === 0) return null; // veri yoksa hiç gösterme, kalabalık etmesin

            const notlar = tumNotlar[donem] ?? {};
            const sonuc  = gpaHesapla(dersler, notlar);

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
    );
}