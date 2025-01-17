export class PriceSchedule {
  id: string;
  pricebreaks: PriceBreaks[];
}
export class PriceBreaks {
  quantity?: number;
  saleprice?: number;
}
