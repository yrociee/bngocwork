import { useEffect, useRef, useState } from "react"

const baseWorks = [
    {
        title: "RIEL STUDIO",
        type: "PACKAGING",
        image: "https://framerusercontent.com/images/e7HRhfoupnNe2gEMtkpeIFnUQ.png?width=400",
        link: "/projects/riel-studio",
    },
    {
        title: "UNBOXED MAGAZINE",
        type: "PUBLICATION",
        image: "https://framerusercontent.com/images/ffsi7UDabhT3r1SFPHNA1d6jzoQ.png?width=400",
        link: "/projects/unboxed-magazine",
    },
    {
        title: "DRESSING THE SCREEN",
        type: "BRANDING ∙ PRINT",
        image: "https://framerusercontent.com/images/gQ2RbcOSUKe2Yv7zo4nazX5XPT8.png?width=400",
        link: "/projects/dressing-the-screen",
    },
    {
        title: "DAZED MAGAZINE",
        type: "PUBLICATION",
        image: "https://framerusercontent.com/images/tERiXTL5NWm4D7Me4vaw3G9la4.png?width=400",
        link: "/projects/dazed-magazine",
    },
]

const works = [...baseWorks, ...baseWorks, ...baseWorks]
const ITEM_GAP = 80

export default function SelectedWork_Mobile_Images() {
    const containerRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])
    const scrollY = useRef(0)
    const touchStartY = useRef(0)
    const touchStartScroll = useRef(0)
    const screenH = useRef(0)
    const overlayOpen = useRef(false)
    const velocityY = useRef(0)
    const lastTouchY = useRef(0)
    const lastTouchTime = useRef(0)
    const animFrameRef = useRef<number | null>(null)
    const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        screenH.current = window.innerHeight
        if (window.innerWidth > 808) return
        const style = document.createElement("style")
        style.textContent = `
            ::-webkit-scrollbar { display: none; }
            * { scrollbar-width: none; }
            html, body {
                overflow: hidden !important;
                position: fixed !important;
                width: 100% !important;
                height: 100% !important;
                overscroll-behavior: none !important;
            }
        `
        document.head.appendChild(style)
        return () => document.head.removeChild(style)
    }, [])

    useEffect(() => {
        const onOpen = () => { overlayOpen.current = true }
        const onClose = () => { overlayOpen.current = false }
        window.addEventListener("overlayopen", onOpen)
        window.addEventListener("overlayclose", onClose)
        return () => {
            window.removeEventListener("overlayopen", onOpen)
            window.removeEventListener("overlayclose", onClose)
        }
    }, [])

    const getMaxScroll = () => {
        if (!containerRef.current) return 0
        return containerRef.current.scrollHeight - screenH.current
    }

    const applyScroll = (y: number) => {
        if (!containerRef.current) return
        const maxScroll = getMaxScroll()
        const oneSet = maxScroll / 3
        if (y > oneSet * 1.5) y -= oneSet
        if (y < oneSet * 0.5) y += oneSet
        y = Math.max(0, Math.min(y, maxScroll))
        scrollY.current = y
        containerRef.current.style.transform = `translateY(-${y}px)`
    }

    const updateVisuals = (y: number) => {
        const mid = screenH.current / 2
        let closestIndex = 0
        let closestDist = Infinity
        itemRefs.current.forEach((el, i) => {
            if (!el) return
            const center = el.offsetTop - y + el.offsetHeight / 2
            const dist = Math.abs(center - mid)
            if (dist < closestDist) { closestDist = dist; closestIndex = i }
            const maxDist = screenH.current * 0.45
            const t = Math.max(0, 1 - dist / maxDist)
            el.style.transform = `scale(${0.80 + t * 0.30})`
            el.style.filter = `blur(${(1 - t) * 12}px)`
            el.style.opacity = `${0.35 + t * 0.65}`
        })
        window.dispatchEvent(new CustomEvent("selectedwork_index", { detail: closestIndex % baseWorks.length }))
        return closestIndex
    }

    const snapToIndex = (index: number) => {
        const el = itemRefs.current[index]
        if (!el) return
        const target = el.offsetTop - screenH.current / 2 + el.offsetHeight / 2
        const start = scrollY.current
        const duration = 700
        const startTime = performance.now()
        const animate = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1)
            const ease = 1 - Math.pow(1 - t, 3)
            const y = start + (target - start) * ease
            applyScroll(y)
            updateVisuals(y)
            if (t < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }

    useEffect(() => {
        if (window.innerWidth > 808) return

        const onTouchStart = (e: TouchEvent) => {
            if (overlayOpen.current) return
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
            if (snapTimeout.current) clearTimeout(snapTimeout.current)
            touchStartY.current = e.touches[0].clientY
            touchStartScroll.current = scrollY.current
            lastTouchY.current = e.touches[0].clientY
            lastTouchTime.current = Date.now()
            velocityY.current = 0
        }

        const onTouchMove = (e: TouchEvent) => {
            if (overlayOpen.current) return
            e.preventDefault()
            const now = Date.now()
            const dt = now - lastTouchTime.current
            const dy = e.touches[0].clientY - lastTouchY.current
            if (dt > 0) velocityY.current = dy / dt
            lastTouchY.current = e.touches[0].clientY
            lastTouchTime.current = now
            const diff = touchStartY.current - e.touches[0].clientY
            applyScroll(touchStartScroll.current + diff)
            updateVisuals(scrollY.current)
        }

        const onTouchEnd = () => {
            if (overlayOpen.current) return
            let velocity = velocityY.current * 100
            const decay = 0.88

            const momentum = () => {
                if (Math.abs(velocity) < 0.8) {
                    // Momentum done — snap gently
                    if (snapTimeout.current) clearTimeout(snapTimeout.current)
                    snapTimeout.current = setTimeout(() => {
                        const closest = updateVisuals(scrollY.current)
                        snapToIndex(closest)
                    }, 100)
                    return
                }
                applyScroll(scrollY.current - velocity)
                updateVisuals(scrollY.current)
                velocity *= decay
                animFrameRef.current = requestAnimationFrame(momentum)
            }
            animFrameRef.current = requestAnimationFrame(momentum)
        }

        window.addEventListener("touchstart", onTouchStart, { passive: true })
        window.addEventListener("touchmove", onTouchMove, { passive: false })
        window.addEventListener("touchend", onTouchEnd, { passive: true })
        return () => {
            window.removeEventListener("touchstart", onTouchStart)
            window.removeEventListener("touchmove", onTouchMove)
            window.removeEventListener("touchend", onTouchEnd)
        }
    }, [])

    useEffect(() => {
        if (!mounted) return
        if (window.innerWidth > 808) return
        const centerFirst = () => {
            const el = itemRefs.current[baseWorks.length]
            if (!el) return
            const target = el.offsetTop - screenH.current / 2 + el.offsetHeight / 2
            applyScroll(target)
            updateVisuals(target)
        }
        setTimeout(centerFirst, 150)
        window.addEventListener("loadingdone", centerFirst, { once: true })
        return () => window.removeEventListener("loadingdone", centerFirst)
    }, [mounted])

    return (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden" }}>
            <div ref={containerRef} style={{ width: "100%", willChange: "transform" }}>
                <div style={{ height: screenH.current }} />
                <div style={{ display: "flex", flexDirection: "column", gap: `${ITEM_GAP}px`, alignItems: "center", pointerEvents: "auto" }}>
                    {works.map((_, i) => {
                        const work = baseWorks[i % baseWorks.length]
                        return (
                            <div
                                key={i}
                                ref={(el) => (itemRefs.current[i] = el)}
                                style={{
                                    width: "clamp(180px, 55vw, 300px)",
                                    overflow: "hidden",
                                    willChange: "transform, filter, opacity",
                                    cursor: "pointer",
                                    pointerEvents: "auto",
                                }}
                                onClick={() => { window.location.href = work.link }}
                            >
                                <img
                                    src={work.image}
                                    loading={i === baseWorks.length ? "eager" : "lazy"}
                                    style={{ width: "100%", height: "auto", display: "block" }}
                                />
                            </div>
                        )
                    })}
                </div>
                <div style={{ height: screenH.current }} />
            </div>
        </div>
    )
}