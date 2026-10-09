import { TestBed } from '@angular/core/testing';
import { College360 } from './college360';

describe('College360', () => {
  let service: College360;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(College360);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
