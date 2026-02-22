'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const target = new Date(targetDate).getTime();

        const tick = () => {
            const now = Date.now();
            const diff = Math.max(0, target - now);

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const pad = (n) => String(n).padStart(2, '0');

    return (
        <div className="countdown">
            <div className="countdown-item">
                <div className="countdown-value">{pad(timeLeft.days)}</div>
                <div className="countdown-label">Días</div>
            </div>
            <div className="countdown-item">
                <div className="countdown-value">{pad(timeLeft.hours)}</div>
                <div className="countdown-label">Horas</div>
            </div>
            <div className="countdown-item">
                <div className="countdown-value">{pad(timeLeft.minutes)}</div>
                <div className="countdown-label">Minutos</div>
            </div>
            <div className="countdown-item">
                <div className="countdown-value">{pad(timeLeft.seconds)}</div>
                <div className="countdown-label">Segundos</div>
            </div>
        </div>
    );
}
