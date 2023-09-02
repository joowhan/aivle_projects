import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdown = `
안녕하세요?

이거 잘되는지

테스트 중입니다.

제발제발제발제발 잘되었으면 좋겠네요.

감사합니다.

한 줄만 더 길게 쓸게요.`;

const TestMarkdown = () => {
    return <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />;
};

export default TestMarkdown;
