import { gpaHesapla, kumulatifGpaHesapla } from "../utils/hesapla";
import { gpaDurumu } from "../utils/renkler";

export default function KumulatifGpa({ donemVerileri }) {
    if (!donemVerileri || donemVerileri.length === 0) return null;
    const kumSonuc = kumulatifGpaHesapla(donemVerileri);
    if (!kumSonuc) return null;

    const { text, bg, border, etiket } = gpaDurumu(kumSonuc.gpa);

    return (
        <div className="mt-10">
        <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 whitespace-nowrap">
            Kümülatif Ortalama
            </span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="mb-4 space-y-1.5">
            {donemVerileri.map(({ donem, dersler, notlar }) => {
            const sonuc = gpaHesapla(dersler, notlar);
            if (!sonuc) return null;
            const { text: dText } = gpaDurumu(sonuc.gpa);
            return (
                <div key={donem}
                className="flex justify-between items-center px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm shadow-sm transition-colors duration-200">
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {donem}. Dönem
                    <span className="text-gray-400 dark:text-gray-500 font-normal ml-2 text-xs">
                    {sonuc.girilenDersSayisi} ders · {sonuc.toplamKredi} kredi
                    </span>
                </span>
                <span className={`font-mono text-base font-bold tabular-nums ${dText}`}>{sonuc.gpa}</span>
                </div>
            );
            })}
        </div>

        <div className={`rounded-2xl border-t-4 ${border} ${bg} p-6 shadow-sm transition-colors duration-200`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
                <div className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-1">
                Genel Ortalama · {kumSonuc.donemSayisi} Dönem
                </div>
                <div className={`font-mono text-6xl font-bold leading-none tracking-tight tabular-nums ${text}`}>
                {kumSonuc.gpa}
                </div>
                <div className={`text-sm font-bold mt-2 ${text}`}>{etiket}</div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 leading-loose">
                <div>Toplam <strong className="text-gray-800 dark:text-gray-200 tabular-nums">{kumSonuc.toplamKredi}</strong> kredi</div>
                <div>Toplam <strong className="text-gray-800 dark:text-gray-200 tabular-nums">{kumSonuc.toplamDers}</strong> ders</div>
            </div>
            </div>
        </div>
        </div>
    );
}