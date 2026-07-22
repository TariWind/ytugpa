export function ekstraAnahtar(kod, donem) {
    return `${kod}::${donem}`;
}


export function ekstraKodlariGetir(ekstraDersler = {}, donem) {
    const sonek = `::${donem}`;
    return Object.keys(ekstraDersler)
    .filter((anahtar) => anahtar.endsWith(sonek))
    .map((anahtar) => anahtar.slice(0, -sonek.length));
}