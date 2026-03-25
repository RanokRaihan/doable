const MarkdownArticle = ({ children }: { children: React.ReactNode }) => {
  return (
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
      {children}
    </article>
  );
};

export default MarkdownArticle;
