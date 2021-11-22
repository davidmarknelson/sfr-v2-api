import { registerEnumType } from '@nestjs/graphql';

export enum Difficulty {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
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
