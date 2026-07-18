import { gpaDurumu } from "../utils/renkler";

export default function GpaKarti({ sonuc }) {
    if (!sonuc) return null;

    const { gpa, toplamKredi, girilenDersSayisi, toplamDersSayisi } = sonuc;
    const { text, bg, border, etiket } = gpaDurumu(gpa);
    const tamMi = girilenDersSayisi === toplamDersSayisi;

    return (
        <div className={`mt-5 rounded-2xl border-t-4 ${border} ${bg} p-6 shadow-sm transition-colors duration-200`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
            <div className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-1">
                Dönem Ortalaması
            </div>
            <div className={`font-mono text-6xl font-bold leading-none tracking-tight tabular-nums ${text}`}>
                {gpa}
            </div>
            <div className={`text-sm font-bold mt-2 ${text}`}>{etiket}</div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 leading-loose">
            <div>
                <strong className="text-gray-800 dark:text-gray-200 tabular-nums">{girilenDersSayisi}</strong>
                <span className="text-gray-400 dark:text-gray-500">/{toplamDersSayisi}</span> ders girildi
                {tamMi && <span className={`ml-1 ${text}`}>✓</span>}
            </div>
            <div>
                <strong className="text-gray-800 dark:text-gray-200 tabular-nums">{toplamKredi}</strong> kredi hesaplandı
            </div>
            </div>
        </div>

        {!tamMi && (
            <div className="mt-4 pt-3 border-t border-gray-200/70 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500">
            ⚠ Tüm notlar girildiğinde sonuç kesinleşir
            </div>
        )}
        </div>
    );
}