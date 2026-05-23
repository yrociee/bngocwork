import { useEffect, useState } from "react"

export default function ProjectDetails_DressingTheScreen_Mobile() {
    const [open, setOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 808px)")
        setIsMobile(mq.matches)
    }, [])

    useEffect(() => {
        const onOpen = () => {
            setOpen(true)
            window.dispatchEvent(new Event("overlayopen"))
        }
        const onClose = () => {
            setOpen(false)
            window.dispatchEvent(new Event("overlayclose"))
        }
        window.addEventListener("projectdetailsopen", onOpen)
        window.addEventListener("projectdetailsclose", onClose)
        return () => {
            window.removeEventListener("projectdetailsopen", onOpen)
            window.removeEventListener("projectdetailsclose", onClose)
        }
    }, [])

    function handleClose() {
        setOpen(false)
        window.dispatchEvent(new Event("projectdetailsclose"))
    }

    function stopProp(e: React.MouseEvent) {
        e.stopPropagation()
    }

    const text: React.CSSProperties = {
        fontFamily: "Romie, serif",
        fontSize: "20px",
        fontWeight: 300,
        letterSpacing: "0.02em",
        lineHeight: "24px",
        color: "rgb(0,0,0)",
        margin: 0,
        fontFeatureSettings: '"liga" 1, "zero" 1, "kern" 1, "case" 1, "ss08" 1, "ss12" 1, "ss13" 1, "ss14" 1, "ss15" 1',
    }

    if (!isMobile || !open) return null

    return (
        <div
            style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                zIndex: 500, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                backgroundColor: "rgba(250,250,250,0.7)", display: "flex", flexDirection: "column",
                justifyContent: "space-between", padding: "50px 10px 10px 10px",
                boxSizing: "border-box", overflow: "hidden",
            }}
            onClick={handleClose}
        >
            <div onClick={stopProp}>
                <p style={{ ...text, marginBottom: "16px" }}>
                    An exhibition identity exploring the intersection of fashion and film, developed for the D&AD New Blood brief. Built around ideas of framing, adaptability, and narrative, the system draws from filmic forms to create a flexible mark that shifts across formats, extending into print through a sleeve-style invitation and an editorial catalogue featuring film stills and archival material.
                </p>
                <p style={{ ...text }}>2024</p>
                <p style={{ ...text }}>Typeface: Playfair Display, Epical Comeback, Aeonik</p>
            </div>
        </div>
    )
}