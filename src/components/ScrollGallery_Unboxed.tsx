import { useEffect, useRef, useState } from "react"

const desktopMedia = [
    { type: "video", src: "https://res.cloudinary.com/doaofjidq/video/upload/q_auto/unboxed_magazine_1_gc8cur.mp4", fit: "cover" },
    { type: "image", src: "https://res.cloudinary.com/doaofjidq/image/upload/v1779799582/unboxed_magazine_2_b6xbhw.webp" },
    { type: "image", src: "https://res.cloudinary.com/doaofjidq/image/upload/v1779799584/unboxed_magazine_3_cigqqr.webp", fit: "cover" },
    { type: "image", src: "https://res.cloudinary.com/doaofjidq/image/upload/v1779799584/unboxed_magazine_4_nzl3lu.webp", fit: "cover" },
    { type: "image", src: "https://res.cloudinary.com/doaofjidq/image/upload/v1779799585/unboxed_magazine_5_xtye7x.webp", fit: "cover" },
    { type: "video", src: "https://res.cloudinary.com/doaofjidq/video/upload/q_auto/unboxed_magazine_6_csxify.mp4", fit: "cover" },
    { type: "image", src: "https://res.cloudinary.com/doaofjidq/image/upload/v1779799586/unboxed_magazine_7_klmzag.webp", fit: "cover" },
]

const mobileMedia = [
    { type: "video", src: "https://res.cloudinary.com/doaofjidq/video/upload/q_auto/unboxed_magazine_1_h4vnuv.mp4", fit: "cover" },
    { type: "image", src: "https://res.cloudinary.com/doaofjidq/image/upload/v1779799726/unboxed_magazine_2_yynp0r.webp" },
    { type: "image", src: "https://res.cloudinary.com/doaofjidq/image/upload/v1779799728/unboxed_magazine_3_fd29ur.webp", fit: "cover" },
    { type: "image", src: "https://res.cloudinary.com/doaofjidq/image/upload/v1779799729/unboxed_magazine_4_o4eofd.webp", fit: "cover" },
    { type: "image", src: "https://res.cloudinary.com/doaofjidq/image/upload/v1779799732/unboxed_magazine_5_oi4feg.webp", fit: "cover" },
    { type: "video", src: "https://res.cloudinary.com/doaofjidq/video/upload/q_auto/unboxed_magazine_6_yeijqf.mp4", fit: "cover" },
    { type: "image", src: "https://res.cloudinary.com/doaofjidq/image/upload/v1779799734/unboxed_magazine_7_jneull.webp", fit: "cover" },
]

export default function ScrollGallery_Unboxed() {
    const [current, setCurrent] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const videoRefs = useRef<HTMLVideoElement[]>([])
    const lastTouch = useRef(0)
    const touchStartY = useRef(0)
    const overlayOpen = useRef(false)

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 808px)")
        setIsMobile(mq.matches)
    }, [])

    useEffect(() => {
        const onOpen = () => { overlayOpen.current = true }
        const onClose = () => { overlayOpen.current = false }
        window.addEventListener("overlayopen", onOpen)
        window.addEventListener("overlayclose", onClose)
        window.addEventListener("projectdetailsopen", onOpen)
        window.addEventListener("projectdetailsclose", onClose)
        return () => {
            window.removeEventListener("overlayopen", onOpen)
            window.removeEventListener("overlayclose", onClose)
            window.removeEventListener("projectdetailsopen", onOpen)
            window.removeEventListener("projectdetailsclose", onClose)
        }
    }, [])

    useEffect(() => {
        videoRefs.current.forEach((v, i) => {
            if (!v) return
            if (i === current) { v.currentTime = 0; v.load(); v.play() }
            else { v.pause(); v.currentTime = 0 }
        })
    }, [current])

    useEffect(() => {
        const tryPlay = () => {
            const v = videoRefs.current.find((v) => v)
            if (!v) return
            v.load()
            v.play().catch(() => {
                const unlock = () => { v.play().catch(() => {}); window.removeEventListener("touchstart", unlock) }
                window.addEventListener("touchstart", unlock, { once: true })
            })
        }
        const timer = setTimeout(tryPlay, 500)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const onReset = () => setCurrent(0)
        window.addEventListener("scrollgallery_reset", onReset)
        return () => window.removeEventListener("scrollgallery_reset", onReset)
    }, [])

    const media = isMobile ? mobileMedia : desktopMedia

    const goTo = (index: number) => {
        setCurrent(index)
        window.dispatchEvent(new CustomEvent("scrollgallery_index", { detail: index }))
    }
    const goNext = (cur: number) => { if (cur < media.length - 1) goTo(cur + 1) }
    const goPrev = (cur: number) => { if (cur > 0) goTo(cur - 1) }

    useEffect(() => {
        const onTouchStart = (e: TouchEvent) => {
            if (overlayOpen.current) return
            touchStartY.current = e.touches[0].clientY
        }
        const onTouchMove = (e: TouchEvent) => {
            if (overlayOpen.current) return
            e.preventDefault()
        }
        const onTouchEnd = (e: TouchEvent) => {
            if (overlayOpen.current) return
            const diff = touchStartY.current - e.changedTouches[0].clientY
            if (Math.abs(diff) < 40) return
            const now = Date.now()
            if (now - lastTouch.current < 600) return
            lastTouch.current = now
            if (diff > 0) goNext(current)
            else goPrev(current)
        }
        window.addEventListener("touchstart", onTouchStart, { passive: true })
        window.addEventListener("touchmove", onTouchMove, { passive: false })
        window.addEventListener("touchend", onTouchEnd, { passive: true })
        return () => {
            window.removeEventListener("touchstart", onTouchStart)
            window.removeEventListener("touchmove", onTouchMove)
            window.removeEventListener("touchend", onTouchEnd)
        }
    }, [current, isMobile])

    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            if (overlayOpen.current) return
            const now = Date.now()
            if (now - lastTouch.current < 600) return
            lastTouch.current = now
            if (e.deltaY > 0) goNext(current)
            else goPrev(current)
        }
        window.addEventListener("wheel", onWheel, { passive: false })
        return () => window.removeEventListener("wheel", onWheel)
    }, [current, isMobile])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (overlayOpen.current) return
            const now = Date.now()
            if (now - lastTouch.current < 600) return
            lastTouch.current = now
            if (e.key === "ArrowDown" || e.key === "ArrowRight") goNext(current)
            else if (e.key === "ArrowUp" || e.key === "ArrowLeft") goPrev(current)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [current, isMobile])

    return (
        <div style={{ width: "100%", height: "100svh", overflow: "hidden", position: "fixed", top: 0, left: 0, background: "transparent" }}>
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                transform: `translateY(-${current * 100}svh)`,
                transition: "transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)",
                willChange: "transform",
            }}>
                {media.map((item, i) => (
                    <div key={i} style={{ width: "100%", height: "100svh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {item.type === "image" ? (
                            <img src={item.src} loading={i === 0 ? "eager" : "lazy"} style={{ width: "100%", height: "100%", objectFit: (item as any).fit ?? "contain", pointerEvents: "none", userSelect: "none", display: "block" }} />
                        ) : (
                            <video ref={(el) => { if (el) videoRefs.current[i] = el }} src={item.src} loop muted playsInline preload="auto" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", display: "block" }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}