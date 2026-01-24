"use client";
import { Lightbulb } from "lucide-react";
import RuleCard from "./RuleCard";
import { useSEO } from "../app/SEOContext";
import { useLessons } from "../app/LessonContext";

export default function Sidebar() {
  const { validationResults } = useSEO();
  const { currentLesson, isLoading } = useLessons();

  if (isLoading || !currentLesson) {
    return (
      <aside className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </aside>
    );
  }

  // Filter rules based on current lesson
  const lessonRules = currentLesson.requiredRules.map(id => {
    return { id, ...validationResults[id] };
  });

  const completedCount = lessonRules.filter(r => r.type === "completed").length;
  const progress = Math.round((completedCount / lessonRules.length) * 100);
  const activeIssue = lessonRules.find(r => r.type === "active");

  return (
    <aside className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark flex flex-col">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-lg font-bold text-[#111418] dark:text-white leading-tight">
          {currentLesson.title}
        </h1>
        <p className="text-[#617589] dark:text-gray-400 text-xs mt-1 leading-relaxed">
          {currentLesson.description}
        </p>

        <div className="mt-6">
          <div className="flex gap-2 justify-between items-end mb-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Lesson Progress</p>
            <p className="text-sm font-bold text-[#111418] dark:text-white">{progress}%</p>
          </div>
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 h-2 overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-[#617589] dark:text-gray-400 text-[11px] leading-relaxed mt-2 italic">
            {progress === 100 ? "Ready to validate!" : activeIssue ? `Goal: ${activeIssue.desc}` : "Keep working on your code."}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {lessonRules.map((rule) => <RuleCard key={rule.id} {...rule} />)}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="w-full flex items-center justify-center gap-2 rounded-lg h-11 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Lightbulb className="size-5" />
          Get a Hint
        </button>
      </div>
    </aside>
  );
}



