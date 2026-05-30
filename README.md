# Toca — TOEIC 단어장

깔끔한 흑백 디자인의 토익 단어 공부 웹앱입니다.

## 기능

- **단어장** — LC Part 1~4별 단어 관리, 품사별 필터
- **음성 재생** — 미국 / 영국 / 호주식 발음, 재생 속도 조절 (×0.5 ~ ×1.5)
- **AI 단어 추가** — 단어 목록을 붙여넣으면 Claude AI가 자동으로 뜻·품사 분석
- **퀴즈** — 발음 듣고 뜻 쓰기 / 단어 보고 뜻 쓰기
- **다크 모드** — 라이트 / 다크 토글
- **로컬 저장** — 추가한 단어는 브라우저 localStorage에 자동 저장

## 사용 방법

### 로컬에서 바로 실행
`index.html` 파일을 브라우저에서 열면 바로 작동합니다.

### GitHub Pages로 배포
1. GitHub에서 새 Repository 생성
2. `index.html` 파일 업로드
3. Repository Settings → Pages → Source: `main` branch → Save
4. `https://<유저명>.github.io/<레포명>/` 으로 접속

## 파일 구조

```
toca/
└── index.html   ← 모든 코드가 담긴 단일 파일
```

## 참고

- 음성 기능은 브라우저 Web Speech API를 사용합니다 (Chrome, Edge 권장)
- AI 단어 분석은 Anthropic Claude API를 사용합니다
- 단어 데이터는 브라우저 localStorage에 저장됩니다
# Toca
