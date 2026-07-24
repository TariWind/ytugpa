import { DERSLER } from "../data/dersler";
import { FAKULTELER } from "../data/bolumler";


const FAKULTE_ISIM = Object.fromEntries(FAKULTELER.map((f) => [f.id, f.isim]));


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


export const TUM_DERS_HAVUZU = (() => {
    const havuz = [];
    for (const [fakulteId, bolumler] of Object.entries(DERSLER)) {
        for (const [bolum, donemler] of Object.entries(bolumler)) {
            for (const [donem, dersler] of Object.entries(donemler)) {
                for (const ders of dersler) {
                    havuz.push({
                        ...ders,
                        donem: Number(donem),
                        fakulteId,
                        bolum,
                        fakulteIsim: FAKULTE_ISIM[fakulteId] ?? fakulteId,
                    });
                }
            }
        }
    }
    return havuz;
})();