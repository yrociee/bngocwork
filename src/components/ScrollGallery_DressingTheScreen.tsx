import { useEffect, useRef, useState } from "react"

const desktopMedia = [
    { type: "image", src: "https://framerusercontent.com/images/DAVOGzUkG01NMu8gHOCrLwvsrfs.jpg?width=2003&height=3032" },
    { type: "image", src: "https://framerusercontent.com/images/b6ReisxAjbyOSbMnMhdlVA.jpg?width=2004&height=3032" },
    { type: "image", src: "https://framerusercontent.com/images/poeZwWbtmP82YIXfEHY9Qis.png?scale-down-to=4096&width=4664&height=3032" },
    { type: "image", src: "https://framerusercontent.com/images/K0sN7M9yk2wxJs7Ds1wE4A4BVfs.png?scale-down-to=4096&width=4664&height=3032" },
    { type: "image", src: "https://framerusercontent.com/images/Egu7trvamoROSdrTBgey2Ub3i4.png?scale-down-to=4096&width=4664&height=3030" },
    { type: "image", src: "https://framerusercontent.com/images/NBsUH88AIPcfBIAg4XgK87LF1Y8.png?width=4664&height=3032", fit: "cover" },
    { type: "image", src: "https://framerusercontent.com/images/Av7l6T0QcZHgBMyJBpq17U8D3oY.png?scale-down-to=4096&width=4664&height=3032" },
    { type: "image", src: "https://framerusercontent.com/images/hWtYnT7sA7n6ohNAxGYV9YF3tg0.png?width=4664&height=3031" },
    { type: "video", src: "https://framerusercontent.com/assets/RvBEkbnJelMEylqRyYEgNbQgNg.mp4", fit: "cover" },
    { type: "image", src: "https://framerusercontent.com/images/uUY8JapBp83M8VQAE3E4etlfdmk.png?scale-down-to=4096&width=4664&height=3030" },
]

const mobileMedia = [
    { type: "image", src: "https://framerusercontent.com/images/e1DYt50gNEuVEbRaLv7CBnf6QBo.png?width=3020&height=6566", fit: "cover" },
    { type: "image", src: "https://framerusercontent.com/images/PyD9GdMBkvcohjfjVoiUUNSD7U.png?width=3020&height=6566", fit: "cover" },
    { type: "image", src: "https://framerusercontent.com/images/YpmJaF1PfPZbiMQXG7oCW2sges.png?width=3020&height=6566" },
    { type: "image", src: "https://framerusercontent.com/images/MRHAzkQRTXqsVRmd2EPuXFvxJvo.png?width=3020&height=6566" },
    { type: "image", src: "https://framerusercontent.com/images/14x2vMBuC6ckW4f9sXNWuNEiBF4.png?width=3020&height=6566" },
    { type: "image", src: "https://framerusercontent.com/images/Ml6J3HuPnYn8dQSx3Jg7xJqjXo.png?width=3020&height=6566", fit: "cover" },
    { type: "image", src: "https://framerusercontent.com/images/1Mzo5loyDWookwwwchjOfOwM.png?width=3020&height=6566", fit: "cover" },
    { type: "image", src: "https://framerusercontent.com/images/4U8qOCJ6LHvCpRxclHVV45tJio.png?width=3020&height=6566", fit: "cover" },
    { type: "video", src: "https://framerusercontent.com/assets/P3A8EFHJqybBKuwn4IFIZsqJw.mp4", fit: "cover" },
    { type: "image", src: "https://framerusercontent.com/images/finwxb9D5PxfmF1kCVHyTaJ6grs.png?width=3020&height=6566", fit: "cover" },
]

export default function ScrollGallery_DressingTheScreen() {
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
            if (i === current) { v.currentTime = 0; v.play() }
            else { v.pause(); v.currentTime = 0 }
        })
    }, [current])

    useEffect(() => {
        const onReset = () => {
            setCurrent(0)
            window.dispatchEvent(new CustomEvent("scrollgallery_index", { detail: 0 }))
        }
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
                            <img src={item.src} style={{ width: "100%", height: "100%", objectFit: (item as any).fit ?? "contain", pointerEvents: "none", userSelect: "none", display: "block" }} />
                        ) : (
                            <video ref={(el) => { if (el) videoRefs.current[i] = el }} src={item.src} loop muted playsInline style={{ width: "100%", height: "100%", objectFit: (item as any).fit ?? "contain", pointerEvents: "none", display: "block" }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}