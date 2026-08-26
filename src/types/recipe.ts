export type RecipeSource = "닥터라이블리" | "베르베르";

// 레시피의 재료 수량이 무엇을 기준으로 적혀있는지
// - "cup": 재료 수량 = 1잔 분량 (예: 베르베르 스무디)
// - "batch": 재료 수량 = 1회 제조 배치(보통 약 2L, 1주일분) (예: 닥터라이블리 스무디)
export type RecipeBaseUnit = "cup" | "batch";

export interface Ingredient {
  name: string;
  amount: number; // baseUnit 기준 수량
  unit: string;
  note?: string; // 손질법/비고 (예: "찌기 2분", "1/4통")
}

export interface Recipe {
  slug: string;
  name: string;
  source: RecipeSource;
  description: string;
  baseUnit: RecipeBaseUnit;
  batchVolume?: string; // baseUnit이 "batch"일 때 표기, 예: "약 2L"
  cupsPerWeek: number; // 1주일분을 몇 잔으로 볼지 (미표기 시 가정값, 기본 7)
  ingredients: Ingredient[];
  note?: string; // 레시피 전체 비고
  isPlaceholder: boolean; // true면 실제 레시피로 교체/검증 필요
}
