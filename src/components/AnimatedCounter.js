'use client';

import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }) {
    // Remove commas to parse correct integer
    const rawEndString = String(end).replace(/,/g, '');
    const endValue = parseInt(rawEndString, 10);
    const isNumeric = !isNaN(endValue);

    const [count, setCount] = useState(isNumeric ? 0 : end);
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only animate once
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible || !isNumeric) return;

        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const currentVal = Math.floor(easeProgress * endValue);
            // Format number with commas
            setCount(currentVal.toLocaleString());

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(endValue.toLocaleString());
            }
        };

        window.requestAnimationFrame(step);
    }, [isVisible, endValue, duration, isNumeric]);

    return (
        <span ref={elementRef}>
            {prefix}{count}{suffix}
        </span>
    );
}
