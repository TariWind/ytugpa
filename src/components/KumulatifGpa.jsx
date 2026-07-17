import { gpaHesapla, kumulatifGpaHesapla } from "../utils/hesapla";
import { gpaDurumu } from "../utils/renkler";

export default function KumulatifGpa({ donemVerileri }) {
    if (!donemVerileri || donemVerileri.length === 0) return null;
    const kumSonuc = kumulatifGpaHesapla(donemVerileri);
    if (!kumSonuc) return null;
    const { renk, bg, etiket } = gpaDurumu(kumSonuc.gpa);

    return (
        <div className="mt-10">
        <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400 whitespace-nowrap">
            Kümülatif Ortalama
            </span>
            <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="mb-4 space-y-1.5">
            {donemVerileri.map(({ donem, dersler, notlar }) => {
            const sonuc = gpaHesapla(dersler, notlar);
            if (!sonuc) return null;
            const { renk: dr } = gpaDurumu(sonuc.gpa);
            return (
                <div key={donem}
                className="flex justify-between items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm shadow-sm">
                <span className="font-semibold text-gray-700">
                    {donem}. Dönem
                    <span className="text-gray-400 font-normal ml-2 text-xs">
                    {sonuc.girilenDersSayisi} ders · {sonuc.toplamKredi} kredi
                    </span>
                </span>
                <span className="text-base font-extrabold" style={{ color: dr }}>{sonuc.gpa}</span>
                </div>
            );
            })}
        </div>

        <div
            className="px-6 py-5 border-2 rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-sm"
            style={{ background: bg, borderColor: renk }}
        >
            <div>
            <div className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1.5">
                Genel Ortalama · {kumSonuc.donemSayisi} Dönem
            </div>
            <div className="text-5xl font-extrabold leading-none tracking-tighter" style={{ color: renk }}>
                {kumSonuc.gpa}
            </div>
            <div className="text-sm font-bold mt-1.5" style={{ color: renk }}>{etiket}</div>
            </div>
            <div className="text-sm text-gray-500 leading-loose">
            <div>📊 Toplam <strong className="text-gray-700">{kumSonuc.toplamKredi}</strong> kredi</div>
            <div>📚 Toplam <strong className="text-gray-700">{kumSonuc.toplamDers}</strong> ders</div>
            </div>
        </div>
        </div>
    );
}