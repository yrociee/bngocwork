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
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])
    const rafRef = useRef<number | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setIsMobile(window.innerWidth <= 808)
    }, [])

    // Unlock native scroll on mobile
    useEffect(() => {
        if (!mounted || !isMobile) return
        document.body.style.overflow = ""
        document.body.style.position = ""
        document.body.style.height = ""
        document.documentElement.style.overflow = ""
        document.documentElement.style.height = ""
    }, [mounted, isMobile])

    // Track scroll and update visuals
    useEffect(() => {
        if (!mounted || !isMobile) return

        const update = () => {
            const mid = window.innerHeight / 2
            let closestIndex = 0
            let closestDist = Infinity

            itemRefs.current.forEach((el, i) => {
                if (!el) return
                const rect = el.getBoundingClientRect()
                const center = rect.top + rect.height / 2
                const dist = Math.abs(center - mid)
                if (dist < closestDist) { closestDist = dist; closestIndex = i }

                const maxDist = window.innerHeight * 0.7
                const t = Math.max(0, 1 - dist / maxDist)
                el.style.transform = `scale(${0.78 + t * 0.32})`
                el.style.filter = `blur(${(1 - t) * 7}px)`
                el.style.opacity = `${0.3 + t * 0.7}`
            })

            window.dispatchEvent(new CustomEvent("selectedwork_index", {
                detail: closestIndex % baseWorks.length
            }))

            rafRef.current = requestAnimationFrame(update)
        }

        rafRef.current = requestAnimationFrame(update)
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    }, [mounted, isMobile])

    // Center on Riel on load
    useEffect(() => {
        if (!mounted || !isMobile) return
        const centerFirst = () => {
            const el = itemRefs.current[baseWorks.length]
            if (!el) return
            const rect = el.getBoundingClientRect()
            const offset = rect.top + window.scrollY - window.innerHeight / 2 + rect.height / 2
            window.scrollTo({ top: offset, behavior: "instant" as ScrollBehavior })
        }
        setTimeout(centerFirst, 200)
        window.addEventListener("loadingdone", centerFirst, { once: true })
        return () => window.removeEventListener("loadingdone", centerFirst)
    }, [mounted, isMobile])

    if (!mounted || !isMobile) return null

    return (
        <div style={{ width: "100%", paddingTop: "50vh", paddingBottom: "50vh" }}>
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
        </div>
    )
}