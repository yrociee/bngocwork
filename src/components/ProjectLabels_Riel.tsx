import { useEffect, useState } from "react"

export default function ProjectLabels_Riel() {
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 808px)")
        setIsDesktop(!mq.matches)
    }, [])

    if (!isDesktop) return null

    const base: React.CSSProperties = {
        fontFamily: "Romie, serif",
        fontSize: "35px",
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
                <p style={{ ...base }}>RIEL STUDIO</p>
            </div>
            <div style={{ position: "fixed", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 499, mixBlendMode: "difference" }}>
                <p style={{ ...base, opacity: 0.35 }}>PACKAGING</p>
            </div>
        </>
    )
}