import { useEffect, useRef, useState } from "react"

const baseWorks = [
    {
        title: "RIEL STUDIO",
        desc: "A packaging system for a Vietnamese design collective",
        type: "PACKAGING",
        number: "01",
        image: "https://framerusercontent.com/images/e7HRhfoupnNe2gEMtkpeIFnUQ.png?width=3414&height=2727",
        bgImage: "https://framerusercontent.com/images/r93GOoU5K6xMhjZ3vOugETVmtHg.jpg?width=1280&height=832",
        link: "/projects/riel-studio",
    },
    {
        title: "UNBOXED MAGAZINE",
        desc: "Editorial design for an independent print publication",
        type: "PUBLICATION",
        number: "02",
        image: "https://framerusercontent.com/images/ffsi7UDabhT3r1SFPHNA1d6jzoQ.png?width=2679&height=3660",
        bgImage: "https://framerusercontent.com/images/M0r6fURQ5FkQdunUsMueICk2HQ.jpg?scale-down-to=4096&width=6016&height=4016",
        link: "/projects/unboxed-magazine",
    },
    {
        title: "DRESSING THE SCREEN",
        desc: "Brand identity and print collateral for a film costume house",
        type: "BRANDING ∙ PRINT",
        number: "03",
        image: "https://framerusercontent.com/images/gQ2RbcOSUKe2Yv7zo4nazX5XPT8.png?width=2525&height=1780",
        bgImage: "https://framerusercontent.com/images/gCXPhc2sGmraq8HSXiyfQwAfOg.jpg?width=3456&height=5184",
        link: "/projects/dressing-the-screen",
    },
    {
        title: "DAZED MAGAZINE",
        desc: "Cover and spread design for a quarterly fashion issue",
        type: "PUBLICATION",
        number: "04",
        image: "https://framerusercontent.com/images/tERiXTL5NWm4D7Me4vaw3G9la4.png?width=2823&height=3678",
        bgImage: "https://framerusercontent.com/images/tERiXTL5NWm4D7Me4vaw3G9la4.png?width=2823&height=3678",
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
    const isSnapping = useRef(false)
    const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

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

    const snapToIndex = (index: number) => {
        const el = itemRefs.current[index]
        if (!el) return
        isSnapping.current = true
        const rect = el.getBoundingClientRect()
        const offset = rect.top + window.scrollY - window.innerHeight / 2 + rect.height / 2
        window.scrollTo({ top: offset, behavior: "smooth" })
        setTimeout(() => { isSnapping.current = false }, 1000)
    }

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
                        const maxDist = window.innerHeight * 0.5
                        const t = Math.max(0, 1 - dist / maxDist)
                        el.style.transform = `scale(${0.88 + t * 0.32})`
                        el.style.filter = `blur(${(1 - t) * 10}px)`
                        el.style.opacity = `${0.5 + t * 0.5}`
                    })
                    if (snapTimeout.current) clearTimeout(snapTimeout.current)
                    if (!isSnapping.current) {
                        snapTimeout.current = setTimeout(() => {
                            const el = itemRefs.current[closestIndex]
                            if (!el) return
                            const rect = el.getBoundingClientRect()
                            const center = rect.top + rect.height / 2
                            const dist = Math.abs(center - mid)
                            if (dist > 8 && dist < rect.height * 1.5) snapToIndex(closestIndex)
                        }, 500)
                    }
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
                                width: "clamp(180px, 22vw, 300px)",
                                overflow: "hidden",
                                transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), filter 0.6s ease, opacity 0.6s ease",
                                willChange: "transform, filter, opacity",
                                cursor: "pointer",
                                pointerEvents: "auto",
                            }}
                            onClick={() => { window.location.href = work.link }}
                        >
                            <img src={work.image} style={{ width: "100%", height: "auto", display: "block" }} />
                        </div>
                    )
                })}
            </div>
            <div style={{ height: "50vh" }} />
        </div>
    )
}