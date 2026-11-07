import { RelativeDatePipe } from './relative-date.pipe';

describe('RelativeDatePipe', () => {
  const pipe = new RelativeDatePipe();

  it('handles empty input gracefully', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('formats recent date', () => {
    const date = new Date(Date.now() - 5000).toISOString();
    expect(pipe.transform(date)).toBe('just now');
  });

  it('formats days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(pipe.transform(twoDaysAgo)).toBe('2 days ago');
  });
});
