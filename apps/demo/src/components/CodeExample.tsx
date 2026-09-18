import { useState } from 'react';

interface CodeExampleProps {
  code: string;
  title?: string;
}

export function CodeExample({ code, title = 'Code' }: CodeExampleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span>{title}</span>
        <button className="code-copy-btn" onClick={handleCopy} id="code-copy-btn">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="code-content">
        <pre>{code}</pre>
      </div>
    </div>
  );
}
