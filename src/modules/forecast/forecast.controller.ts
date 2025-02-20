import { Controller, Get, Query } from '@nestjs/common';
import { ForecastService } from './forecast.service';

@Controller('forecast')
export class ForecastController {
  constructor(private readonly forecastService: ForecastService) {}

  @Get('simulate')
  simulate(
    @Query('inflationRate') inflationRate: number,
    @Query('interestRate') interestRate: number,
    @Query('taxationRate') taxationRate: number,
    @Query('revenueGrowth') revenueGrowth: number,
    @Query('costGrowth') costGrowth: number,
    @Query('fixedCosts') fixedCosts: number,
    @Query('variableCostPerUnit') variableCostPerUnit: number,
    @Query('unitsSold') unitsSold: number,
    @Query('pricePerUnit') pricePerUnit: number,
    @Query('iterations') iterations: number,
  ) {
    const simulationInput = {
      inflationRate: Number(inflationRate),
      interestRate: Number(interestRate),
      taxationRate: Number(taxationRate),
      revenueGrowth: Number(revenueGrowth),
      costGrowth: Number(costGrowth),
      fixedCosts: Number(fixedCosts),
      variableCostPerUnit: Number(variableCostPerUnit),
      unitsSold: Number(unitsSold),
      pricePerUnit: Number(pricePerUnit),
      iterations: Number(iterations) || 10000, // Default: 10,000 runs
    };

    return this.forecastService.runSimulation(simulationInput);
  }
}
