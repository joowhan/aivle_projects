import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdown = `
- ### 개인정보 수집·이용 동의
    - 에이블스쿨 및 에이블스쿨 24조는 오루완 서비스 회원가입, 고객상담 및 고지사항 전달 등을 위해 아래와 같이 개인정보를 수집·이용합니다.

    | 수집 목적                        | 수집 항목        | 보유·이용기간           |
    |-|-|-|
    | 회원 식별 및 회원제 서비스 제공  | 이메일, 비밀번호 | 수집일부터 최대 1년까지 |
    | 고객 인증 서비스                 | 전화번호         | 수집일부터 최대 1년까지 |
    | 서비스 변경사항 및 고지사항 전달 | 이메일           | 수집일부터 최대 1년까지 |
    
    - 자세한 내용은 개인정보 처리방침을 확인해주세요
    - 귀하는 위와 같이 개인정보를 수집·이용하는데 동의를 거부할 권리가 있습니다. 필수 수집 항목에 대한 동의를 거절하는 경우 서비스 이용이 제한 될 수 있습니다.`;

const AgreeDetailMarkdown = () => {
    return <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />;
};

export default AgreeDetailMarkdown;
