import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  children: string;
}

const Markdown = ({ children }: MarkdownProps) => {
  return (
    <ReactMarkdown
      className={"space-y-5"}
      components={{
        ul: (props) => <ul className="list-disc list-inside" {...props} />,
        a: (props) => (
          <a className="text-green-500 underline" target="_blank" {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
