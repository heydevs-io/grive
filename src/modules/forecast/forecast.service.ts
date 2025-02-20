import { Injectable } from '@nestjs/common';
import { create, all } from 'mathjs';
import { SimulationInput, SimulationResult } from './dto';

const math = create(all);

@Injectable()
export class ForecastService {
  randomNormal(mean = 0, stdDev = 1): number {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * stdDev;
  }
  runSimulation(input: SimulationInput): SimulationResult {
    const {
      inflationRate,
      interestRate,
      taxationRate,
      revenueGrowth,
      costGrowth,
      fixedCosts,
      variableCostPerUnit,
      unitsSold,
      pricePerUnit,
      iterations,
    } = input;

    const projectedRevenue: number[] = [];
    const projectedCost: number[] = [];
    const projectedProfit: number[] = [];
    const breakEvenPoint: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const revenueFactor = this.randomNormal(revenueGrowth / 100, 0.05);
      const costFactor = this.randomNormal(costGrowth / 100, 0.05);
      const inflationFactor = this.randomNormal(inflationRate / 100, 0.02);
      const interestFactor = this.randomNormal(interestRate / 100, 0.02);
      const taxFactor = this.randomNormal(taxationRate / 100, 0.02);

      // Adjust price per unit due to inflation
      const adjustedPricePerUnit = pricePerUnit * (1 + inflationFactor);

      // Adjust revenue
      const revenue = adjustedPricePerUnit * unitsSold * (1 + revenueFactor);
      projectedRevenue.push(revenue);

      // Adjust variable cost due to inflation
      const adjustedVariableCost = variableCostPerUnit * (1 + inflationFactor);

      // Adjust fixed costs due to interest rates
      const adjustedFixedCosts = fixedCosts * (1 + interestFactor);

      // Calculate total cost
      const variableCost = adjustedVariableCost * unitsSold * (1 + costFactor);
      const totalCost = variableCost + adjustedFixedCosts;
      projectedCost.push(totalCost);

      // Calculate profit after tax
      const profitBeforeTax = revenue - totalCost;
      const netProfit = profitBeforeTax * (1 - taxFactor);
      projectedProfit.push(netProfit);

      // Calculate break-even point (units needed to cover costs)
      const breakEven =
        adjustedFixedCosts / (adjustedPricePerUnit - adjustedVariableCost);
      breakEvenPoint.push(breakEven);
    }

    // Calculate statistics
    const meanProfit = math.mean(projectedProfit);
    const sortedProfits = projectedProfit.sort((a, b) => a - b);
    const lowerBound = sortedProfits[Math.floor(iterations * 0.05)];
    const upperBound = sortedProfits[Math.ceil(iterations * 0.95)];
    const profit90CI: [number, number] = [lowerBound, upperBound];

    return {
      projectedRevenue,
      projectedCost,
      projectedProfit,
      breakEvenPoint,
      meanProfit,
      profit90CI,
    };
  }
}
