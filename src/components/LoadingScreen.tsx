import { useEffect, useState } from "react"

export default function LoadingScreen() {
    const [phase, setPhase] = useState<"visible" | "bgfade" | "allfade" | "gone">("visible")

    useEffect(() => {
        // Phase 1: fully visible for 1.5s
        const t1 = setTimeout(() => {
            setPhase("bgfade") // Phase 2: bg fades to 50% over 0.6s
            const t2 = setTimeout(() => {
                setPhase("allfade") // Phase 3: everything fades out over 0.8s
                const t3 = setTimeout(() => {
                    setPhase("gone")
                    window.dispatchEvent(new Event("loadingdone"))
                    localStorage.setItem("loading", "false")
                }, 800)
                return () => clearTimeout(t3)
            }, 600)
            return () => clearTimeout(t2)
        }, 1500)
        return () => clearTimeout(t1)
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
            opacity: phase === "allfade" ? 0 : 1,
            transition: phase === "allfade" ? "opacity 0.8s ease" : "none",
            pointerEvents: phase === "allfade" ? "none" : "auto",
        }}>
            {/* Background overlay that fades first */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "#fff",
                opacity: phase === "bgfade" || phase === "allfade" ? 0.5 : 1,
                transition: phase === "bgfade" ? "opacity 0.6s ease" : "none",
            }} />
            <p style={{
                position: "relative",
                zIndex: 1,
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