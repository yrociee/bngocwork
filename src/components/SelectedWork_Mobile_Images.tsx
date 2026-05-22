import { useEffect, useRef, useState } from "react"

const baseWorks = [
    {
        title: "RIEL STUDIO",
        type: "PACKAGING",
        image: "https://framerusercontent.com/images/e7HRhfoupnNe2gEMtkpeIFnUQ.png?width=3414&height=2727",
        link: "/projects/riel-studio",
    },
    {
        title: "UNBOXED MAGAZINE",
        type: "PUBLICATION",
        image: "https://framerusercontent.com/images/ffsi7UDabhT3r1SFPHNA1d6jzoQ.png?width=2679&height=3660",
        link: "/projects/unboxed-magazine",
    },
    {
        title: "DRESSING THE SCREEN",
        type: "BRANDING ∙ PRINT",
        image: "https://framerusercontent.com/images/gQ2RbcOSUKe2Yv7zo4nazX5XPT8.png?width=2525&height=1780",
        link: "/projects/dressing-the-screen",
    },
    {
        title: "DAZED MAGAZINE",
        type: "PUBLICATION",
        image: "https://framerusercontent.com/images/tERiXTL5NWm4D7Me4vaw3G9la4.png?width=2823&height=3678",
        link: "/projects/dazed-magazine",
    },
]

const works = [...baseWorks, ...baseWorks, ...baseWorks]
const ITEM_GAP = 100

export default function SelectedWork_Mobile_Images() {
    const containerRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])
    const scrollY = useRef(0)
    const touchStartY = useRef(0)
    const touchStartScroll = useRef(0)
    const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isSnapping = useRef(false)
    const screenH = useRef(0)
    const overlayOpen = useRef(false)
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
            if (dist < closestDist) {
                closestDist = dist
                closestIndex = i
            }
            const maxDist = screenH.current * 0.6
            const t = Math.max(0, 1 - dist / maxDist)
            el.style.transform = `scale(${0.85 + t * 0.45})`
            el.style.filter = `blur(${(1 - t) * 6}px)`
            el.style.opacity = `${0.4 + t * 0.6}`
        })
        window.dispatchEvent(
            new CustomEvent("selectedwork_index", {
                detail: closestIndex % baseWorks.length,
            })
        )
        return closestIndex
    }

    const snapToIndex = (index: number) => {
        const el = itemRefs.current[index]
        if (!el) return
        isSnapping.current = true
        const target = el.offsetTop - screenH.current / 2 + el.offsetHeight / 2
        const start = scrollY.current
        const duration = 400
        const startTime = performance.now()
        const animate = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1)
            const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
            const y = start + (target - start) * ease
            applyScroll(y)
            updateVisuals(y)
            if (t < 1) requestAnimationFrame(animate)
            else isSnapping.current = false
        }
        requestAnimationFrame(animate)
    }

    useEffect(() => {
        if (window.innerWidth > 808) return
        const onTouchStart = (e: TouchEvent) => {
            if (overlayOpen.current) return
            touchStartY.current = e.touches[0].clientY
            touchStartScroll.current = scrollY.current
            isSnapping.current = false
            if (snapTimeout.current) clearTimeout(snapTimeout.current)
        }
        const onTouchMove = (e: TouchEvent) => {
            if (overlayOpen.current) return
            e.preventDefault()
            const diff = touchStartY.current - e.touches[0].clientY
            applyScroll(touchStartScroll.current + diff)
            updateVisuals(scrollY.current)
        }
        const onTouchEnd = () => {
            if (overlayOpen.current) return
            const closest = updateVisuals(scrollY.current)
            if (snapTimeout.current) clearTimeout(snapTimeout.current)
            snapTimeout.current = setTimeout(() => {
                snapToIndex(closest)
            }, 150)
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
        setTimeout(() => {
            const el = itemRefs.current[baseWorks.length]
            if (!el) return
            const target = el.offsetTop - screenH.current / 2 + el.offsetHeight / 2
            applyScroll(target)
            updateVisuals(target)
        }, 150)
    }, [mounted])

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
            }}
        >
            <div
                ref={containerRef}
                style={{ width: "100%", willChange: "transform" }}
            >
                <div style={{ height: screenH.current }} />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: `${ITEM_GAP}px`,
                        alignItems: "center",
                        pointerEvents: "auto",
                    }}
                >
                    {works.map((_, i) => {
                        const work = baseWorks[i % baseWorks.length]
                        return (
                            <div
                                key={i}
                                ref={(el) => (itemRefs.current[i] = el)}
                                style={{
                                    width: "clamp(180px, 22vw, 300px)",
                                    overflow: "hidden",
                                    willChange: "transform, filter, opacity",
                                    cursor: "pointer",
                                    pointerEvents: "auto",
                                }}
                                onClick={() => {
                                    window.location.href = work.link
                                }}
                            >
                                <img
                                    src={work.image}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        display: "block",
                                    }}
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