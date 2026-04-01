1. 기술 스택 선택 이유

이번 프로젝트에서는 Node.js + Express를 사용해서 서버를 구성했다.
웹의 동작 원리를 직접 이해하는 것이 목적이었기 때문에, 복잡한 프레임워크보다는 구조가 단순한 Express를 선택했다.

Node.js: 자바스크립트로 서버까지 구현할 수 있어서 학습 효율이 높다고 판단했다.
Express: 라우팅과 서버 구성이 간단해서 웹의 기본 흐름을 이해하기에 적합했다.
HTML / CSS (정적 파일): 프론트엔드를 따로 분리하지 않고 기본 구조를 직접 구성해보기 위해 사용했다.
express-session: 로그인 상태를 유지하기 위해 세션 기반 인증을 사용했다.

데이터베이스는 이번 단계에서는 사용하지 않고, 세션에 사용자 정보를 저장하는 방식으로 간단하게 구현했다.

2. 전체 구조
# 프론트엔드
HTML 파일 (login, signup, home 등)
CSS (public 폴더에서 관리)
form을 통해 서버로 요청 전송

# 백엔드
Express 서버 (server.js / app.js)
라우팅 처리 (/login, /signup, /profile 등)
세션을 이용한 로그인 상태 관리

# 데이터 저장
DB 없이 express-session을 사용
req.session.user에 사용자 정보 저장

# 구조 흐름
사용자 → HTML form 제출 → Express 서버
→ 세션 저장 → 페이지 이동 (/profile 등)

3. 배포 과정
처음에는 로컬 환경에서 실행하는 것을 목표로 했다.

실행 방법
npm init -y
npm install express express-session body-parser
node app.js

이후 브라우저에서

http://localhost:3000

으로 접속하면 실행됨을 확인했다.

그리고, 이후 namecheap에서 도메인을 따로 구매하여 이와 연결한 후, 뒤에 포트번호를 지우기 위해 nginx를 활용했다.
또한 https연결을 위해 aws에서 인스턴스 설정을 변경하였고, certbot을 이용하여 https로 이동하도록 설계했다.

GitHub에는 코드 버전 관리를 위해 push했다.

git add .
git commit -m "프로필 UI 수정"
git push origin main

4. 구현 과정에서 막혔던 부분 & 해결
1) GitHub push 403 에러
remote: Permission denied
fatal: 403 error

토큰(PAT)을 사용해야 하는데 비번침;

Personal Access Token 생성
classic 토큰으로 다시 설정
remote URL에 토큰 포함해서 push

2) 라우트 중복 문제

LLM이 준 코드를 복붙하다보니 중복하여 라우트를 사용하게 되었다.

허나, LLM에게 물어봐서 Express는 먼저 정의된 라우트만 실행된다는 사실을 알게됐다.

3) 세션 기반 로그인 이해 부족

처음엔 헷갈렸던 부분인데, 로그인 상태가 어떻게 유지되는지 잘 몰랐다.

이해한 흐름은 다음과 같다.

로그인 → req.session.user 저장
→ 이후 요청에서도 session 유지됨
→ /profile에서 로그인 여부 확인 가능

4) nano 편집기 사용

서버 환경에서 코드 수정할 때 불편함

nano에서 복사: 마우스로 드래그
붙여넣기: 우클릭 / cmd+v
또는 로컬에서 수정 후 업로드

5. 느낀 점
일단 웹이 돌아가게 만든 후 LLM에게 질문을 하여 부족한 부분을 채워나가는 식으로 과제에 임했는데, 부분부분 얻어가는 부분이 많았다.
특히, 클라이언트 → 서버 요청 구조, 세션 기반 인증, 정적 파일 서빙 이 세 가지 개념이 실제로 어떻게 연결되는지 직접 확인할 수 있었다.

또한, 작은 실수 (CSS 링크 하나, 라우트 중복 등)로도 전체 동작이 깨질 수 있다는 점에서
구조를 깔끔하게 유지하는 것이 중요하다는 걸 느꼈다.
