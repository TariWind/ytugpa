export default function GorunumToggle({ mod, onChange }) {
    const secenekler = [
        { value: "donem", label: "Dönem" },
        { value: "sinif",  label: "Sınıf" },
        { value: "tumu",   label: "Tümü" },
    ];

    return (
        <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg gap-1">
        {secenekler.map((s) => (
            <button
            key={s.value}
            onClick={() => onChange(s.value)}
            aria-pressed={mod === s.value}
            className={`px-3.5 py-1.5 rounded-md text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ytu-red/40 ${
                mod === s.value
                ? "bg-white dark:bg-gray-700 text-ytu-red dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
            >
            {s.label}
            </button>
        ))}
        </div>
    );
}