import { useEffect, useRef, useState } from "react"

const baseWorks = [
    {
        title: "RIEL STUDIO",
        type: "PACKAGING",
        number: "01",
        image: "https://res.cloudinary.com/doaofjidq/image/upload/w_1200,f_auto,q_auto/riel_studio_qchknq.webp",
        aspectRatio: "3414 / 2727",
        link: "/projects/riel-studio",
    },
    {
        title: "UNBOXED MAGAZINE",
        type: "PUBLICATION",
        number: "02",
        image: "https://res.cloudinary.com/doaofjidq/image/upload/w_1200,f_auto,q_auto/unboxed_magazine_psndx2.webp",
        aspectRatio: "2679 / 3660",
        link: "/projects/unboxed-magazine",
    },
    {
        title: "DRESSING THE SCREEN",
        type: "BRANDING ∙ PRINT",
        number: "03",
        image: "https://res.cloudinary.com/doaofjidq/image/upload/w_1200,f_auto,q_auto/dressing_the_screen_cgi9uo.webp",
        aspectRatio: "2525 / 1780",
        link: "/projects/dressing-the-screen",
    },
    {
        title: "DAZED MAGAZINE",
        type: "PUBLICATION",
        number: "04",
        image: "https://res.cloudinary.com/doaofjidq/image/upload/w_1200,f_auto,q_auto/dazed_magazine_dphwdo.webp",
        aspectRatio: "2823 / 3678",
        link: "/projects/dazed-magazine",
    },
]

const works = [...baseWorks, ...baseWorks, ...baseWorks]
const LINE_HEIGHT = 24
const ITEM_GAP = 100

export default function SelectedWork() {
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [infoOpen, setInfoOpen] = useState(false)
    const [isDesktop, setIsDesktop] = useState(false)
    const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isSnapping = useRef(false)

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 808px)")
        setIsDesktop(!mq.matches)
    }, [])

    useEffect(() => {
        const style = document.createElement("style")
        style.textContent = `::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }`
        document.head.appendChild(style)
        return () => document.head.removeChild(style)
    }, [])

    useEffect(() => {
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
        let ticking = false
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const mid = window.innerHeight / 2
                    let closestIndex = 0
                    let closestDist = Infinity
                    itemRefs.current.forEach((el, i) => {
                        if (!el) return
                        const rect = el.getBoundingClientRect()
                        const center = rect.top + rect.height / 2
                        const dist = Math.abs(center - mid)
                        if (dist < closestDist) { closestDist = dist; closestIndex = i }
                    })
                    setActiveIndex(closestIndex % baseWorks.length)
                    itemRefs.current.forEach((el) => {
                        if (!el) return
                        const rect = el.getBoundingClientRect()
                        const center = rect.top + rect.height / 2
                        const dist = Math.abs(center - mid)
                        const maxDist = window.innerHeight * 0.65
                        const t = Math.max(0, 1 - dist / maxDist)
                        el.style.transform = `scale(${0.78 + t * 0.32})`
                        el.style.filter = `blur(${(1 - t) * 6}px)`
                        el.style.opacity = `${0.35 + t * 0.65}`
                    })
                    ticking = false
                })
                ticking = true
            }
        }

        let loopTimeout: ReturnType<typeof setTimeout> | null = null
        const handleLoop = () => {
            if (loopTimeout) return
            loopTimeout = setTimeout(() => {
                const scrollY = window.scrollY
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight
                const oneSet = maxScroll / 3
                if (scrollY > oneSet * 1.7) window.scrollTo({ top: scrollY - oneSet })
                if (scrollY < oneSet * 0.3) window.scrollTo({ top: scrollY + oneSet })
                loopTimeout = null
            }, 50)
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("scroll", handleLoop, { passive: true })
        onScroll()
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("scroll", handleLoop)
            if (loopTimeout) clearTimeout(loopTimeout)
            if (snapTimeout.current) clearTimeout(snapTimeout.current)
        }
    }, [])

    useEffect(() => {
        const centerFirst = () => {
            const el = itemRefs.current[baseWorks.length]
            if (!el) return
            const rect = el.getBoundingClientRect()
            const offset = rect.top + window.scrollY - window.innerHeight / 2 + rect.height / 2
            window.scrollTo(0, offset)
        }
        setTimeout(centerFirst, 60)
        window.addEventListener("loadingdone", centerFirst, { once: true })
        return () => window.removeEventListener("loadingdone", centerFirst)
    }, [])

    if (!isDesktop) return null

    const w = baseWorks[activeIndex]

    const base: React.CSSProperties = {
        fontFamily: "Romie",
        fontSize: "35px",
        letterSpacing: "0.02em",
        color: "#000",
        margin: 0,
        whiteSpace: "nowrap",
        lineHeight: `${LINE_HEIGHT}px`,
        height: LINE_HEIGHT,
        fontFeatureSettings: '"liga" 1, "calt" 1, "dlig" 1, "swsh" 1',
    }

    const labelVisible = loaded && !infoOpen

    return (
        <div style={{ background: "transparent", width: "100%", pointerEvents: "none" }}>
            <div style={{ position: "fixed", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 100, opacity: labelVisible ? 1 : 0, transition: "opacity 0.4s ease" }}>
                <p style={{ ...base }}>{w.title}</p>
            </div>
            <div style={{ position: "fixed", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 100, opacity: labelVisible ? 1 : 0, transition: "opacity 0.4s ease" }}>
                <p style={{ ...base, opacity: 0.35 }}>{w.type}</p>
            </div>

            <div style={{ height: "50vh" }} />
            <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: `${ITEM_GAP}px`, alignItems: "center" }}>
                {works.map((_, i) => {
                    const work = baseWorks[i % baseWorks.length]
                    return (
                        <div
                            key={i}
                            ref={(el) => (itemRefs.current[i] = el)}
                            style={{
                                width: "clamp(220px, 28vw, 420px)",
                                aspectRatio: work.aspectRatio,
                                overflow: "hidden",
                                transition: "transform 0.2s ease, filter 0.2s ease, opacity 0.2s ease",
                                willChange: "transform, filter, opacity",
                                cursor: "pointer",
                                pointerEvents: "auto",
                            }}
                            onClick={() => { window.location.href = work.link }}
                        >
                            <img
                                src={work.image}
                                loading={i === baseWorks.length ? "eager" : "lazy"}
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                        </div>
                    )
                })}
            </div>
            <div style={{ height: "50vh" }} />
        </div>
    )
}