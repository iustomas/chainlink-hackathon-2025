"use client";

// react
import React, { useState, useEffect } from "react";

// react-markdown
import ReactMarkdown from "react-markdown";

/**
 * TypeWriter component for animated text display
 * @param text - The text to animate
 * @param speed - Speed of animation in milliseconds per character (default: 50)
 */
export default function TypeWriter({
  text,
  speed = 50,
}: {
  text: string;
  speed?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
}
