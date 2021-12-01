import { registerEnumType } from '@nestjs/graphql';

export enum Difficulty {
  One = 'One',
  Two = 'Two',
  Three = 'Three',
  Four = 'Four',
  Five = 'Five',
}
registerEnumType(Difficulty, {
  name: 'Difficulty',
  description: 'Levels of difficulty for a recipe',
  valuesMap: {
    One: {
      description: 'Lowest difficulty',
    },
    Two: {
      description: 'Second lowest difficulty',
    },
    Three: {
      description: 'Medium difficulty',
    },
    Four: {
      description: 'Second highest difficulty',
    },
    Five: {
      description: 'Highest difficulty',
    },
  },
});
