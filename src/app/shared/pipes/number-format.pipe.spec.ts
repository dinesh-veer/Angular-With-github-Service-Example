import { NumberFormatPipe } from './number-format.pipe';

describe('NumberFormatPipe', () => {
  const pipe = new NumberFormatPipe();

  it('transforms numbers correctly', () => {
    expect(pipe.transform(0)).toBe('0');
    expect(pipe.transform(450)).toBe('450');
    expect(pipe.transform(1200)).toBe('1.2k');
    expect(pipe.transform(24500)).toBe('24.5k');
    expect(pipe.transform(1500000)).toBe('1.5M');
  });

  it('handles null, undefined and negative values', () => {
    expect(pipe.transform(null)).toBe('0');
    expect(pipe.transform(undefined)).toBe('0');
    expect(pipe.transform(-10)).toBe('-10');
  });
});

