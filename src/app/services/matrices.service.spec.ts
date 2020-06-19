import { TestBed } from '@angular/core/testing';

import { MatricesService } from './matrices.service';

describe('MatricesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatricesService = TestBed.get(MatricesService);
    expect(service).toBeTruthy();
  });
});
