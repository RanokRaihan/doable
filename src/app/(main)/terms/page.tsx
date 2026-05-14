import MarkdownArticle from "@/components/ui/MarkdownArticle";
import fs from "fs";
import type { Metadata } from "next";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read Doable's Terms of Service to understand your rights and responsibilities when using our task marketplace platform.",
  openGraph: {
    title: "Terms of Service | Doable",
    description:
      "Understand your rights and responsibilities as a Doable community member.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Doable Terms of Service" }],
  },
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
              Please read these terms carefully before using the Doable
              platform. They set out the rules for our community.
            </p>
          </div>
        </div>
      </div>

      {/* Markdown Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <MarkdownArticle>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </MarkdownArticle>
        </div>
      </div>
    </main>
  );
}
