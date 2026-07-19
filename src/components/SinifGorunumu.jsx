export default function SinifGorunumu({ fakulteId, bolum }) {
    return (
        <div className="mt-8 px-6 py-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center">
        <div className="text-3xl mb-2">🚧</div>
        <div className="font-display font-bold text-gray-700 dark:text-gray-200 mb-1">
            Sınıf görünümü yakında
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
            1. ve 2. dönem birlikte, 3. ve 4. dönem birlikte gösterilecek —
            yarın bu görünümü tamamlıyoruz.
        </p>
        </div>
    );
}