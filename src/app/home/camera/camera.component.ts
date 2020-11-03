import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit, AfterViewInit {
  @ViewChild('video') videoEl: ElementRef;

  @Input() targetPixels: number;

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    // this.setupCamera();
  }

  public async setupCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {facingMode: 'environment'}
      });
      this.videoEl.nativeElement.srcObject = stream;
      return new Promise(resolve => {
        this.videoEl.nativeElement.onloadedmetadata = () => {
          if (this.targetPixels !== undefined) {
            this.fitTargetPixels(Number(this.targetPixels))
          }
          resolve([this.videoEl.nativeElement.videoWidth,
              this.videoEl.nativeElement.videoHeight]);
        };
      });
    }
  }

  private fitTargetPixels(target: number) {
    let width = this.videoEl.nativeElement.videoWidth;
    let height = this.videoEl.nativeElement.videoHeight;
    let aspectRatio =  width / height;

    if (width >= height) {
      this.videoEl.nativeElement.height = target;
      this.videoEl.nativeElement.width = aspectRatio * target;
    } else {
      this.videoEl.nativeElement.width = target;
      this.videoEl.nativeElement.height = target / aspectRatio;
    }
  }
}
