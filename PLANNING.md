# 디톡스 스무디 웹앱 — 기획서 (v0.1 MVP)

## 1. 목적

닥터라이블리·베르베르 디톡스 스무디 레시피를 한 곳에서 확인하고, 1잔 또는
1주일분 기준으로 재료 용량을 자동 계산해주는 웹앱.

## 2. MVP 범위

- 레시피 목록 화면
- 레시피 상세 화면: 재료 + 용량 표
- 용량 계산기: "1잔" / "1주일분" 선택 시 재료 용량 자동 환산
  - 주당 잔 수를 사용자가 직접 조정 가능 (기본값 7잔 = 하루 1잔 기준)
- 반응형(모바일 우선) UI

### MVP 범위 밖 (다음 단계)

- 사용자 계정/즐겨찾기
- 장보기 리스트(재료 합산) 생성
- 레시피 검색/필터(재료, 목적별)
- 실제 레시피 원문 이미지/영양정보

## 3. 화면 구성

| 화면        | 경로              | 설명                              |
| ----------- | ----------------- | --------------------------------- |
| 레시피 목록 | `/`                | 레시피 카드 목록 (출처·검증 뱃지) |
| 레시피 상세 | `/recipes/[slug]`  | 재료 표 + 1잔/1주일분 계산기      |

## 4. 데이터 모델

두 출처의 레시피가 "기본 단위"가 서로 달라서(아래 5번 참고)
`baseUnit` 필드로 구분한다.

```ts
type RecipeBaseUnit = "cup" | "batch";

interface Ingredient {
  name: string;
  amount: number; // baseUnit 기준 수량
  unit: string; // g, ml, 개, 스푼 등
  note?: string; // 손질법/비고 (예: "찌기 2분", "1/4통")
}

interface Recipe {
  slug: string;
  name: string;
  source: "닥터라이블리" | "베르베르";
  description: string;
  baseUnit: RecipeBaseUnit;
  batchVolume?: string; // baseUnit이 "batch"일 때, 예: "약 2L"
  cupsPerWeek: number; // 1주일분을 몇 잔으로 볼지 (기본 7)
  ingredients: Ingredient[];
  note?: string;
  isPlaceholder: boolean; // 값 검증 필요 여부
}
```

`src/data/recipes.ts`에 정의.

## 5. 용량 계산 로직

레시피 카드 원본 단위가 출처별로 다르다:

- **닥터라이블리**: 재료 수량이 **1회 제조 배치**(약 2L, `baseUnit: "batch"`)
  기준. 1병을 만들어 며칠에 걸쳐 나눠 마시는 방식.
- **베르베르**: 재료 수량이 **1잔**(`baseUnit: "cup"`) 기준. 카드 자체가
  1회 분량 레시피.

계산 로직(`src/lib/scale.ts`):

- `baseUnit: "cup"` → 1잔 모드 배수 1, 1주일분 모드 배수 = `cupsPerWeek`
- `baseUnit: "batch"` → 1주일분 모드 배수 1, 1잔 모드 배수 = `1 / cupsPerWeek`
- 표시 값: `재료 수량 × 배수`, 소수점 1자리까지 반올림
- `cupsPerWeek` 기본값 7(하루 1잔 기준)은 카드에 명시된 값이 아니라 앱의
  가정값이며, 화면에서 사용자가 직접 조정 가능

## 6. 현재 데이터 상태 / TODO

- ✅ **닥터라이블리 9종**: 사용자가 제공한 레시피 카드 사진에서 재료/용량을
  그대로 옮김 (`isPlaceholder: false`).
- ⚠️ **베르베르 12종**: 사용자가 제공한 레시피 카드 사진에서 옮겼으나, 이미지
  글자가 작아 일부 수치(g/ml)는 오독 가능성이 있음 (`isPlaceholder: true`,
  화면에 "검증 필요" 뱃지 표시). 원본 카드와 대조 확인 필요.
- 레시피 콘텐츠가 저작물일 수 있으므로 상업적 배포 전 출처 표기 및 사용
  범위를 확인할 것.

## 7. 기술 스택

Next.js (App Router) + TypeScript + Tailwind CSS. 별도 백엔드/DB 없이 정적
레시피 데이터로 시작하고, 이후 즐겨찾기·검색 등이 필요해지면 DB(예:
Vercel Marketplace의 Postgres) 도입을 검토한다.

## 8. 개발 환경 참고

WSL에서 `/mnt/c` 경로(Windows 드라이브 마운트)는 파일 변경 감지(inotify)가
간헐적으로 끊길 수 있음. `next dev` 실행 중 코드 수정이 반영되지 않으면
서버를 재시작할 것.
