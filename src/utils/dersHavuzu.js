import { DERSLER } from "../data/dersler";


export function dersHavuzuGetir(fakulteId, bolum) {
    const donemler = DERSLER[fakulteId]?.[bolum] ?? {};
    const havuz = [];
    for (const [donem, dersler] of Object.entries(donemler)) {
        for (const ders of dersler) {
            havuz.push({ ...ders, donem: Number(donem) });
        }
    }
    return havuz;
}