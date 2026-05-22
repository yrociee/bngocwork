import { useEffect, useState } from "react"

export default function ProjectLabels_DressingTheScreen_Mobile() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(window.innerWidth <= 808)
    }, [])

    if (!isMobile) return null

    const base: React.CSSProperties = {
        fontFamily: "Romie, serif",
        fontSize: "15px",
        fontWeight: "normal",
        letterSpacing: "0.02em",
        color: "#fff",
        margin: 0,
        whiteSpace: "nowrap",
        fontFeatureSettings: '"liga" 1, "calt" 1, "dlig" 1, "swsh" 1',
    }

    return (
        <>
            <div style={{ position: "fixed", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 499, mixBlendMode: "difference" }}>
                <p style={{ ...base }}>DRESSING THE SCREEN</p>
            </div>
            <div style={{ position: "fixed", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 499, mixBlendMode: "difference" }}>
                <p style={{ ...base, opacity: 0.35 }}>BRANDING ∙ PRINT</p>
            </div>
        </>
    )
}