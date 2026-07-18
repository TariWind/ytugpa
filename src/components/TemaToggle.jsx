export default function TemaToggle({ karanlik, onToggle }) {
    return (
        <button
            onClick = {() => onToggle(!karanlik)}
            aria-label = "Tema değiştir"
            className = "w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-ytu-red/40 transition-colors duration-200"
        >
            {karanlik ? (
                <svg width = "18" height = "18" viewBox = "0 0 24 24" fill = "none" stroke = "currentColor" strokeWidth = "2" strokeLinecap = "round" className = "text-amber-400">
                    <circle cx = "12" cy = "12" r = "4" />
                    <path d = "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
            ) : (
                <svg width = "18" height = "18" viewBox = "0 0 24 24" fill = "none" stroke = "currentColor" strokeWidth = "2" strokeLinecap = "round" className = "text-gray-500">
                    <path d = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
        </button>
    );
}