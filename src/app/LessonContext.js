"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import lessonsData from "../data/lessons.json";
import { useSEO } from "./SEOContext";

const LessonContext = createContext();

export const LessonProvider = ({ children }) => {
    const { setHtmlContent, validationResults } = useSEO();
    const [lessons, setLessons] = useState([]);
    const [currentLessonId, setCurrentLessonId] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // FETCH: Simulate API call
    useEffect(() => {
        const fetchLessons = async () => {
            // In a real app, this would be: await fetch('/api/lessons')
            setLessons(lessonsData);

            // Load progress from persistence layer
            const saved = localStorage.getItem("zenith_progress");
            const initialCompleted = saved ? JSON.parse(saved) : [];
            setCompletedLessons(initialCompleted);

            // Determine starting lesson
            const lastSessionLesson = localStorage.getItem("zenith_current_lesson");
            if (lastSessionLesson) {
                setCurrentLessonId(lastSessionLesson);
            } else {
                setCurrentLessonId(lessonsData[0].id);
            }

            setIsLoading(false);
        };
        fetchLessons();
    }, []);

    const currentLesson = lessons.find(l => l.id === currentLessonId);

    // Persistence side effects
    useEffect(() => {
        if (currentLessonId) {
            localStorage.setItem("zenith_current_lesson", currentLessonId);
        }
    }, [currentLessonId]);

    useEffect(() => {
        localStorage.setItem("zenith_progress", JSON.stringify(completedLessons));
    }, [completedLessons]);

    // Actions
    const goToLesson = useCallback((id) => {
        const lesson = lessons.find(l => l.id === id);
        if (lesson) {
            setCurrentLessonId(id);
            setHtmlContent(lesson.initialHtml);
        }
    }, [lessons, setHtmlContent]);

    const validateLesson = useCallback(() => {
        if (!currentLesson) return { success: false };

        const required = currentLesson.requiredRules;
        const results = required.map(ruleId => validationResults[ruleId]);

        const isPassed = results.every(r => r && r.type === "completed");

        if (isPassed) {
            if (!completedLessons.includes(currentLessonId)) {
                setCompletedLessons(prev => [...prev, currentLessonId]);
            }
            return { success: true, nextLessonId: currentLesson.nextLessonId };
        }

        return { success: false, failedRules: results.filter(r => r.type !== "completed") };
    }, [currentLesson, currentLessonId, validationResults, completedLessons]);

    const value = {
        lessons,
        currentLesson,
        completedLessons,
        goToLesson,
        validateLesson,
        isLoading
    };

    return (
        <LessonContext.Provider value={value}>
            {children}
        </LessonContext.Provider>
    );
};

export const useLessons = () => {
    const context = useContext(LessonContext);
    if (!context) throw new Error("useLessons must be used within LessonProvider");
    return context;
};
