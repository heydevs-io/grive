import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class SimulationInput {
  @IsNumber()
  @IsPositive()
  inflationRate: number;

  @IsNumber()
  @IsPositive()
  interestRate: number;

  @IsNumber()
  @IsPositive()
  taxationRate: number;

  @IsNumber()
  @IsPositive()
  revenueGrowth: number;

  @IsNumber()
  @IsPositive()
  costGrowth: number;

  @IsNumber()
  @IsPositive()
  fixedCosts: number;

  @IsNumber()
  @IsPositive()
  variableCostPerUnit: number;

  @IsNumber()
  @IsPositive()
  unitsSold: number;

  @IsNumber()
  @IsPositive()
  pricePerUnit: number;

  @IsNumber()
  @IsPositive()
  iterations: number;
}

@Exclude()
export class SimulationResult {
  @Expose()
  projectedRevenue: number[];

  @Expose()
  projectedCost: number[];

  @Expose()
  projectedProfit: number[];

  @Expose()
  breakEvenPoint: number[];

  @Expose()
  meanProfit: number;

  @Expose()
  profit90CI: [number, number];
}
