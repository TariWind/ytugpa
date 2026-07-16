import styles from "./DersListesi.module.css";
import { HARF_NOTLARI } from "../data/dersler";


export default function DersListesi({ dersler, notlar, onNotDegisti, donem }) {
    if (!dersler || dersler.length === 0) {
        return (
            <div className = {styles.uyari}>
                ⚠ <strong>{donem}. dönem</strong> için Bologna'da ders verisi bulunamadı.
                Bu dönem seçmeli veya Bologna'ya yüklenmemiş olabilir.
            </div>
        );
    }


    return (
        <div className = {styles.sarmalayici}>
            <table className = {styles.tablo}>
                <thead>
                    <tr>
                        <th>Kod</th>
                        <th>Ders Adı</th>
                        <th className = {styles.thMerkez}>Kredi</th>
                        <th className = {styles.thMerkez}>AKTS</th>
                        <th className = {styles.thMerkez}>Harf Notu</th>
                    </tr>
                </thead>
                <tbody>
                    {dersler.map((ders) => {
                        const secilenNot = notlar[ders.kod] || "";
                        const notSinif = secilenNot ? styles[`not-${secilenNot}`] : undefined;


                        return (
                            <tr key = {ders.kod}>
                                <td className = {styles.dersKod}>{ders.kod}</td>
                                <td>{ders.ad}</td>
                                <td className = {styles.thMerkez}>{ders.kredi}</td>
                                <td className = {styles.thMerkez}>{ders.akts}</td>
                                <td className = {styles.thMerkez}>
                                    <select
                                        value = {secilenNot}
                                        onChange = {(e) => onNotDegisti(ders.kod, e.target.value)}
                                        className = {styles.notSelect}
                                        style = {{ background: notSinif ? undefined : "#fff" }}
                                    >
                                        <option value = "">—</option>
                                        {HARF_NOTLARI.map((n) => (
                                            <option key = {n.harf} value = {n.harf}>{n.harf}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}