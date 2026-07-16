export function gpaDurumu(gpa) {
    const g = parseFloat(gpa);
    if ( g>= 3.50) return { renk: "#2e7d32", bg: "#f1f8e9", etiket: "Onur Öğrencisi 🏆" };
    if ( g>= 3.00) return { renk: "#1565c0", bg: "#e3f2fd", etiket: "Yüksek Başarı" };
    if ( g>= 2.50) return { renk: "#558b2f", bg: "#f9fbe7", etiket: "İyi" };
    if ( g>= 2.00) return { renk: "#f57f17", bg: "#fffde7", etiket: "Orta" };
    if ( g>= 1.00) return { renk: "#e65100", bg: "#fff3e0", etiket: "Düşük" };
    return { renk: "#c62828", bg: "#ffebee", etiket: "Başarısız" };
}