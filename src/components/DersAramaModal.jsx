import { useState, useMemo, useEffect, useRef } from "react";
import { TUM_DERS_HAVUZU } from "../utils/dersHavuzu";


function eslesmeSkoru(ders, q) {
    const kod = ders.kod.toLocaleLowerCase("tr");
    const ad = ders.ad.toLocaleLowerCase("tr");
    if (kod === q) return 0;
    if (kod.startsWith(q)) return 1;
    if (ad.startsWith(q)) return 2;
    if (kod.includes(q)) return 3;
    if (ad.includes(q)) return 4;
    return 99;
}


export default function DersAramaModal({ acik, onKapat, onSecim }) {
    const [sorgu, setSorgu] = useState("");
    const inputRef = useRef(null);


    useEffect(() => {
        if (acik) {
            setSorgu("");


            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [acik]);


    useEffect(() => {
        function escDinle(e) {
            if (e.key === "Escape") onKapat();
        }
        if (acik) document.addEventListener("keydown", escDinle);
        return () => document.removeEventListener("keydown", escDinle);
    }, [acik, onKapat]);


    const sonuclar = useMemo(() => {
        const q = sorgu.trim().toLocaleLowerCase("tr");
        if (q.length < 2) return [];
        return TUM_DERS_HAVUZU
            .map((d) => ({ d, skor: eslesmeSkoru(d, q) }))
            .filter((x) => x.skor < 99)
            .sort((a, b) => a.skor - b.skor)
            .slice(0, 20)
            .map((x) => x.d);
    }, [sorgu]);


    if (!acik) return null;


    return (
        <div
            className = "fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-sm"
            onClick = {onKapat}
        >
            <div
                className = "w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden"
                onClick = {(e) => e.stopPropagation()}
            >
                <div className = "flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                    <svg width = "18" height = "18" viewBox = "0 0 24 24" fill = "none" stroke = "currentColor" strokeWidth = "2" strokeLineCap = "round" className = "text-gray-400 dark:text-gray-500 shrink-0">
                        <circle cx = "11" cy = "11" r = "7" />
                        <path d = "M21 21l-4.3-4.3" />
                    </svg>
                    <input
                        ref = {inputRef}
                        type = "text"
                        value = {sorgu}
                        onChange = {(e) => setSorgu(e.target.value)}
                        placeholder = "Tüm YTÜ kataloğunda ara — kod veya ders adı..."
                        className = "flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                    />
                    <kbd className = "hidden sm:block text-[10px] font-mono text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5">
                        Esc
                    </kbd>
                </div>


                <div className = "max-h-80 overflow-y-auto">
                    {sorgu.trim().length < 2 ? (
                        <p className = "px-4 py-8 text-sm text-gray-400 dark:text-gray-500 text-center">
                            Aramak için en az 2 karakter yaz
                        </p>
                    ) : sonuclar.length === 0 ? (
                        <p className = "px-4 py-8 text-sm text-gray-400 dark:text-gray-500 text-center">
                            "{sorgu}" için sonuç bulunamadı
                        </p>
                    ) : (
                        sonuclar.map((d) => (
                            <button
                                key = {`${d.fakulteId}-${d.bolum}-${d.donem}-${d.kod}`}
                                onClick = {() => onSecim(d)}
                                className = "w-full text-left px-4 py-2.5 hover:bg-ytu-light dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 flex items-center justify-between gap-3"
                            >
                                <div className = "min-w-0">
                                    <div className = "text-sm text-gray-800 dark:text-gray-100 truncate">
                                        <span className = "font-mono text-xs text-ytu-red dark:text-red-400 mr-2">{d.kod}</span>
                                        {d.ad}
                                    </div>
                                    <div className = "text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                                        {d.bolum} · {d.donem}. Dönem
                                    </div>
                                </div>
                                <span className = "text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0">
                                    {d.kredi} kredi
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}