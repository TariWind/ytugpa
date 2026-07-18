import { useState, useEffect } from "react";



export function useDarkMode() {
    const [karanlik, setKaranlik] = useState(() => {
        const kayitli = localStorage.getItem("ytugpa_tema");
        if (kayitli) return kayitli === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });


    useEffect(() => {
        document.documentElement.classList.toggle("dark", karanlik);
        localStorage.setItem("ytugpa_tema", karanlik ? "dark" : "light");
    }, [karanlik]);
    

    return [karanlik, setKaranlik];
}