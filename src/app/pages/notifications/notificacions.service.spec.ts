import { TestBed } from '@angular/core/testing';

import { NotificacionsService } from './notificacions.service';

describe('NotificacionsService', () => {
  let service: NotificacionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
