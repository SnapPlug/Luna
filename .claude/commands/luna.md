# /luna - 마케팅 콘텐츠 자동 변환

스레드 원본 콘텐츠를 멀티채널(링크드인, X, 뉴스레터)로 자동 변환합니다.

## 사용법

```
/luna [스레드 원본 텍스트]
/luna --channel=linkedin [텍스트]
/luna --channel=x [텍스트]
/luna --channel=newsletter [텍스트]
/luna --channel=linkedin,x [텍스트]
```

## 실행 지침

$ARGUMENTS 값을 파싱하여 다음을 수행하세요:

### 1. 입력 검증

1. 텍스트가 없으면: "스레드 원본 텍스트를 입력해주세요." 출력 후 종료
2. 50자 미만이면: "콘텐츠가 너무 짧아요. 최소 50자 이상 필요해요." 출력 후 종료
3. `--channel` 옵션이 있으면 파싱 (linkedin, x, newsletter 중 선택)
4. 잘못된 채널명이면: "지원 채널: linkedin, x, newsletter" 출력 후 종료

### 2. 참조 파일 읽기

다음 파일들을 반드시 읽어서 참조하세요:
- `.claude/skills/brand-voice.md`
- `.claude/skills/channel-formats.md`
- `.claude/skills/hook-patterns.md`
- `.claude/skills/cta-library.md`
- `.claude/skills/output-structure.md`

### 3. 폴더 생성

1. 원본에서 핵심 키워드 추출하여 슬러그 생성 (영문, 소문자, 하이픈 구분, 30자 이내)
2. `outputs/{YYYY-MM-DD}_{slug}/` 폴더 생성
3. 원본을 `00_source.md`로 저장

### 4. 콘텐츠 분석

`.claude/agents/content-analyzer.md` 에이전트 지침을 따라:
- 핵심 메시지 추출
- 주요 포인트 3개 정리
- Pain point 식별
- 후킹 패턴 추천

결과를 `01_analysis.yaml`로 저장

### 5. 채널별 변환

선택된 채널에 대해 순차 실행:

#### 링크드인 (--channel 미지정 또는 linkedin 포함 시)
`.claude/agents/linkedin-writer.md` 지침을 따라 800~1,300자 콘텐츠 생성
→ `02_linkedin.md` 저장

#### X (--channel 미지정 또는 x 포함 시)
`.claude/agents/x-writer.md` 지침을 따라 280자 이내 콘텐츠 생성
→ `03_x.md` 저장

#### 뉴스레터 (--channel 미지정 또는 newsletter 포함 시)
`.claude/agents/newsletter-writer.md` 지침을 따라 1,500~3,000자 콘텐츠 생성
→ `04_newsletter.md` 저장

### 6. 검수

`.claude/agents/reviewer.md` 지침을 따라 생성된 콘텐츠 검수
→ `05_review.yaml` 저장

### 7. README 업데이트

폴더의 `README.md`를 실제 결과로 업데이트

### 8. 최종 출력

다음 형식으로 결과 출력:

```markdown
## 📊 콘텐츠 분석
[분석 결과 요약 - 핵심 메시지, 주요 포인트, 추천 훅 패턴]

---

## 📱 링크드인
[변환된 콘텐츠 전문]

**글자 수: 000자**

---

## 🐦 X
[변환된 콘텐츠 전문]

**글자 수: 000자**

---

## 📧 뉴스레터
[변환된 콘텐츠 전문]

**글자 수: 0000자**

---

## ✅ 검수 결과
- 전체 점수: 00/100
- 링크드인: 00점
- X: 00점
- 뉴스레터: 00점
- 권장사항: [발행 가능/수정 필요/재작성 권장]

---

📁 전체 결과: outputs/{폴더명}/
```

## 핵심 규칙 (항상 적용)

### 톤앤매너
- "요"체 사용 (링크드인은 "입니다" 혼용 가능)
- 중학생도 이해할 수 있는 쉬운 말
- 친근하고 겸손하게

### 금지 표현
절대 사용하지 마세요:
- "혁신적인", "획기적인", "놀라운"
- "게임체인저", "패러다임"
- "무한한 가능성", "새로운 지평"
- "반드시 ~해야 합니다"

### 권장 표현
- 구체적 수치: "30분 → 5분"
- 실제 경험: "저도 처음엔 헷갈렸는데요"
- 솔직한 한계: "만능은 아니에요"

### 타겟 오디언스
- 1인 창업가 (솔로프리너)
- 중소기업 및 스타트업 대표
- IT/AI에 관심 있는 사람
- 자동화, 생산성에 관심 있는 사람
