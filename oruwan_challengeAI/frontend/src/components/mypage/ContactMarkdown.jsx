import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdown = `
### AIVLE SCHOOL 24조

- 프론트엔드 : 강창진, 김주환, 이재영
- 백엔드 : 민상은, 윤정섭
- AI : 김단은, 김승은
`;

const ContactMarkdown = () => {
    return <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />;
};

export default ContactMarkdown;
