'use client';

import { useState, useEffect } from 'react';

export default function TypewriterEffect({ words, typingSpeed = 100, pauseTime = 2000 }) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[currentWordIndex];

        const type = () => {
            // If doing deletion
            if (isDeleting) {
                setCurrentText(currentWord.substring(0, currentText.length - 1));
            } else {
                // If doing typing
                setCurrentText(currentWord.substring(0, currentText.length + 1));
            }

            // Check if finished typing
            if (!isDeleting && currentText === currentWord) {
                // Pause then start deleting
                setTimeout(() => setIsDeleting(true), pauseTime);
            }
            // Check if finished deleting
            else if (isDeleting && currentText === '') {
                setIsDeleting(false);
                // Move to the next word
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
            }
        };

        const timer = setTimeout(type, isDeleting ? typingSpeed / 2 : typingSpeed);
        return () => clearTimeout(timer);

    }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, pauseTime]);

    return (
        <span className="typewriter-text" style={{ position: 'relative', display: 'inline-block' }}>
            {currentText}
            <span className="cursor" style={{
                borderRight: '0.1em solid var(--primary-color)',
                animation: 'blink 1s step-end infinite',
                marginLeft: '2px'
            }}>&nbsp;</span>
        </span>
    );
}
