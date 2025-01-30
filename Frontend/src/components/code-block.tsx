import type React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeBlockProps {
  code: string
  language: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  return (
    <div className="rounded-md overflow-hidden">
      <SyntaxHighlighter
        language={'dockerfile'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1rem",
          backgroundColor: "#1e1e1e",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlock