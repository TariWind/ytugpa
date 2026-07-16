import { gpaHesapla, kumulatifGpaHesapla } from "../utils/hesapla";
import { gpaDurumu } from "../utils/renkler";
import styles from "./KumulatifGpa.module.css";


export default function KumulatifGpa({ donemVerileri }) {
    if (!donemVerileri || donemVerileri.length === 0) return null;


    const kumSonuc = kumulatifGpaHesapla(donemVerileri);
    if (!kumSonuc) return null;


    const { renk, bg, etiket } = gpaDurumu(kumSonuc.gpa);


    return (
        <div className = {styles.sarmalayici}>


            <div className = {styles.bolumBaslik}>
                <div className = {styles.cizgi} />
                <span className = {styles.baslikMetin}>Genel Ortalama</span>
                <div className = {styles.cizgi} />
            </div>


            <div className = {styles.donemListesi}>
                {donemVerileri.map(({ donem, dersler, notlar }) => {
                    const sonuc = gpaHesapla(dersler, notlar);
                    if (!sonuc) return null;
                    const { renk: dr } = gpaDurumu(sonuc.gpa);


                    return (
                        <div key = {donem} className = {styles.donemSatir}>
                            <span className = {styles.donemAdi}>
                                {donem}. Dönem
                                <span className = {styles.donemDetay}>
                                    {sonuc.girilenDersSayisi} ders · {sonuc.toplamKredi} kredi
                                </span>
                            </span>
                            <span className = {styles.donemGpa} style = {{ color: dr }}>
                                {sonuc.gpa}
                            </span>
                        </div>
                    );
                })}
            </div>


            <div
                className = {styles.kumKart}
                style = {{ background: bg, borderColor: renk }}
            >
                <div>
                    <div className = {styles.kumBaslik}>
                        Genel Ortalama · {kumSonuc.donemSayisi} Dönem
                    </div>
                    <div className = {styles.kumRakam} style = {{ color: renk }}>
                        {kumSonuc.gpa}
                    </div>
                    <div className = {styles.kumEtiket} style = {{ color: renk }}>
                        {etiket}
                    </div>
                </div>


                <div className = {styles.kumDetaylar}>
                    <div>📊 Toplam <strong>{kumSonuc.toplamKredi}</strong> kredi</div>
                    <div>📚 Toplam <strong>{kumSonuc.toplamDers}</strong> ders</div>
                </div>
            </div>
        </div>
    );
}