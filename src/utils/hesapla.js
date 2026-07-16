import { HARF_NOTLARI } from "../data/dersler";


const KATSAYI_MAP = Object.fromEntries(
    HARF_NOTLARI.map((n) => [n.harf, n.katsayi])
);


export function gpaHesapla(dersler, notlar) {
    let toplamKrediXKatsayi = 0;
    let toplamKredi = 0;
    let girilenDersSayisi = 0;


    for (const ders of dersler) {
        const harf = notlar[ders.kod];
        if (!harf) continue;


        const katsayi = KATSAYI_MAP[harf];


        toplamKrediXKatsayi += ders.kredi * katsayi;
        toplamKredi += ders.kredi;
        girilenDersSayisi += 1;
    }


    if (girilenDersSayisi === 0) return null;


    return {
        gpa: (toplamKrediXKatsayi / toplamKredi).toFixed(2),
        toplamKredi,
        girilenDersSayisi,
        toplamDersSayisi: dersler.length,
    }
}


export function kumulatifGpaHesapla(donemVerileri) {
    let toplamKrediXKatsayi = 0;
    let toplamKredi = 0;
    let toplamDers = 0;


    for (const { dersler, notlar } of donemVerileri) {
        for (const ders of dersler) {
            const harf = notlar[ders.kod];
            if (!harf) continue;
            const katsayi = KATSAYI_MAP[harf];
            toplamKrediXKatsayi += ders.kredi * katsayi;
            toplamKredi += ders.kredi;
            toplamDers++;
        }
    }


    if (toplamDers === 0) return null;


    return {
        gpa: (toplamKrediXKatsayi / toplamKredi).toFixed(2),
        toplamKredi,
        toplamDers,
        donemSayisi: donemVerileri.length,
    };
}