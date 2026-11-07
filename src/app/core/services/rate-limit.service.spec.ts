import { TestBed } from '@angular/core/testing';
import { RateLimitService } from './rate-limit.service';

describe('RateLimitService', () => {
  let service: RateLimitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RateLimitService]
    });
    service = TestBed.inject(RateLimitService);
  });

  it('should be created with initial null status', (done) => {
    service.status$.subscribe(status => {
      expect(status).toBeNull();
      done();
    });
  });

  it('should update rate limit status from headers', (done) => {
    const futureEpoch = Math.floor(Date.now() / 1000) + 60;
    service.updateFromHeaders('60', '10', futureEpoch.toString());

    service.status$.subscribe(status => {
      if (status) {
        expect(status.remaining).toBe(10);
        expect(status.limit).toBe(60);
        expect(status.isExceeded).toBeFalse();
        done();
      }
    });
  });

  it('should flag isExceeded when remaining is 0', (done) => {
    const futureEpoch = Math.floor(Date.now() / 1000) + 60;
    service.updateFromHeaders('60', '0', futureEpoch.toString());

    service.status$.subscribe(status => {
      if (status) {
        expect(status.remaining).toBe(0);
        expect(status.isExceeded).toBeTrue();
        done();
      }
    });
  });

  it('should set exceeded directly', (done) => {
    const resetTime = new Date(Date.now() + 30000);
    service.setExceeded(resetTime);

    service.status$.subscribe(status => {
      if (status) {
        expect(status.isExceeded).toBeTrue();
        expect(status.remaining).toBe(0);
        expect(status.resetTime).toEqual(resetTime);
        done();
      }
    });
  });

  it('should reset to null state on clear()', (done) => {
    service.setExceeded(new Date());
    service.clear();

    service.status$.subscribe(status => {
      expect(status).toBeNull();
      done();
    });
  });
});

