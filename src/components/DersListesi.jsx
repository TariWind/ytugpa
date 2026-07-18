import { HARF_NOTLARI } from "../data/dersler";

export default function DersListesi({ dersler, notlar, onNotDegisti, donem }) {
    if (!dersler || dersler.length === 0) {
        return (
        <div className="mt-6 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400 text-sm">
            ⚠ <strong>{donem}. dönem</strong> için Bologna'da ders verisi bulunamadı.
        </div>
        );
    }

    return (
        <div className="mt-7 overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-colors duration-200">
        <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800">
            <tr>
                <th className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-left whitespace-nowrap">Kod</th>
                <th className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-left">Ders Adı</th>
                <th className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-center">Kredi</th>
                <th className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-center">AKTS</th>
                <th className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-center">Not</th>
            </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
            {dersler.map((ders) => {
                const secilenNot = notlar[ders.kod] || "";
                return (
                <tr key={ders.kod}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-ytu-light dark:hover:bg-gray-800/60 transition-colors duration-100">
                    <td className="px-3.5 py-2.5 font-mono text-xs text-gray-400 dark:text-gray-500">{ders.kod}</td>
                    <td className="px-3.5 py-2.5 text-gray-700 dark:text-gray-200">{ders.ad}</td>
                    <td className="px-3.5 py-2.5 text-center text-gray-700 dark:text-gray-300 tabular-nums">{ders.kredi}</td>
                    <td className="px-3.5 py-2.5 text-center text-gray-700 dark:text-gray-300 tabular-nums">{ders.akts}</td>
                    <td className="px-3.5 py-2.5 text-center">
                    <select
                        value={secilenNot}
                        onChange={(e) => onNotDegisti(ders.kod, e.target.value)}
                        className={`${secilenNot ? `not-${secilenNot}` : "bg-white dark:bg-gray-800"} font-mono w-[70px] px-2 py-1 border-2 border-gray-200 dark:border-gray-700 rounded-md text-xs font-bold cursor-pointer transition-all focus:outline-none focus:border-ytu-red text-gray-800 dark:text-gray-100`}
                    >
                        <option value="">—</option>
                        {HARF_NOTLARI.map((n) => (
                        <option key={n.harf} value={n.harf}>{n.harf}</option>
                        ))}
                    </select>
                    </td>
                </tr>
                );
            })}
            </tbody>
        </table>
        </div>
    );
}