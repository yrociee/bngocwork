import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"

const baseWorks = [
    { title: "RIEL STUDIO", type: "PACKAGING" },
    { title: "UNBOXED MAGAZINE", type: "PUBLICATION" },
    { title: "DRESSING THE SCREEN", type: "BRANDING ∙ PRINT" },
    { title: "DAZED MAGAZINE", type: "PUBLICATION" },
]

export default function SelectedWork_Mobile_Labels() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [infoOpen, setInfoOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const overlayRef = useRef<HTMLDivElement | null>(null)

    // Create a dedicated overlay div on <html>, outside <body>
    useEffect(() => {
        setMounted(true)
        setIsMobile(window.innerWidth <= 808)
        document.fonts.load('400 15px "Romie"')
        document.fonts.load('300 15px "Romie"')

        const div = document.createElement("div")
        div.id = "mobile-labels-root"
        // Attach to <html>, not <body>, so body's position:fixed doesn't trap it
        document.documentElement.appendChild(div)
        overlayRef.current = div

        return () => {
            document.documentElement.removeChild(div)
        }
    }, [])

    useEffect(() => {
        const isAlreadyDone = localStorage.getItem("loading") !== "true"
        if (isAlreadyDone) { setLoaded(true); return }
        const onDone = () => setLoaded(true)
        window.addEventListener("loadingdone", onDone)
        return () => window.removeEventListener("loadingdone", onDone)
    }, [])

    useEffect(() => {
        const onOpen = () => setInfoOpen(true)
        const onClose = () => setInfoOpen(false)
        window.addEventListener("infoopen", onOpen)
        window.addEventListener("infoclose", onClose)
        return () => {
            window.removeEventListener("infoopen", onOpen)
            window.removeEventListener("infoclose", onClose)
        }
    }, [])

    useEffect(() => {
        const onIndex = (e: Event) => {
            setActiveIndex((e as CustomEvent).detail)
        }
        window.addEventListener("selectedwork_index", onIndex)
        return () => window.removeEventListener("selectedwork_index", onIndex)
    }, [])

    const w = baseWorks[activeIndex]
    const labelVisible = loaded && !infoOpen

    const base: React.CSSProperties = {
        fontFamily: '"Romie", "Romie Regular", serif',
        fontSize: "15px",
        letterSpacing: "0.02em",
        color: "#fff",
        margin: 0,
        whiteSpace: "nowrap",
        lineHeight: "1.2em",
        fontFeatureSettings: '"liga" 1, "calt" 1, "dlig" 1, "swsh" 1',
    }

    if (!mounted || !isMobile || !overlayRef.current) return null

    return createPortal(
        <div style={{
            position: "fixed",
            top: "50%",
            left: "10px",
            right: "10px",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: 9998,
            mixBlendMode: "difference",
            opacity: labelVisible ? 1 : 0,
            transition: "opacity 0.4s ease",
        }}>
            <p style={{ ...base }}>{w.title}</p>
            <p style={{ ...base, opacity: 0.35 }}>{w.type}</p>
        </div>,
        overlayRef.current  // <-- portal target is <html> child, not <body>
    )
}