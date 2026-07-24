export default function AramaTetikleyici({ onClick }) {
    return (
        <button
            onClick = {onClick}
            aria-label = "Ders ara"
            className = "w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-ytu-red/40 transition-colors duration-200"
        >
            <svg width = "17" height = "17" viewBox = "0 0 24 24" fill = "none" stroke = "currentColor" strokeWidth = "2" strokeLineCap = "round" className = "text-gray-500 dark:text-gray-400">
                <circle cx = "11" cy = "11" r = "7" />
                <path d = "M21 21l-4.3-4.3" />
            </svg>
        </button>
    );
}