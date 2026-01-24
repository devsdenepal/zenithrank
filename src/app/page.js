"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  Code,
  Columns,
  Smartphone,
  AlertCircle,
  CheckCircle,
  FileText,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Monitor
} from "lucide-react";
import { useSEO } from "./SEOContext";
import { useLessons } from "./LessonContext";


export default function Page() {
  const { htmlContent, setHtmlContent, validationResults } = useSEO();
  const { validateLesson, goToLesson, currentLesson } = useLessons();
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [viewMode, setViewMode] = useState("split"); // split, mobile, full
  const [isResizing, setIsResizing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const iframeRef = useRef(null);

  const requiredRuleIds = currentLesson?.requiredRules || [];
  const lessonRules = requiredRuleIds.map(id => validationResults[id]);
  const activeIssues = lessonRules.filter(r => r && r.type === "active").length;

  const handleValidate = () => {
    const result = validateLesson();
    if (result.success) {
      setFeedback({ type: "success", title: "Phenomenal Job!", message: "You've successfully mastered this SEO concept." });
    } else {
      setFeedback({ type: "error", title: "Keep Refining", message: "Check your progress in the sidebar to see what's missing." });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleNextLesson = () => {
    if (currentLesson.nextLessonId) {
      goToLesson(currentLesson.nextLessonId);
      setFeedback(null);
    } else {
      setFeedback({ type: "success", title: "Course Complete!", message: "You are now a Zenith SEO expert." });
    }
  };


  // Sync is now handled by srcdoc directly on the iframe

  // Handle Resizing
  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);
  const resize = useCallback((e) => {
    if (isResizing) {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setEditorWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  // Force refresh function
  const refreshPreview = useCallback(() => {
    if (iframeRef.current) {
      const currentSrcDoc = iframeRef.current.srcdoc;
      iframeRef.current.srcdoc = "";
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.srcdoc = currentSrcDoc;
      }, 10);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden select-none">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("full")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "full" ? "text-primary bg-primary/10" : "text-gray-500 hover:text-primary"}`}
          >
            <Code className="size-5" />
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "split" ? "text-primary bg-primary/10" : "text-gray-500 hover:text-primary"}`}
          >
            <Columns className="size-5" />
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "mobile" ? "text-primary bg-primary/10" : "text-gray-500 hover:text-primary"}`}
          >
            <Smartphone className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${activeIssues > 0
            ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/40"
            : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/40"
            }`}>
            {activeIssues > 0 ? <AlertCircle className="size-4" /> : <CheckCircle className="size-4" />}
            <span className="text-xs font-bold uppercase tracking-tight">
              {activeIssues > 0 ? `${activeIssues} Issue${activeIssues > 1 ? "s" : ""} Remaining` : "Concepts Applied"}
            </span>
          </div>
          <button
            onClick={handleValidate}
            className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white gap-2 text-sm font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all"
          >
            <CheckCircle className="size-5" />
            <span>Validate Lesson</span>
          </button>
        </div>

      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Feedback Overlay */}
        {feedback && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-background-dark/60 backdrop-blur-sm transition-all">
            <div className={`max-w-md w-full mx-4 p-8 rounded-2xl shadow-2xl border ${feedback.type === "success"
                ? "bg-white dark:bg-gray-800 border-green-100 dark:border-green-900/30"
                : "bg-white dark:bg-gray-800 border-red-100 dark:border-red-900/30"
              }`}>
              <div className="flex flex-col items-center text-center">
                <div className={`size-16 rounded-full flex items-center justify-center mb-4 ${feedback.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                  {feedback.type === "success" ? <CheckCircle className="size-8" /> : <AlertCircle className="size-8" />}
                </div>
                <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-2">{feedback.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">{feedback.message}</p>

                {feedback.type === "success" ? (
                  <button
                    onClick={handleNextLesson}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continue to Next Lesson</span>
                    <ArrowRight className="size-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setFeedback(null)}
                    className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Got it
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Code Editor Pane */}

        {(viewMode === "split" || viewMode === "full") && (
          <div
            style={{ width: viewMode === "full" ? "100%" : `${editorWidth}%` }}
            className="flex flex-col bg-[#1e1e1e] overflow-hidden"
          >
            <div className="px-4 py-2 bg-[#252526] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="text-gray-400 size-4" />
                <span className="text-[11px] font-medium text-gray-300 uppercase tracking-widest">index.html</span>
              </div>
              <div className="text-[10px] text-gray-500 font-mono">HTML5</div>
            </div>

            <div className="flex-1 overflow-hidden relative">
              <CodeMirror
                value={htmlContent}
                height="100%"
                theme={oneDark}
                extensions={[html()]}
                onChange={(value) => setHtmlContent(value)}
                className="text-sm h-full"
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  highlightActiveLine: true,
                }}
              />
            </div>
          </div>
        )}

        {/* Resizer */}
        {viewMode === "split" && (
          <div
            onMouseDown={startResizing}
            className="w-1.5 h-full cursor-col-resize bg-gray-200 dark:bg-gray-800 hover:bg-primary transition-colors z-10"
          />
        )}

        {/* Preview Pane */}
        {(viewMode === "split" || viewMode === "mobile") && (
          <div
            style={{ width: viewMode === "mobile" ? "100%" : `${100 - editorWidth}%` }}
            className="flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden"
          >
            <div className="bg-white dark:bg-background-dark px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <div className="flex gap-2">
                <ArrowLeft className="text-gray-400 size-4 cursor-pointer hover:text-gray-600" />
                <ArrowRight className="text-gray-400 size-4 cursor-pointer hover:text-gray-600" />
                <RotateCw
                  className="text-gray-400 size-4 cursor-pointer hover:text-primary transition-colors"
                  onClick={refreshPreview}
                />
              </div>
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded h-7 flex items-center px-3 text-[11px] text-gray-500 font-medium">
                https://ecogarden.example.com
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Monitor className="size-4" />
                <span className="text-[10px] font-bold">LIVE</span>
              </div>
            </div>

            <div className={`flex-1 overflow-hidden p-6 flex justify-center items-start transition-all ${viewMode === "mobile" ? "bg-gray-200 dark:bg-black/20" : ""}`}>
              <div className={`shadow-2xl rounded-xl overflow-hidden bg-white transition-all duration-300 ${viewMode === "mobile" ? "w-[375px] h-[667px] border-8 border-gray-800 rounded-[40px]" : "w-full h-full border border-gray-200 dark:border-gray-800"
                }`}>
                <iframe
                  ref={iframeRef}
                  srcDoc={htmlContent}
                  title="Live Preview"
                  className="w-full h-full bg-white"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
