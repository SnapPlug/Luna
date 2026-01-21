# Output Structure - 출력 폴더 구조

## 개요
Luna가 생성하는 콘텐츠의 폴더 구조와 파일 형식을 정의합니다.

---

## 디렉토리 구조

```
outputs/
├── _templates/                    ← 빈 템플릿 (참조용)
│   ├── 00_source.md
│   ├── 00_source_improved.md
│   ├── 01_analysis.yaml
│   ├── 02_linkedin.md
│   ├── 03_x.md
│   ├── 04_newsletter.md
│   ├── 05_review.yaml
│   └── README.md
│
└── {YYYY-MM-DD}_{slug}/          ← 콘텐츠별 폴더
    ├── 00_source.md              ← 원본 저장
    ├── 00_source_improved.md     ← 개선된 원본 (NEW)
    ├── 01_analysis.yaml          ← 분석 결과
    ├── 02_linkedin.md            ← 링크드인 콘텐츠
    ├── 03_x.md                   ← X 콘텐츠
    ├── 04_newsletter.md          ← 뉴스레터 콘텐츠
    ├── 05_review.yaml            ← 검수 결과
    └── README.md                 ← 요약 및 메타정보
```

---

## 폴더 네이밍 규칙

### 형식
```
{YYYY-MM-DD}_{slug}
```

### 슬러그 생성 규칙
1. 원본 콘텐츠의 핵심 키워드 추출 (영문)
2. 소문자, 하이픈 구분
3. 최대 30자
4. 특수문자 제거

### 예시
```
2024-01-15_chatgpt-prompt-tips
2024-01-16_productivity-automation
2024-01-17_ai-tools-comparison
```

---

## 파일별 형식

### 00_source.md
원본 콘텐츠 저장

```markdown
# 원본 콘텐츠

## 메타 정보
- 입력 일시: {timestamp}
- 원본 길이: {char_count}자
- 소스 타입: thread / article / note

---

## 원문

{original_content}
```

---

### 00_source_improved.md
개선된 원본 콘텐츠

```markdown
# 원본 개선 결과

## 메타 정보
- 개선 일시: {timestamp}
- 원본 길이: {original_char_count}자
- 개선 후 길이: {improved_char_count}자

---

## 진단 결과

### 문장 구조
- 점수: {score}/10
- 주요 이슈: {issues}

### 문단 구조
- 점수: {score}/10
- 주요 이슈: {issues}

### 후킹 멘트
- 현재 타입: {current_hook_type}
- 임팩트 점수: {score}/10
- 권장 타입: {recommended_hook_type}

### 가독성
- 점수: {score}/10
- 주요 이슈: {issues}

---

## 개선된 원본

{improved_content}

---

## 변경 사항 요약

### 후킹 멘트 개선
- Before: {original_hook}
- After: {improved_hook}
- 이유: {reason}

### 주요 변경
| 구분 | Before | After |
|------|--------|-------|
| {area} | {before} | {after} |

---

## 대안 훅 옵션

### 옵션 A (질문형)
{question_hook}

### 옵션 B (숫자형)
{number_hook}

### 옵션 C (충격형)
{shock_hook}
```

---

### 01_analysis.yaml
콘텐츠 분석 결과

```yaml
analysis:
  created_at: "2024-01-15T10:30:00+09:00"

  core_message: |
    핵심 메시지 한 줄 요약

  key_points:
    - point: "첫 번째 포인트"
      detail: "상세 설명"
    - point: "두 번째 포인트"
      detail: "상세 설명"
    - point: "세 번째 포인트"
      detail: "상세 설명"

  pain_points:
    - "독자가 겪는 문제 1"
    - "독자가 겪는 문제 2"

  target_audience:
    primary: "주요 타겟"
    secondary: "부가 타겟"

  hook_recommendation:
    pattern: "question | shock | number | story | secret | contrast"
    reason: "추천 이유"
    example: "예시 훅 문장"

  tone_keywords:
    - "친근한"
    - "실용적인"
    - "구체적인"

  content_type: "tip | insight | story | tutorial | comparison"
```

---

### 02_linkedin.md
링크드인 콘텐츠

```markdown
# 링크드인 콘텐츠

## 메타 정보
- 생성 일시: {timestamp}
- 글자 수: {char_count}자
- 사용된 훅 패턴: {hook_pattern}

---

## 본문

{linkedin_content}

---

## 해시태그
#태그1 #태그2 #태그3

---

## 작성 노트
- 강조 포인트: {emphasis}
- 권장 게시 시간: {recommended_time}
```

---

### 03_x.md
X(트위터) 콘텐츠

```markdown
# X 콘텐츠

## 메타 정보
- 생성 일시: {timestamp}
- 글자 수: {char_count}자
- 형식: single | thread

---

## 본문

{x_content}

---

## 스레드 (해당 시)

### 1/
{thread_1}

### 2/
{thread_2}

...

---

## 작성 노트
- 강조 포인트: {emphasis}
- 권장 게시 시간: {recommended_time}
```

---

### 04_newsletter.md
뉴스레터 콘텐츠

```markdown
# 뉴스레터 콘텐츠

## 메타 정보
- 생성 일시: {timestamp}
- 글자 수: {char_count}자
- 예상 읽기 시간: {reading_time}분

---

## 제목 옵션
1. {title_option_1}
2. {title_option_2}
3. {title_option_3}

---

## 본문

{newsletter_content}

---

## 작성 노트
- 강조 포인트: {emphasis}
- 권장 발송 시간: {recommended_time}
```

---

### 05_review.yaml
검수 결과

```yaml
review:
  created_at: "2024-01-15T11:00:00+09:00"

  overall_score: 85  # 100점 만점

  channels:
    linkedin:
      score: 88
      char_count: 1050
      checks:
        tone_consistency: true
        ai_expression_free: true
        format_compliance: true
        cta_appropriate: true
      issues: []
      suggestions:
        - "두 번째 문단 줄바꿈 추가 권장"

    x:
      score: 82
      char_count: 245
      checks:
        tone_consistency: true
        ai_expression_free: true
        format_compliance: true
        cta_appropriate: true
      issues:
        - type: "length"
          detail: "280자에 근접, 여유 확보 권장"
      suggestions: []

    newsletter:
      score: 85
      char_count: 2100
      checks:
        tone_consistency: true
        ai_expression_free: true
        format_compliance: true
        cta_appropriate: true
      issues: []
      suggestions:
        - "CTA 부분 더 구체적으로"

  ai_expressions_found: []  # 발견된 AI 표현 리스트

  final_recommendation: "발행 가능" # 발행 가능 | 수정 필요 | 재작성 권장
```

---

### README.md
폴더 요약

```markdown
# {콘텐츠 제목}

> {한 줄 요약}

## 생성 정보
- 생성일: {date}
- 원본 길이: {source_char_count}자

## 채널별 현황

| 채널 | 상태 | 글자 수 | 검수 점수 |
|------|------|---------|----------|
| 링크드인 | ✅ 완료 | 1,050자 | 88점 |
| X | ✅ 완료 | 245자 | 82점 |
| 뉴스레터 | ✅ 완료 | 2,100자 | 85점 |

## 핵심 메시지
{core_message}

## 사용된 훅 패턴
{hook_pattern}

## 파일 목록
- `00_source.md` - 원본
- `01_analysis.yaml` - 분석
- `02_linkedin.md` - 링크드인
- `03_x.md` - X
- `04_newsletter.md` - 뉴스레터
- `05_review.yaml` - 검수
```

---

## 출력 옵션

### 전체 채널 (기본)
모든 파일 생성

### 특정 채널만
```
--channel=linkedin  → 02_linkedin.md만 생성
--channel=x         → 03_x.md만 생성
--channel=newsletter → 04_newsletter.md만 생성
```

특정 채널 선택 시에도 00_source.md, 01_analysis.yaml, README.md는 항상 생성
