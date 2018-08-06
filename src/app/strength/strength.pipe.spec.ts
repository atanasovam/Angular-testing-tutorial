import { StrengthPipe } from "./strength.pipe";

describe('StrengthPipe', () => {

  let strengthPipe: StrengthPipe;

  const scenarios: Array<ScenarioModel> = [
    {
      message: 'should display weak if value is less than 10',
      values: [-Infinity, 0, 9],
      resultMessage: 'weak',
    },
    {
      message: 'should display strong if value is greater than 10 and less than 20',
      values: [10, 13, 19],
      resultMessage: 'strong',
    },
    {
      message: 'should display strong if value is greater than 20',
      values: [20, +Infinity],
      resultMessage: 'unbelievable',
    },
  ];

  beforeEach(() => strengthPipe = new StrengthPipe());

  scenarios.forEach((scenario: ScenarioModel) => {

    scenario.values.forEach((number) => {

      it(scenario.message, () => {

        const currentActualResult: string = strengthPipe.transform(number);

        expect(currentActualResult).toContain(number + '');
        expect(currentActualResult).toContain(scenario.resultMessage);

      });

    });

  });

});

interface ScenarioModel {
  message: string;
  values: Array<number>;
  resultMessage: string;
}