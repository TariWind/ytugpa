import DersListesi from "./DersListesi";
import GpaKarti from "./GpaKarti";

export default function DonemGorunumu({ dersler, notlar, onNotDegisti, donem, gpasonucu, notlariTemizle }) {
    return (
        <>
        <DersListesi
            dersler={dersler} notlar={notlar}
            onNotDegisti={(kod, yeniNot) => onNotDegisti(donem, kod, yeniNot)}
            donem={donem}
        />
        <GpaKarti sonuc={gpasonucu} />
        {Object.keys(notlar).length > 0 && (
            <button
            onClick={() => notlariTemizle(donem)}
            className="mt-3 px-4 py-2 border-2 border-red-200 dark:border-red-900 rounded-lg bg-white dark:bg-gray-900 text-red-500 dark:text-red-400 text-xs font-semibold cursor-pointer transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
            >
            Notları Temizle
            </button>
        )}
        </>
    );
}