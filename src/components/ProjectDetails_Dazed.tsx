import { useEffect, useState } from "react"

export default function ProjectDetails_Dazed() {
    const [open, setOpen] = useState(false)
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 808px)")
        setIsDesktop(!mq.matches)
    }, [])

    useEffect(() => {
        const onOpen = () => {
            setOpen(true)
            document.body.style.overflow = "hidden"
        }
        const onClose = () => {
            setOpen(false)
            document.body.style.overflow = ""
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
        document.body.style.overflow = ""
        window.dispatchEvent(new Event("projectdetailsclose"))
    }

    function stopProp(e: React.MouseEvent) {
        e.stopPropagation()
    }

    const text: React.CSSProperties = {
        fontFamily: "Romie, serif",
        fontSize: "30px",
        fontWeight: 300,
        letterSpacing: "0.02em",
        lineHeight: "33px",
        color: "rgb(0,0,0)",
        margin: 0,
        fontFeatureSettings: '"liga" 1, "zero" 1, "kern" 1, "case" 1, "ss08" 1, "ss12" 1, "ss13" 1, "ss14" 1, "ss15" 1',
    }

    if (!isDesktop || !open) return null

    return (
        <div
            style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                zIndex: 500, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                backgroundColor: "rgba(250,250,250,0.7)", display: "flex", flexDirection: "column",
                padding: "50px 10px 10px 10px", boxSizing: "border-box", overflow: "auto",
            }}
            onClick={handleClose}
        >
            <div onClick={stopProp}>
                <p style={{ ...text, marginBottom: "24px" }}>
                    An editorial project created for Typographic Studies, Dazed Magazine: The Charms of Kim Jisoo blends art and fashion with an accessible, youth-driven tone. Through expressive visuals and curated stories on creativity and cultural impact, it highlights inspiring voices while encouraging young women to engage, express, and shape their own paths.
                </p>
                <p style={{ ...text }}>2023</p>
                <p style={{ ...text }}>Design: Bui Thi Bao Ngoc, Nguyen Ngoc Oanh</p>
                <p style={{ ...text }}>Typeface: Sarabun, TT Livert</p>
                <p style={{ ...text }}>Dimension: 210 x 285mm</p>
                <p style={{ ...text }}>Number of Pages: 48</p>
            </div>
        </div>
    )
}