import { useEffect, useState } from "react"

export default function Scroll_Top_Unboxed() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const onReset = () => setCurrent(0)
        window.addEventListener("scrollgallery_reset", onReset)
        return () => window.removeEventListener("scrollgallery_reset", onReset)
    }, [])

    useEffect(() => {
        const onIndex = (e: Event) => {
            setCurrent((e as CustomEvent).detail)
        }
        window.addEventListener("scrollgallery_index", onIndex)
        return () => window.removeEventListener("scrollgallery_index", onIndex)
    }, [])

    const handleClick = () => {
        window.dispatchEvent(new CustomEvent("scrollgallery_reset"))
    }

    const isLast = current === 6

    return (
        <div
            onClick={handleClick}
            style={{
                fontFamily: "Coordinates Variable",
                fontSize: "10px",
                letterSpacing: "0.02em",
                color: "rgb(116, 116, 116)",
                cursor: isLast ? "pointer" : "default",
                userSelect: "none",
                mixBlendMode: "difference",
                opacity: isLast ? 1 : 0,
                transform: isLast ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                pointerEvents: isLast ? "auto" : "none",
            }}
        >
            ↑ Back to top
        </div>
    )
}
