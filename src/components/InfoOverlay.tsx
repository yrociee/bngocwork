import { useEffect, useState } from "react"

export default function InfoOverlay() {
    const [open, setOpen] = useState(false)
    const [time, setTime] = useState("")
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(window.innerWidth <= 808)
    }, [])

    useEffect(() => {
        const onOpen = () => {
            setOpen(true)
            document.body.style.overflow = "hidden"
            window.dispatchEvent(new Event("overlayopen"))
        }
        const onClose = () => {
            setOpen(false)
            document.body.style.overflow = ""
            window.dispatchEvent(new Event("overlayclose"))
        }
        window.addEventListener("infoopen", onOpen)
        window.addEventListener("infoclose", onClose)
        return () => {
            window.removeEventListener("infoopen", onOpen)
            window.removeEventListener("infoclose", onClose)
        }
    }, [])

    useEffect(() => {
        const update = () => {
            const now = new Date()
            const timeStr = now.toLocaleTimeString("en-GB", {
                timeZone: "Asia/Ho_Chi_Minh",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })
            setTime(timeStr)
        }
        update()
        const interval = setInterval(update, 1000)
        return () => clearInterval(interval)
    }, [])

    function handleMouseEnter(e: React.MouseEvent<HTMLElement>) {
        e.currentTarget.style.color = "rgb(116,116,116)"
    }
    function handleMouseLeave(e: React.MouseEvent<HTMLElement>) {
        e.currentTarget.style.color = "rgb(0,0,0)"
    }
    function handleClose() {
        setOpen(false)
        window.dispatchEvent(new Event("infoclose"))
    }
    function stopProp(e: React.MouseEvent) {
        e.stopPropagation()
    }

    const text: React.CSSProperties = {
        fontFamily: "Romie, serif",
        fontSize: isMobile ? "20px" : "30px",
        fontWeight: 300,
        letterSpacing: "0.02em",
        lineHeight: isMobile ? "23px" : "34px",
        color: "rgb(0,0,0)",
        margin: 0,
        fontFeatureSettings: '"liga" 1, "zero" 1, "kern" 1, "case" 1, "ss08" 1, "ss12" 1, "ss13" 1, "ss14" 1, "ss15" 1',
    }

    const small: React.CSSProperties = {
        fontFamily: "'Coordinates Variable', sans-serif",
        fontSize: "10px",
        fontWeight: 300,
        letterSpacing: "0em",
        lineHeight: "12px",
        color: "rgb(116, 116, 116)",
        margin: 0,
    }

    const linkStyle: React.CSSProperties = {
        ...text,
        display: "block",
        textDecoration: "none",
        cursor: "pointer",
    }

    if (!open) return null

    // Desktop layout: original space-between with padding
    if (!isMobile) return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 500,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                backgroundColor: "rgba(255,255,255,0.7)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "50px 10px 10px 10px",
                boxSizing: "border-box",
                overflow: "auto",
            }}
            onClick={handleClose}
        >
            <div onClick={stopProp}>
                <p style={{ ...text, marginBottom: "24px" }}>
                    Bao Ngoc is a fresh-on-the-scene graduated graphic designer based in Hanoi. Her work is characterized by a love for creating unique and bold designs that push the boundaries of creativity. Throughout her journey in graphic design, she has dedicated herself to exploring innovative approaches and distinctive styles that make a lasting impact.
                </p>
                <p style={{ ...text, marginBottom: "24px" }}>
                    She specializes in brand identity, typography, and publication design, with each project showcasing her commitment to creating visually striking and intellectually engaging work that leaves a lasting impact on audiences.
                </p>
                <p style={{ ...text }}>Contact</p>
                <span style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => window.open("https://www.instagram.com/bngoc.work/", "_blank")}>@bngoc.work</span>
                <span style={{ ...linkStyle, marginBottom: "24px" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => window.open("mailto:yrociee.creative@gmail.com")}>yrociee.creative@gmail.com</span>
                <p style={{ ...text }}>Location</p>
                <p style={{ ...text }}>Hanoi, Vietnam</p>
                <p style={{ ...text }}>{time} GMT +7</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }} onClick={stopProp}>
                <p style={{ ...small }}>©2026 Bao Ngoc, All Rights Reserved</p>
                <p style={{ ...small, textAlign: "right" }}>Last updated at 01:47:02 (GMT +7) Monday 25 May 2026</p>
            </div>
        </div>
    )

    // Mobile layout: nav spacer + content + footer all equally spaced
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 500,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                backgroundColor: "rgba(255,255,255,0.7)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box",
                overflow: "hidden",
                paddingTop: "50px",   // nav height
                paddingBottom: "10px",
                paddingLeft: "10px",
                paddingRight: "10px",
            }}
            onClick={handleClose}
        >
            <div onClick={stopProp}>
                <p style={{ ...text, marginBottom: "16px" }}>
                    Bao Ngoc is a fresh-on-the-scene graduated graphic designer based in Hanoi. Her work is characterized by a love for creating unique and bold designs that push the boundaries of creativity. Throughout her journey in graphic design, she has dedicated herself to exploring innovative approaches and distinctive styles that make a lasting impact.
                </p>
                <p style={{ ...text, marginBottom: "16px" }}>
                    She specializes in brand identity, typography, and publication design, with each project showcasing her commitment to creating visually striking and intellectually engaging work that leaves a lasting impact on audiences.
                </p>
                <p style={{ ...text }}>Contact</p>
                <span style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => window.open("https://www.instagram.com/bngoc.work/", "_blank")}>@bngoc.work</span>
                <span style={{ ...linkStyle, marginBottom: "16px" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => window.open("mailto:yrociee.creative@gmail.com")}>yrociee.creative@gmail.com</span>
                <p style={{ ...text }}>Location</p>
                <p style={{ ...text }}>Hanoi, Vietnam</p>
                <p style={{ ...text }}>{time} GMT +7</p>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "2px",
                }}
                onClick={stopProp}
            >
                <p style={{ ...small }}>©2026 Bao Ngoc, All Rights Reserved</p>
                <p style={{ ...small }}>Last updated at 17:02:00 (GMT +7) Monday 4 May 2026</p>
            </div>
        </div>
    )
}