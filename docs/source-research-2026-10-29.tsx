import { Page, Section, Text, BulletList, Table, Rows, Steps, Callout, Quote, LinkCards, TableOfContents } from "grok/canvas";

export default function App() {
  return (
    <Page
      title="그록봇 리서치: 최신 업데이트·사용 사례·팁"
      summary="2026-10-29 기준. 공식 변경 기록, 문서, @bot 계정, X·Reddit·블로그 사례를 모아 최근 바뀐 점과 실제 활용법, 주의할 점, Matthew님한테 맞는 활용법을 정리했어요."
      width="column"
      lang="ko"
    >
      <TableOfContents
        items={[
          { label: "한눈에 요약", id: "summary" },
          { label: "최신 업데이트 타임라인", id: "timeline" },
          { label: "사용 사례", id: "cases" },
          { label: "실전 팁", id: "tips" },
          { label: "주의할 점", id: "gotchas" },
          { label: "Matthew님에게 추천하는 활용법", id: "forme" },
          { label: "출처 목록", id: "sources" },
        ]}
      />

      <Section heading="한눈에 요약" id="summary">
        <BulletList
          items={[
            "10월 22~27일에 큰 업데이트가 몰렸어요. Pages, 영상 생성, Vault, 1Password, 채팅에서 Auto-review 규칙 만들기, 쇼핑·구독 템플릿이 이 기간에 나왔어요(v0.75.2~v0.78.1).",
            "요금제가 바뀌었어요. The X Subscription에서는 Premium·Super·Ultra에 포함되고, Cursor·Grok과 같은 주간 사용량 풀을 써요. 예전처럼 따로 쓰는 사용량이 아니에요.",
            "공식 사례는 '봇 하나에 일 하나 + 사람 승인' 구조예요. 장애 티켓 204건을 10분 만에 일괄 처리했고, 영업 팀에는 Shared Bots를 붙였어요.",
            "1인 게임 스튜디오 사례가 있어요. 봇 14개가 '사무실'을 맡고, 코딩 에이전트가 '작업장'을 맡아요. 둘 사이는 GitHub 이슈로 넘겨요.",
            "커뮤니티 공통 팁은 '작업 → 수정 → 스킬 → 테스트 → 루틴' 순서와, 1시간마다 확인하는 대신 이벤트 트리거를 쓰는 거예요.",
            "주의할 점: 봇들이 컴퓨터 한 대를 같이 쓰고(보안 경계 아님), 테스트 실행도 실제 작업이에요. 루틴을 자주 돌리면 사용량이 빨리 닳아요.",
            "한국 사이트는 클라우드(미국) IP라서 막힐 수 있어요. Settings → Computer의 'Route traffic through this computer'로 내 PC를 거쳐 접속할 수 있어요.",
          ]}
        />
      </Section>

      <Section heading="최신 업데이트 타임라인" id="timeline" caption="최신순. @bot 게시물은 UTC 시각을 KST로 바꿨어요. 릴리스 노트는 시각 없이 날짜만 있어서 원문 날짜 그대로 적었어요(KST로는 같은 날이나 다음 날).">
        <Table
          columns={["날짜", "내용", "출처"]}
          rows={[
            ["10/27 (노트)", "v0.78.1: 상품 카드·주문 추적, Vault에 Shop Pay 추가, 구독 템플릿(무료 체험 시작 후 결제 전 해지, 안 쓰는 구독 찾기, 갱신 가격 감시), 클라우드 에이전트 커스텀 모드, 웹훅 루틴 상세", "x.ai/changelog/bot"],
            ["10/28 02:17 KST", "영업 운영팀이 만든 Shared Bots 소개(CRM 업데이트, 견적, 계약 조건 검토)", "x.com/bot/status/2115130760009273501"],
            ["10/26 (노트)", "v0.77.0: 1Password 브로커 방식(봇이 비밀번호를 못 봄), 다른 AI 비서에서 메모리 가져오기, 질문 여러 개를 한 카드에, Settings에 Permissions 섹션 추가, 승인 카드 유효 시간 10분→30분, 사설 CA를 쓰는 커스텀 MCP 지원, 한국어 앱 이름으로 플러그인 검색", "x.ai/changelog/bot"],
            ["10/24 (노트)", "v0.75.8: 채팅에서 봇이 Auto-review 규칙 추가·변경을 제안하면 카드로 확인, 작업 중 설치한 플러그인 스킬 바로 사용", "x.ai/changelog/bot"],
            ["10/24 04:43 KST", "Vault 발표(로그인·카드·연락처 저장). 같은 날 v0.75.5: 이메일 전달, 루틴 실행 한도 시간당 100→300회(루틴 하나당 200회), 직접 요청한 발송은 Auto-review 통과 후 바로 나가고 루틴 발송은 초안으로 대기", "x.com/bot/status/2113717946019397910"],
            ["10/23 07:14 KST", "폰의 캘린더·미리 알림·연락처 앱 사용(iOS·Android 순차 배포)", "x.com/bot/status/2113393684209176718"],
            ["10/23 03:13 KST", "1Password 연동 발표(순차 배포)", "x.com/bot/status/2113332983226831339"],
            ["10/22 (노트)", "v0.75.2: Pages, 영상 생성, Library 고정, GitHub 커넥터 확장(커밋 비교, PR 커밋, 브랜치·이슈 댓글), 루틴이 봇 받은편지함 읽기", "x.ai/changelog/bot"],
            ["10/21 05:42 KST", "공식 블로그: IncidentWatch·IncidentSweep 장애 대응 사례", "x.ai/news/incident-sweep"],
            ["10/20 03:40 KST", "iPhone 동작 버튼으로 음성 대화(iPhone 15 Pro 이상, 앱 1.16)", "x.com/bot/status/2112282506284445787"],
            ["10/12~10/18", "The X Subscription 출시. Grok Bot은 Premium·Super·Ultra에 포함되고 Cursor·Grok과 주간 풀 공유, 초과분은 선불 크레딧", "cursor.com/help/grok-bot/plans"],
            ["10/17 04:55 KST", "컴퓨터 작업이 평균 3배 빨라짐, 새 커넥터(Robinhood·Coinbase·Trello·PostHog 등), X Chat 읽기, X에서 @bot 태그, 이메일 +별칭", "x.com/bot/status/2111184275374813362"],
            ["10/14 (노트)", "v0.71.2: 첨부 250MB(영상 1GB), 메시지당 첨부 20개, 플러그인 스킬 24→200개, 디스크 부족 알림", "x.ai/changelog/bot"],
            ["10/11 (노트)", "v0.70.2: 봇 전용 이메일 주소, X 연결 없이 X 검색, Figma·Notion·Canva 인앱 카드", "x.ai/changelog/bot"],
            ["10/7 (노트)", "슬라이드 덱 제작(PPTX·Google Slides), 봇 컴퓨터 화면 1920×1200", "x.ai/changelog/bot"],
            ["9/26 (노트)", "Team Bots(지금의 Shared Bots) 출시, Slack 스레드 응답", "x.ai/changelog/bot"],
            ["9/11 (노트)", "봇 컴퓨터의 웹 트래픽을 내 컴퓨터로 내보내는 옵션, 저장소 접근 카드(GitHub·GitLab 등)", "x.ai/changelog/bot"],
            ["8/25 (노트)", "Cursor Pro·SuperGrok 연결 허용, 웹훅 본문 전달, PR 하나만 감시하는 GitHub 루틴", "x.ai/changelog/bot"],
            ["8/19 (노트)", "웹훅으로 시작하는 루틴, 앱 언어에 한국어 추가", "x.ai/changelog/bot"],
            ["8/11 (미국)", "Grok Bot 베타 출시", "x.ai/news/introducing-grok-bot"],
          ]}
        />
      </Section>

      <Section heading="사용 사례" id="cases" caption="본인이 직접 밝힌 사례가 대부분이고, 수치는 원문에 있는 것만 옮겼어요.">
        <Rows
          rows={[
            { lead: "1인 게임 스튜디오", title: "봇 14개가 스튜디오 사무 업무 담당 (Arda Karaduman, 10/11)", detail: "itch.io 플레이어 댓글을 문제 하나당 이슈 하나로 나눠 GitHub 이슈 8개를 만들었어요(itch-feedback 라벨). Claude Code가 코드와 대조해 측정한 뒤 수정했고, 머지까지 약 19시간 걸렸어요. 월요일 루틴은 Steam 수치를 모아 게시물 초안을 쓰고, 사이트를 갱신한 다음 Buffer에 예약해요. 게임 외형·플레이에 영향을 주는 결정은 본인이 승인해요.", meta: "blog.arda.tr/blog/2026-10-11-how-i-use-grok-bot-to-automate-my-business/" },
            { lead: "xAI 지원팀", title: "장애 감지와 티켓 일괄 응답 (공식, 10/20)", detail: "IncidentWatch가 5분마다 최근 15분 티켓에서 급증을 찾아요. IncidentSweep은 엔지니어가 배치를 승인하면 티켓 204건을 약 10분 만에 처리했어요. 승인 뒤에는 대상 티켓을 추가하지 않고, 실패하면 멈춰서 보고해요.", meta: "x.ai/news/incident-sweep" },
            { lead: "xAI 영업 운영", title: "Shared Bots로 영업 지원 (공식, 10/27)", detail: "Account Intel Bot은 통화 후 CRM을 업데이트하고, Quote Bot은 제안서를 만들고, Deal Bot은 비표준 계약 조건을 검토해 승인 요청으로 넘겨요.", meta: "x.com/bot/status/2115130760009273501" },
            { lead: "xAI 구매", title: "구매 비용 분석으로 10만 달러 이상 절감 (공식, 9/16)", detail: "벤더 지출, 계약, 사용 데이터에 접근하게 해서 직접 절감액을 찾았어요(뉴스 목록 요약 기준).", meta: "x.ai/news" },
            { lead: "Reddit 사용자", title: "일상 모니터링 묶음 (r/cursor, 8/23)", detail: "경쟁사 웹·SNS 모니터링, CVE·보안 공지 알림, 메일 속 영수증을 날짜·업체·금액 이름으로 저장, 날씨 변화 알림, 일정 요약을 돌려요. SuperGrok Heavy인데도 이걸로 사용량 절반을 쓴다고 했어요.", meta: "reddit.com/r/cursor/comments/1vvx2fg/is_grok_bot_worth_it/" },
            { lead: "크리에이터", title: "음성 클론 + 자막 영상 제작 (@Texas_Twins_Dad, 10/17)", detail: "Grok Voice로 자기 목소리를 복제하고 대본을 읽힌 뒤, 그 음성 파일을 봇에 주면 자막과 애니메이션이 들어간 영상을 만들어줘요.", meta: "x.com/Texas_Twins_Dad/status/2111274264921788427" },
            { lead: "개발자", title: "Claude Code 원격 제어와 연동 (@tejas3732, 10/22)", detail: "봇이 띄운 Claude Code 세션을 원격 제어로 Claude 앱에서도 열어서, 같은 세션을 보면서 방향을 바꿔요.", meta: "x.com/tejas3732/status/2113108960538742944" },
            { lead: "국내 리뷰", title: "게임 개발보다는 조사·문서 작업 (김경일, 10/6)", detail: "개발은 GitHub 위주로 하고 Unity는 안 돼서 2/5점을 줬어요. 반면 자료 조사, Google Drive·Notion 정리, 봇끼리 아트·기획·PM 회의는 잘 됐다고 했어요.", meta: "develog.develrocket.com/@kimkyungil" },
          ]}
        />
      </Section>

      <Section heading="실전 팁" id="tips">
        <Steps
          steps={[
            { title: "작업 → 수정 → 스킬 → 테스트 → 루틴", detail: "한 번 직접 성공시키고, 그 과정을 스킬로 저장하고, 안전한 입력으로 Test한 다음에 예약하세요. 공식 문서와 @Michael_Fenech_ 모두 이 순서를 권해요." },
            { title: "1시간마다 확인하지 말고 이벤트로 깨우기", detail: "Slack·GitHub·Linear·Sentry·이메일·웹훅 트리거를 쓰세요. 매 실행이 사용량을 써요(@XFreeze, Routines 도움말)." },
            { title: "봇 하나에 일 하나", detail: "목표, 도구, 승인 경계, 일정이 다르면 봇을 나누세요. 'General Helper' 같은 봇은 맥락이 쌓이지 않아요(공식 문서)." },
            { title: "첫 메시지에 역할·출처·승인 경계 넣기", detail: "'Never contact X without approval' 같은 오래 갈 규칙은 '기억해'라고 하고, 중요한 경계는 Auto-review 규칙으로도 막아두세요." },
            { title: "똑같은 승인이 반복되면 규칙으로", detail: "0.75.8부터 채팅에서 봇이 제안한 Auto-review 규칙을 카드로 확인할 수 있어요. 결제·발송·삭제는 Ask first로 남겨두세요." },
            { title: "소스가 없을 때 할 일을 정해두기", detail: "루틴 지시에 '소스를 못 열면 옛 데이터를 쓰지 말고 실패를 보고해'를 넣으세요(공식 예시)." },
            { title: "넘길 때는 GitHub 이슈 같은 남는 매체로", detail: "'채팅 메시지는 사라지지만, 이슈는 읽고 닫고 커밋에 링크할 수 있다'(Arda)." },
            { title: "+별칭 이메일로 루틴 나누기", detail: "name+receipts@ 처럼 태그별로 루틴을 붙이면 그 메일에만 실행돼요(v0.71.2)." },
          ]}
        />
      </Section>

      <Section heading="주의할 점" id="gotchas">
        <BulletList
          marker="con"
          items={[
            "컴퓨터 한 대를 모든 봇이 같이 써요. 파일, 브라우저 세션, CLI 자격 증명이 다 공유되니 봇을 보안 경계로 쓰면 안 돼요. 봇을 지워도 로그인과 파일은 남아요(공식 FAQ).",
            "Test는 실제 작업이에요. 파일을 바꾸고 연결된 앱을 써요. 실제 저장소 말고 테스트용 저장소에서 시험하세요.",
            "사용량: 공식 안내로도 1시간마다 도는 루틴이나 바쁜 Slack 채널 트리거는 '하루에 일주일 치'를 쓸 수 있어요. Reddit에는 '첫날에 주간 한도 42% 사용'이라는 후기가 있어요(8월 베타).",
            "루틴 한도는 전체 시간당 300회, 루틴 하나당 200회예요. 모든 사용자가 같이 쓰는 한도 때문에 'Automation run rate limit exceeded'가 나는 알려진 문제가 있고, 이때는 자동으로 다시 실행되지 않아요.",
            "사람 없이 시작된 작업(루틴, 다른 봇 메시지)의 승인은 약 30분 뒤 만료돼요. '10분'이라고 쓴 가이드는 0.77.0 이전 정보예요.",
            "모델은 직접 고를 수 없고, 어떤 모델이 썼는지도 표시되지 않아요(FAQ).",
            "클라우드 IP 차단: 8월 국내 리뷰는 네이버가 해외 IP를 막는다고 지적했어요. 9/11부터 생긴 트래픽 우회 옵션으로 줄일 수 있지만, 내 PC가 잠들면 끊겨요.",
            "봇이 자기한테 연결이 안 된 걸 '서비스 장애'라고 잘못 보고한 사례가 있어요(Arda의 Google Calendar 사례).",
            "봇이 늘면 루틴이 겹쳐요. Arda는 월요일 오전에 루틴 8개가 몰리고, 아침 브리핑이 두 군데서 오는 걸 발견했어요.",
            "Teach a task(시연으로 스킬 만들기)는 순차 배포 중이고 녹화는 최대 10분이에요. Legacy Privacy Mode는 지원하지 않아요.",
          ]}
        />
        <Callout tone="info" lead="출처 수준">
          X 트렌드 요약(Grok이 생성한 요약)에 나온 'Amazon이 에이전트 구매를 막는다' 같은 이야기는 원문을 확인하지 못해서 위 목록에서 뺐어요. 8월 Reddit 불만(크롬 프로필 매일 초기화 등)은 베타 초기 이야기예요. 이후 릴리스 노트에 로그인 유지 수정이 여러 번 있었어요.
        </Callout>
      </Section>

      <Section heading="Matthew님에게 추천하는 활용법" id="forme" caption="1인 게임 개발 + 봇 여러 개 + GitHub(weritas247) + Boot Camp PC 서버 + 가계부 앱 기준. 개발은 Codex가 하고 봇은 방향 잡기·리뷰만 하는 규칙을 전제로 했어요.">
        <Steps
          steps={[
            { title: "플레이어 피드백 → GitHub 이슈 봇", detail: "Arda처럼 itch·Steam 리뷰를 매주 '문제 하나에 이슈 하나'로 등록하게 하세요. 구현은 Boot Camp PC의 Codex가 이슈를 받아서 하고, 봇은 리뷰만 해요." },
            { title: "GitHub PR 감시 루틴", detail: "PR 하나만 감시하는 루틴은 머지되거나 닫히면 저절로 없어져요. Codex가 올린 PR을 리뷰 봇이 이벤트로 받게 하고, 1시간마다 확인하는 방식은 쓰지 마세요." },
            { title: "Boot Camp PC 연결", detail: "Settings → Computer에서 그 PC의 Execution 정책을 Ask로 두세요. 서버 상태나 배포 결과는 웹훅 루틴으로 POST하면 본문이 봇한테 전달돼요." },
            { title: "한국 사이트는 트래픽 우회", detail: "네이버 등 한국 서비스 작업이 필요할 때만 'Route traffic through this computer'를 켜세요. PC가 잠들면 끊긴다는 걸 기억하세요." },
            { title: "Chief of Staff + 봇 감사 Page", detail: "봇 전용 메일과 +별칭으로 들어오는 일을 나누고, 한 달에 한 번 '봇·루틴 지도'를 Page로 만들게 해서 겹치는 루틴과 안 쓰는 봇을 정리하세요." },
            { title: "공유 컴퓨터 보안 정리", detail: "GitHub·Cloudflare 토큰은 시크릿 카드나 Vault로 넣으세요. 가계부처럼 민감한 데이터는 꼭 필요한 봇만 다루게 하고, 지운 봇의 로그인은 따로 정리하세요." },
            { title: "사용량 관리", detail: "X Subscription에서는 Cursor·Grok과 풀을 같이 써요. Settings → Usage & Billing을 매주 확인하고, 자주 도는 루틴부터 간격을 넓히세요." },
          ]}
        />
        <Quote cite="Arda Karaduman, 1인 스튜디오 Gand">
          Grok Bot is the office. The workshop is still Claude Code, which writes the actual code, and the line between them is a GitHub issue.
        </Quote>
      </Section>

      <Section heading="출처 목록" id="sources">
        <LinkCards
          links={[
            { title: "Grok Bot Changelog", site: "x.ai", date: "2026-10-27", href: "https://x.ai/changelog/bot" },
            { title: "Introducing Grok Bot", site: "x.ai", date: "2026-08-11", href: "https://x.ai/news/introducing-grok-bot" },
            { title: "Using Grok Bot to detect and respond to incidents", site: "x.ai", date: "2026-10-20", href: "https://x.ai/news/incident-sweep" },
            { title: "SpaceXSI News", site: "x.ai", href: "https://x.ai/news" },
            { title: "Grok Bot FAQ", site: "docs.x.ai", href: "https://docs.x.ai/grok-bot/faq" },
            { title: "Work with Grok Bot", site: "cursor.com", href: "https://cursor.com/docs/grok-bot/work" },
            { title: "Routines 도움말", site: "cursor.com", href: "https://cursor.com/help/grok-bot/routines" },
            { title: "Plans and billing", site: "cursor.com", href: "https://cursor.com/help/grok-bot/plans" },
            { title: "@bot: Shared Bots for sales", site: "x.com", date: "2026-10-28 KST", href: "https://x.com/bot/status/2115130760009273501" },
            { title: "@bot: Vault", site: "x.com", date: "2026-10-24 KST", href: "https://x.com/bot/status/2113717946019397910" },
            { title: "@bot: 폰 앱 연동", site: "x.com", date: "2026-10-23 KST", href: "https://x.com/bot/status/2113393684209176718" },
            { title: "@bot: 1Password", site: "x.com", date: "2026-10-23 KST", href: "https://x.com/bot/status/2113332983226831339" },
            { title: "@bot: Pages", site: "x.com", date: "2026-10-22 KST", href: "https://x.com/bot/status/2112992872857252082" },
            { title: "@bot: Action Button", site: "x.com", date: "2026-10-20 KST", href: "https://x.com/bot/status/2112282506284445787" },
            { title: "@bot: 속도 3배 등 묶음 발표", site: "x.com", date: "2026-10-17 KST", href: "https://x.com/bot/status/2111184275374813362" },
            { title: "How I use Grok Bot to automate my business", site: "blog.arda.tr", date: "2026-10-11", href: "https://blog.arda.tr/blog/2026-10-11-how-i-use-grok-bot-to-automate-my-business/" },
            { title: "Is Grok Bot Worth it?", site: "reddit.com/r/cursor", date: "2026-08-23", href: "https://www.reddit.com/r/cursor/comments/1vvx2fg/is_grok_bot_worth_it/" },
            { title: "Grok Bot (초기 사용 후기)", site: "reddit.com/r/grok", date: "2026-08", href: "https://www.reddit.com/r/grok/comments/1vob5q2/grok_bot/" },
            { title: "Fix these mistakes holding it back", site: "x.com/XFreeze", date: "2026-10-28 KST", href: "https://x.com/XFreeze/status/2115103136125997258" },
            { title: "루틴 전 6단계 테스트", site: "x.com/Michael_Fenech_", date: "2026-10-03", href: "https://x.com/Michael_Fenech_/status/2106352565528977469" },
            { title: "Grok Voice + Grok Bot 영상", site: "x.com/Texas_Twins_Dad", date: "2026-10-17 KST", href: "https://x.com/Texas_Twins_Dad/status/2111274264921788427" },
            { title: "Claude Code + Grok Bot 연동", site: "x.com/tejas3732", date: "2026-10-22 KST", href: "https://x.com/tejas3732/status/2113108960538742944" },
            { title: "그록봇이란? 실사용 보고", site: "codeshift.kr", date: "2026-08-17", href: "https://codeshift.kr/blog/grok-bot-xai-ai-agent-review-2026" },
            { title: "Grok Bot 리뷰", site: "develog", date: "2026-10-06", href: "https://develog.develrocket.com/@kimkyungil/grok-bot-%EB%A6%AC%EB%B7%B0" },
          ]}
        />
      </Section>
    </Page>
  );
}
