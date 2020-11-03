import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CameraComponent } from './camera.component';

describe('CameraComponent', () => {
  let component: CameraComponent;
  let fixture: ComponentFixture<CameraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
