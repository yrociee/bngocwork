import { useEffect, useState } from "react"

export default function LoadingScreen() {
    const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible")

    useEffect(() => {
        // Stay fully visible for 2s, then fade out over 0.8s
        const fadeTimer = setTimeout(() => {
            setPhase("fading")
            setTimeout(() => {
                setPhase("gone")
                window.dispatchEvent(new Event("loadingdone"))
                localStorage.setItem("loading", "false")
            }, 800)
        }, 2000)
        return () => clearTimeout(fadeTimer)
    }, [])

    if (phase === "gone") return null

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
            opacity: phase === "fading" ? 0 : 1,
            transition: phase === "fading" ? "opacity 0.8s ease" : "none",
            pointerEvents: phase === "fading" ? "none" : "auto",
        }}>
            <p style={{
                fontFamily: "Romie, serif",
                fontSize: "clamp(15px, 4vw, 35px)",
                fontWeight: "normal",
                letterSpacing: "0.02em",
                color: "#000",
                margin: 0,
                fontFeatureSettings: '"liga" 1, "calt" 1, "dlig" 1, "swsh" 1',
            }}>
                BAONGOC
            </p>
        </div>
    )
}