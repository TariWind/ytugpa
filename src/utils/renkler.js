export function gpaDurumu(gpa) {
    const g = parseFloat(gpa);

    if (g >= 3.50) return {
        text:   "text-emerald-600 dark:text-emerald-400",
        bg:     "bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-500",
        etiket: "Onur Öğrencisi 🏆",
    };
    if (g >= 3.00) return {
        text:   "text-blue-600 dark:text-blue-400",
        bg:     "bg-blue-50 dark:bg-blue-950/30",
        border: "border-blue-500",
        etiket: "Yüksek Başarı",
    };
    if (g >= 2.50) return {
        text:   "text-lime-600 dark:text-lime-400",
        bg:     "bg-lime-50 dark:bg-lime-950/30",
        border: "border-lime-500",
        etiket: "İyi",
    };
    if (g >= 2.00) return {
        text:   "text-amber-600 dark:text-amber-400",
        bg:     "bg-amber-50 dark:bg-amber-950/30",
        border: "border-amber-500",
        etiket: "Orta",
    };
    if (g >= 1.00) return {
        text:   "text-orange-600 dark:text-orange-400",
        bg:     "bg-orange-50 dark:bg-orange-950/30",
        border: "border-orange-500",
        etiket: "Düşük",
    };
    return {
        text:   "text-red-600 dark:text-red-400",
        bg:     "bg-red-50 dark:bg-red-950/30",
        border: "border-red-500",
        etiket: "Başarısız",
    };
}