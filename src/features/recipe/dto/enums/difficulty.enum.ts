import { registerEnumType } from '@nestjs/graphql';

export enum Difficulty {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
}
registerEnumType(Difficulty, {
  name: 'Difficulty',
  description: 'Levels of difficulty for a recipe',
  valuesMap: {
    ONE: {
      description: 'Lowest difficulty',
    },
    TWO: {
      description: 'Second lowest difficulty',
    },
    THREE: {
      description: 'Medium difficulty',
    },
    FOUR: {
      description: 'Second highest difficulty',
    },
    FIVE: {
      description: 'Highest difficulty',
    },
  },
});
