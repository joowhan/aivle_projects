import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdown = `
### 안녕하세요?

이 공지사항은 Markdown으로 작동되었습니다.

해당 기능이 잘 되는지 테스트 중입니다.

더 이상 쓸 말이 없네요.`;

const NoticeMarkdown = () => {
    return <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />;
};

export default NoticeMarkdown;
