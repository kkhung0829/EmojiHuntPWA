import {
  Component,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import * as tfc from '@tensorflow/tfjs-core';

import { CameraComponent } from './camera/camera.component';
import { MobileNetService } from './mobile-net.service';
import { EmojiItem, EMOJIS } from './emojis';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('camera') camera: CameraComponent;

  public VIDEO_PIXELS = 224;
  public predictLabel: string;
  public predictEmoji: EmojiItem;
  public predictConfidence: number;
  public predicts;

  constructor(
    private mobileNet: MobileNetService,
  ) {}

  ngAfterViewInit() {
    this.init();
  }

  private async init() {
    await this.camera.setupCamera();

    this.loopPredict();
  }

  private predict() {
      // Run the tensorflow predict logic inside a tfc.tidy call which helps
      // to clean up memory from tensorflow calls once they are done.
      const result = tfc.tidy(() => {
        // For UX reasons we spread the video element to 100% of the screen
        // but our traning data is trained against 244px images. Before we
        // send image data from the camera to the predict engine we slice a
        // 244 pixel area out of the center of the camera screen to ensure
        // better matching against our model.
        const pixels = tfc.fromPixels(this.camera.videoEl.nativeElement);
        const centerHeight = pixels.shape[0] / 2;
        const beginHeight = centerHeight - (this.VIDEO_PIXELS / 2);
        const centerWidth = pixels.shape[1] / 2;
        const beginWidth = centerWidth - (this.VIDEO_PIXELS / 2);
        const pixelsCropped =
              pixels.slice([beginHeight, beginWidth, 0],
                           [this.VIDEO_PIXELS, this.VIDEO_PIXELS, 3]);

        return this.mobileNet.predict(pixelsCropped);
    });

    // This call retrieves the topK matches from our MobileNet for the
    // provided image data.
    this.predicts = this.mobileNet.getTopKClasses(result, 10);

    // console.log(topK[0]);
    this.predictLabel = this.predicts[0].label;
    this.predictConfidence = this.predicts[0].value;
    this.predictEmoji = this.findEmoji(this.predictLabel);
  }

  private loopPredict() {
    this.predict();

    setTimeout(() => {
    // To ensure better page responsiveness we call our predict function via
    // requestAnimationFrame - see goo.gl/1d9cJa
    requestAnimationFrame(() => this.loopPredict());
    }, 1000);
  }

  public findEmoji(label: string): EmojiItem {
    let result: EmojiItem = null;

    for (let i = 0; i < EMOJIS.length; i++) {
      if (EMOJIS[i].name === label) {
        result = EMOJIS[i];
        break;
      }
    }
    return result;
  }
}
