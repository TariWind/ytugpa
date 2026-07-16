import { gpaDurumu } from "../utils/renkler";
import styles from "./GpaKarti.module.css"


export default function GpaKarti({ sonuc }) {
    if (!sonuc) return null;


    const { gpa, toplamKredi, girilenDersSayisi, toplamDersSayisi } = sonuc;
    const { renk, bg, etiket } = gpaDurumu(gpa);
    const tamMi = girilenDersSayisi === toplamDersSayisi;


    return (
        <div
            className = {styles.kart}
            style = {{ background: bg, borderColor: renk }}
        >
            <div>
                <div className = {styles.gpaBaslik}>Dönem Ortalaması</div>
                <div className = {styles.gpaRakam} style = {{ color: renk }}>{gpa}</div>
                <div className = {styles.gpaEtiket} style = {{ color: renk }}>{etiket}</div>
            </div>


            <div className = {styles.detaylar}>
                <div>
                    📚 <strong>{girilenDersSayisi}</strong> / {toplamDersSayisi} ders girildi
                    {tamMi && <span style = {{ color: renk }}> ✓</span>}
                </div>
                <div>📊 <strong>{toplamKredi}</strong> kredi hesaplandı</div>
                {!tamMi && (
                    <div className = {styles.uyariKucuk}>
                        ⚠ Tüm notlar girilince sonuç kesinleşir
                    </div>
                )}
            </div>
        </div>
    );
}