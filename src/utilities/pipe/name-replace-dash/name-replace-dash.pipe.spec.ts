import { NameReplaceDashPipe } from './name-replace-dash.pipe';

describe('NameReplaceDashPipe', () => {
  const pipe = new NameReplaceDashPipe();
  it('should replace dashes in the name with spaces', () => {
    expect(pipe.transform({ name: 'Example-recipe-name' })).toEqual(
      'Example recipe name',
    );
  });
});
