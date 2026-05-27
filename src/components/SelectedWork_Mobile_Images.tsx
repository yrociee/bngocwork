import { useEffect, useRef, useState } from "react"

const baseWorks = [
    {
        title: "RIEL STUDIO",
        type: "PACKAGING",
        image: "https://res.cloudinary.com/doaofjidq/image/upload/w_750,f_auto,q_auto/riel_studio_qchknq.webp",
        aspectRatio: "3414 / 2727",
        link: "/projects/riel-studio",
    },
    {
        title: "UNBOXED MAGAZINE",
        type: "PUBLICATION",
        image: "https://res.cloudinary.com/doaofjidq/image/upload/w_750,f_auto,q_auto/unboxed_magazine_psndx2.webp",
        aspectRatio: "2679 / 3660",
        link: "/projects/unboxed-magazine",
    },
    {
        title: "DRESSING THE SCREEN",
        type: "BRANDING ∙ PRINT",
        image: "https://res.cloudinary.com/doaofjidq/image/upload/w_750,f_auto,q_auto/dressing_the_screen_cgi9uo.webp",
        aspectRatio: "2525 / 1780",
        link: "/projects/dressing-the-screen",
    },
    {
        title: "DAZED MAGAZINE",
        type: "PUBLICATION",
        image: "https://res.cloudinary.com/doaofjidq/image/upload/w_750,f_auto,q_auto/dazed_magazine_dphwdo.webp",
        aspectRatio: "2823 / 3678",
        link: "/projects/dazed-magazine",
    },
]

const works = [...baseWorks, ...baseWorks, ...baseWorks]
const ITEM_GAP = 80
const IMG_WIDTH = "clamp(200px, 65vw, 340px)"

export default function SelectedWork_Mobile_Images() {
    const containerRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])
    const posY = useRef(0)
    const targetY = useRef(0)
    const touchStartY = useRef(0)
    const touchStartPos = useRef(0)
    const lastTouchY = useRef(0)
    const lastTouchTime = useRef(0)
    const velocityY = useRef(0)
    const rafRef = useRef<number | null>(null)
    const screenH = useRef(0)
    const overlayOpen = useRef(false)
    const isTouching = useRef(false)
    const [mounted, setMounted] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setMounted(true)
        setIsMobile(window.innerWidth <= 808)
        screenH.current = window.visualViewport?.height ?? window.innerHeight
    }, [])

    useEffect(() => {
        if (!mounted || !isMobile) return
        const style = document.createElement("style")
        style.textContent = `
            html, body {
                overflow: hidden !important;
                position: fixed !important;
                width: 100% !important;
                height: 100% !important;
                touch-action: none !important;
            }
            ::-webkit-scrollbar { display: none; }
        `
        document.head.appendChild(style)
        return () => document.head.removeChild(style)
    }, [mounted, isMobile])

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

    const getContainerHeight = () => containerRef.current?.scrollHeight ?? 0

    const loopY = (y: number) => {
        const h = getContainerHeight()
        const oneSet = h / 3
        if (y > oneSet * 2) y -= oneSet
        if (y < oneSet * 0.5) y += oneSet
        return y
    }

    const updateVisuals = (y: number) => {
        if (!containerRef.current) return
        containerRef.current.style.transform = `translateY(-${y}px)`

        const mid = screenH.current / 2
        let closestIndex = 0
        let closestDist = Infinity

        itemRefs.current.forEach((el, i) => {
            if (!el) return
            const center = el.offsetTop - y + el.offsetHeight / 2
            const dist = Math.abs(center - mid)
            if (dist < closestDist) { closestDist = dist; closestIndex = i }
            const maxDist = screenH.current * 0.7
            const t = Math.max(0, 1 - dist / maxDist)
            el.style.transform = `scale(${0.78 + t * 0.32})`
            el.style.filter = `blur(${(1 - t) * 7}px)`
            el.style.opacity = `${0.3 + t * 0.7}`
        })

        window.dispatchEvent(new CustomEvent("selectedwork_index", {
            detail: closestIndex % baseWorks.length
        }))
    }

    // Smooth lerp animation loop
    useEffect(() => {
        if (!mounted || !isMobile) return

        const tick = () => {
            if (!isTouching.current) {
                // Apply momentum
                targetY.current += velocityY.current
                velocityY.current *= 0.92
                if (Math.abs(velocityY.current) < 0.1) velocityY.current = 0
            }

            // Lerp toward target
            const ease = 0.12
            posY.current += (targetY.current - posY.current) * ease
            posY.current = loopY(posY.current)
            targetY.current = loopY(targetY.current)

            updateVisuals(posY.current)
            rafRef.current = requestAnimationFrame(tick)
        }

        rafRef.current = requestAnimationFrame(tick)
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    }, [mounted, isMobile])

    useEffect(() => {
        if (!mounted || !isMobile) return

        const onTouchStart = (e: TouchEvent) => {
            if (overlayOpen.current) return
            isTouching.current = true
            touchStartY.current = e.touches[0].clientY
            touchStartPos.current = targetY.current
            lastTouchY.current = e.touches[0].clientY
            lastTouchTime.current = Date.now()
            velocityY.current = 0
        }

        const onTouchMove = (e: TouchEvent) => {
            if (overlayOpen.current) return
            e.preventDefault()
            const now = Date.now()
            const dt = now - lastTouchTime.current
            const dy = lastTouchY.current - e.touches[0].clientY
            if (dt > 0) velocityY.current = dy / dt * 16
            lastTouchY.current = e.touches[0].clientY
            lastTouchTime.current = now
            const diff = touchStartY.current - e.touches[0].clientY
            targetY.current = touchStartPos.current + diff
        }

        const onTouchEnd = () => {
            if (overlayOpen.current) return
            isTouching.current = false
            // velocity already set during move, momentum continues in tick
        }

        window.addEventListener("touchstart", onTouchStart, { passive: true })
        window.addEventListener("touchmove", onTouchMove, { passive: false })
        window.addEventListener("touchend", onTouchEnd, { passive: true })
        return () => {
            window.removeEventListener("touchstart", onTouchStart)
            window.removeEventListener("touchmove", onTouchMove)
            window.removeEventListener("touchend", onTouchEnd)
        }
    }, [mounted, isMobile])

    // Center on Riel on load
    useEffect(() => {
        if (!mounted || !isMobile) return
        const centerFirst = () => {
            const el = itemRefs.current[baseWorks.length]
            if (!el) return
            const y = el.offsetTop - screenH.current / 2 + el.offsetHeight / 2
            posY.current = y
            targetY.current = y
        }
        setTimeout(centerFirst, 200)
        window.addEventListener("loadingdone", centerFirst, { once: true })
        return () => window.removeEventListener("loadingdone", centerFirst)
    }, [mounted, isMobile])

    if (!mounted || !isMobile) return null

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
        }}>
            <div ref={containerRef} style={{ width: "100%", willChange: "transform" }}>
                <div style={{ height: screenH.current }} />
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${ITEM_GAP}px`,
                    alignItems: "center",
                }}>
                    {works.map((_, i) => {
                        const work = baseWorks[i % baseWorks.length]
                        return (
                            <div
                                key={i}
                                ref={(el) => (itemRefs.current[i] = el)}
                                style={{
                                    width: IMG_WIDTH,
                                    aspectRatio: work.aspectRatio,
                                    overflow: "hidden",
                                    willChange: "transform, filter, opacity",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                    transform: "scale(0.78)",
                                    filter: "blur(7px)",
                                    opacity: "0.3",
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
                <div style={{ height: screenH.current }} />
            </div>
        </div>
    )
}