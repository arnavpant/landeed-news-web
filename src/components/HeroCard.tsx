"use client";

import { Article } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface HeroCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

export default function HeroCard({ article, onClick }: HeroCardProps) {
  return (
    <div
      className="group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer"
      onClick={() => onClick(article)}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image area */}
        <div className="w-full lg:w-3/5 h-[400px] overflow-hidden">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.headline}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary/30 text-8xl">
                landscape
              </span>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="w-full lg:w-2/5 p-10 lg:p-12 flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest rounded-full w-fit">
              {article.categories[0] ?? "News"}
            </span>
          </div>

          <h3 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
            {article.headline}
          </h3>

          {article.summary && (
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light">
              {article.summary}
            </p>
          )}

          <div className="pt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                {formatDistanceToNow(article.publishedAt, {
                  addSuffix: true,
                })}
                {article.author && (
                  <span className="text-slate-400 font-medium">
                    {" "}· {article.author}
                  </span>
                )}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {article.sourceName}
              </span>
            </div>
            <button className="size-14 flex items-center justify-center bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
