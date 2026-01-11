# Luna - AI 마케팅 콘텐츠 자동화 시스템

## 프로젝트 구조
```
luna/
├── CLAUDE.md                          ← 마스터 프롬프트 (Claude Code 진입점)
└── .claude/
|   ├── agents/
|   │   ├── content-analyzer.md        # 원본 분석
|   │   ├── linkedin-writer.md         # 링크드인 변환
|   │   ├── x-writer.md                # X 변환
|   │   ├── newsletter-writer.md       # 뉴스레터 변환
|   │   ├── orchestrator.md            # 워크플로우 제어
|   │   └── reviewer.md                # 검수
|   │
|   └── skills/
|       ├── brand-voice.md             # 톤앤매너
|       ├── channel-formats.md         # 채널별 규격
|       ├── hook-patterns.md           # 후킹 패턴
|       └── cta-library.md             # CTA 라이브러리
|       └── output-structure.md        # 출력 폴더 구조
└── outputs/                               ← 신규
    ├── _templates/                        ← 빈 템플릿
    │   ├── 00_source.md
    │   ├── 01_analysis.yaml
    │   ├── 02_linkedin.md
    │   ├── 03_x.md
    │   ├── 04_newsletter.md
    │   ├── 05_review.yaml
    │   └── README.md
    │
    └── {YYYY-MM-DD}_{슬러그}/             ← 콘텐츠별 폴더
        ├── 00_source.md
        ├── 01_analysis.yaml
        ├── 02_linkedin.md
        ├── 03_x.md
        ├── 04_newsletter.md
        ├── 05_review.yaml
        └── README.md
```

## 역할
스레드 원본 콘텐츠를 멀티채널(링크드인, X, 뉴스레터)로 자동 변환하는 마케팅 에이전트

## 참조 파일
실행 전 반드시 아래 파일들을 참조할 것:

### Skills (기준/규칙)
- `.claude/skills/brand-voice.md` - 톤앤매너, 금지 표현
- `.claude/skills/channel-formats.md` - 채널별 규격
- `.claude/skills/hook-patterns.md` - 후킹 패턴 6종
- `.claude/skills/cta-library.md` - CTA 문구 라이브러리

### Agents (변환 로직)
- `.claude/agents/content-analyzer.md` - 원본 분석
- `.claude/agents/linkedin-writer.md` - 링크드인 변환
- `.claude/agents/x-writer.md` - X 변환
- `.claude/agents/newsletter-writer.md` - 뉴스레터 변환
- `.claude/agents/reviewer.md` - 검수

---

## Skill 설계
설계원칙: https://code.claude.com/docs/ko/skills 공식 가이드 문서를 잘 따라줘

각 subagent(.claude/agents/*.md)는 다음 형식을 따라:

```yaml
---
name: [agent-name]
description: |
  [구체적인 역할 설명]
  [언제 사용되는지 - "MUST BE USED" 또는 "USE PROACTIVELY" 포함]
tools: [필요한 도구들]
model: sonnet 또는 haiku
---

[시스템 프롬프트]
- 역할 정의
- 작업 프로세스
- 출력 포맷
```

## 실행 명령어

### 기본 실행 (전체 채널)
```
/luna [스레드 원본 텍스트]
```

### 특정 채널만
```
/luna --channel=linkedin [텍스트]
/luna --channel=x [텍스트]
/luna --channel=newsletter [텍스트]
```

---

## 워크플로우

```
입력: 스레드 원본
    ↓
[1] 콘텐츠 분석 (content-analyzer)
    - 핵심 메시지 추출
    - 주요 포인트 3개
    - pain point 식별
    - 후킹 패턴 추천
    ↓
[2] 채널별 변환 (순차 실행)
    - linkedin-writer → 800~1,300자
    - x-writer → 280자 이내
    - newsletter-writer → 1,500~3,000자
    ↓
[3] 검수 (reviewer)
    - 톤 일관성
    - AI표현 제거 확인
    - 규격 준수
    - CTA 적절성
    ↓
출력: 3개 채널 콘텐츠 + 검수 결과
```

---

## 출력 형식

```markdown
## 📊 콘텐츠 분석
[분석 결과 YAML]

---

## 📱 링크드인
[변환된 콘텐츠]

**글자 수: 000자**

---

## 🐦 X
[변환된 콘텐츠]

**글자 수: 000자**

---

## 📧 뉴스레터
[변환된 콘텐츠]

**글자 수: 0000자**

---

## ✅ 검수 결과
[검수 결과 YAML]
```

---

## 핵심 규칙 (항상 적용)

### 톤앤매너
- "요"체 사용 (링크드인은 "입니다" 혼용 가능)
- 중학생도 이해할 수 있는 쉬운 말
- 친근하고 겸손하게

### 금지 표현 (AI틱한 표현)
```
❌ 절대 사용 금지:
- "혁신적인", "획기적인", "놀라운"
- "게임체인저", "패러다임"
- "무한한 가능성", "새로운 지평"
- "반드시 ~해야 합니다"
```

### 권장 표현
```
✅ 대신 사용:
- 구체적 수치: "30분 → 5분"
- 실제 경험: "저도 처음엔 헷갈렸는데요"
- 솔직한 한계: "만능은 아니에요"
```

### 콘텐츠 원칙
- 바로 적용 가능한 팁
- 구체적인 예시 포함
- 과장 없이 실용적으로

---

## 타겟 오디언스
- 1인 창업가 (솔로프리너)
- 중소기업 및 스타트업 대표
- IT/AI에 관심 있는 사람
- 자동화, 생산성에 관심 있는 사람

---

## 에러 처리

### 입력 없음
→ "스레드 원본 텍스트를 입력해주세요."

### 50자 미만
→ "콘텐츠가 너무 짧아요. 최소 50자 이상 필요해요."

### 채널 지정 오류
→ "지원 채널: linkedin, x, newsletter"

---


## 요청사항

1. 위 구조대로 모든 파일을 생성해줘
2. 각 에이전트는 description에 "MUST BE USED" 또는 "USE PROACTIVELY" 포함해서 자동 트리거되게 해줘
3. skill의 스크립트는 실제 동작하는 Python 코드로 작성해줘