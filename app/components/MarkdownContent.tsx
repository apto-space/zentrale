"use client";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import type { Components } from "react-markdown";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

// Custom component to handle images in markdown
const MarkdownImage: Components["img"] = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle undefined src
  if (!src) return null;

  // Remove Pandoc dimensions
  const normalizedSrc = src
    .replaceAll(/^\.\/media\/media\//g, "/media/")
    .replaceAll(
      /{width=["']?[\d.]+(?:in|px|cm)?["']?\s*height=["']?[\d.]+(?:in|px|cm)?["']?}/g,
      ""
    );

  // If the src is a relative path starting with '/media', it's from our public directory
  const isLocalImage = normalizedSrc.startsWith("/media");

  if (isLocalImage) {
    return (
      <>
        <span className="block my-4">
          <span
            className="relative block w-full h-64 rounded-md overflow-hidden cursor-zoom-in"
            onClick={() => setIsOpen(true)}
          >
            <Image
              src={normalizedSrc}
              alt={alt || "Documentation image"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </span>
        </span>
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={[{ src: normalizedSrc }]}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
          }}
          styles={{
            container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
          }}
        />
      </>
    );
  }

  // For external images, use regular img tag with lightbox
  return (
    <>
      <img
        src={normalizedSrc}
        alt={alt || "Documentation image"}
        className="max-w-full h-auto my-4 cursor-zoom-in"
        onClick={() => setIsOpen(true)}
      />
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={[{ src: normalizedSrc }]}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        }}
      />
    </>
  );
};

// Custom components for better markdown rendering
const components: Components = {
  img: MarkdownImage,
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  p: ({ children }) => <p className=" leading-relaxed">{children}</p>,
  h1: ({ children }) => <h1 className="text-4xl font-bold mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-3xl font-bold mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-2xl font-bold mb-2">{children}</h3>,
  h4: ({ children }) => (
    <h4 className="text-base font-bold text-gray-900 my-2">{children}</h4>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 mb-4 italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 mb-4 overflow-x-auto">
      {children}
    </pre>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:opacity-80"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {children}
    </td>
  ),
};

export default function MarkdownContent({
  content,
  className = "",
}: MarkdownContentProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
