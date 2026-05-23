import { useEffect, useState } from "react"

export default function LoadingScreen() {
    const [visible, setVisible] = useState(true)
    const [fading, setFading] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setFading(true)
            setTimeout(() => {
                setVisible(false)
                window.dispatchEvent(new Event("loadingdone"))
                localStorage.setItem("loading", "false")
            }, 800)
        }, 1200)
        return () => clearTimeout(timer)
    }, [])

    if (!visible) return null

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            opacity: fading ? 0 : 1,
            transition: "opacity 0.8s ease",
            pointerEvents: fading ? "none" : "auto",
        }}>
            <p style={{
                fontFamily: "Romie, serif",
                fontSize: "clamp(15px, 4vw, 35px)",
                fontWeight: "normal",
                letterSpacing: "0.02em",
                color: "#000",
                margin: 0,
                opacity: fading ? 0 : 1,
                transition: "opacity 0.8s ease",
                fontFeatureSettings: '"liga" 1, "calt" 1, "dlig" 1, "swsh" 1',
            }}>
                BAONGOC
            </p>
        </div>
    )
}