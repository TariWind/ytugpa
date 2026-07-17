import { gpaDurumu } from "../utils/renkler";

export default function GpaKarti({ sonuc }) {
    if (!sonuc) return null;
    const { gpa, toplamKredi, girilenDersSayisi, toplamDersSayisi } = sonuc;
    const { renk, bg, etiket } = gpaDurumu(gpa);
    const tamMi = girilenDersSayisi === toplamDersSayisi;

    return (
        <div
        className="mt-5 px-6 py-5 border-2 rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-sm"
        style={{ background: bg, borderColor: renk }}
        >
        <div>
            <div className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1.5">
            Dönem Ortalaması
            </div>
            <div className="text-5xl font-extrabold leading-none tracking-tighter" style={{ color: renk }}>
            {gpa}
            </div>
            <div className="text-sm font-bold mt-1.5" style={{ color: renk }}>{etiket}</div>
        </div>
        <div className="text-sm text-gray-500 leading-loose">
            <div>
            📚 <strong className="text-gray-700">{girilenDersSayisi}</strong>/{toplamDersSayisi} ders
            {tamMi && <span className="ml-1" style={{ color: renk }}>✓</span>}
            </div>
            <div>📊 <strong className="text-gray-700">{toplamKredi}</strong> kredi</div>
            {!tamMi && (
            <div className="text-xs text-red-400 mt-1">⚠ Tüm notlar girilince kesinleşir</div>
            )}
        </div>
        </div>
    );
}