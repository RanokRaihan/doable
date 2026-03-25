import fs from "fs";
import type { Metadata } from "next";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const metadata: Metadata = {
  title: "Terms of Service | GetItDone",
  description:
    "Read GetItDone's Terms of Service to understand your rights and responsibilities when using our task marketplace platform.",
};

export default function TermsOfServicePage() {
  const filePath = path.join(process.cwd(), "src/content/terms-of-service.md");
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <main className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4">
              Legal
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Please read these terms carefully before using the GetItDone
              platform. They set out the rules for our community.
            </p>
          </div>
        </div>
      </div>

      {/* Markdown Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <article
            className="prose prose-gray max-w-none
            prose-headings:font-bold
            prose-h1:text-3xl prose-h1:text-gray-900 prose-h1:mb-2
            prose-h2:text-2xl prose-h2:text-gray-900 prose-h2:mt-12 prose-h2:mb-4 prose-h2:pt-8 prose-h2:border-t prose-h2:border-gray-200
            prose-h3:text-lg prose-h3:text-gray-800 prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-strong:text-gray-800 prose-strong:font-semibold
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-500 hover:prose-a:underline
            prose-ul:text-gray-600 prose-ul:my-4
            prose-ol:text-gray-600 prose-ol:my-4
            prose-li:my-1
            prose-hr:border-gray-200 prose-hr:my-10
            prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:rounded prose-code:px-1 prose-code:py-0.5
            prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-600 prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-md prose-blockquote:py-1
            prose-em:text-gray-500
          "
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </article>
        </div>
      </div>
    </main>
  );
}
