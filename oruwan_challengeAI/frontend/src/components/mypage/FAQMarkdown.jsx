import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdown = `
### 답변

당연히 안됩니다.`;

const FAQMarkdown = () => {
    return <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />;
};

export default FAQMarkdown;
