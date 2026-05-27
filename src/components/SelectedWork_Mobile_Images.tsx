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

export default function SelectedWork_Mobile_Images() {
    const containerRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])
    const [isMobile, setIsMobile] = useState(false)
    const [mounted, setMounted] = useState(false)
    const overlayOpen = useRef(false)

    useEffect(() => {
        setMounted(true)
        setIsMobile(window.innerWidth <= 808)
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

    // IntersectionObserver — updates blur/scale/opacity as images enter center
    useEffect(() => {
        if (!mounted || !isMobile) return

        const options = {
            root: containerRef.current,
            rootMargin: "0px",
            threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const el = entry.target as HTMLElement
                const t = entry.intersectionRatio
                el.style.transform = `scale(${0.78 + t * 0.32})`
                el.style.filter = `blur(${(1 - t) * 6}px)`
                el.style.opacity = `${0.35 + t * 0.65}`
                if (t > 0.8) {
                    const index = itemRefs.current.indexOf(el as HTMLDivElement)
                    if (index !== -1) {
                        window.dispatchEvent(new CustomEvent("selectedwork_index", {
                            detail: index % baseWorks.length
                        }))
                    }
                }
            })
        }, options)

        itemRefs.current.forEach((el) => {
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [mounted, isMobile])

    // Center on Riel on load
    useEffect(() => {
        if (!mounted || !isMobile) return
        const centerFirst = () => {
            const el = itemRefs.current[baseWorks.length]
            const container = containerRef.current
            if (!el || !container) return
            container.scrollTop = el.offsetTop - container.clientHeight / 2 + el.offsetHeight / 2
        }
        setTimeout(centerFirst, 150)
        window.addEventListener("loadingdone", centerFirst, { once: true })
        return () => window.removeEventListener("loadingdone", centerFirst)
    }, [mounted, isMobile])

    if (!mounted || !isMobile) return null

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflowY: "scroll",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch" as any,
                scrollSnapType: "y proximity",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
            }}
        >
            <style>{`
                div[data-scroll-container]::-webkit-scrollbar { display: none; }
            `}</style>
            <div style={{ height: "50vh" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "80px", alignItems: "center" }}>
                {works.map((_, i) => {
                    const work = baseWorks[i % baseWorks.length]
                    return (
                        <div
                            key={i}
                            ref={(el) => (itemRefs.current[i] = el)}
                            style={{
                                width: "clamp(200px, 65vw, 340px)",
                                aspectRatio: work.aspectRatio,
                                overflow: "hidden",
                                scrollSnapAlign: "center",
                                willChange: "transform, filter, opacity",
                                cursor: "pointer",
                                flexShrink: 0,
                                transform: "scale(0.78)",
                                filter: "blur(6px)",
                                opacity: "0.35",
                                transition: "transform 0.15s ease, filter 0.15s ease, opacity 0.15s ease",
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