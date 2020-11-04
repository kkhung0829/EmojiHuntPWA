import { Injectable, Inject } from '@angular/core';

import * as tfc from '@tensorflow/tfjs-core';
import {loadFrozenModel, FrozenModel} from '@tensorflow/tfjs-converter';
import {SCAVENGER_CLASSES} from './scavenger_classes';

const MODEL_FILE_URL = '/EmojiHuntPWA/assets/model/tensorflowjs_model.pb';
const WEIGHT_MANIFEST_FILE_URL = '/EmojiHuntPWA/assets/model/weights_manifest.json';
const INPUT_NODE_NAME = 'input';
const OUTPUT_NODE_NAME = 'final_result';
const PREPROCESS_DIVISOR = tfc.scalar(255 / 2);

type TensorMap = {[name: string]: tfc.Tensor};

@Injectable({
  providedIn: 'root'
})
export class MobileNetService {

  model: FrozenModel;

  constructor() {}

  async load() {
// console.log('MobileNetService call loadFrozenModel()...');
    this.model = await loadFrozenModel(
      MODEL_FILE_URL,
      WEIGHT_MANIFEST_FILE_URL);
// console.log('MobileNetService call loadFrozenModel()... finished');
  }

/**
   * Infer through MobileNet, assumes variables have been loaded. This does
   * standard ImageNet pre-processing before inferring through the model. This
   * method returns named activations as well as softmax logits.
   *
   * @param input un-preprocessed input Array.
   * @return The softmax logits.
   */
  predict(input: tfc.Tensor): tfc.Tensor1D {
    const preprocessedInput = tfc.div(
        tfc.sub(input.asType('float32'), PREPROCESS_DIVISOR),
        PREPROCESS_DIVISOR);
    const reshapedInput =
        preprocessedInput.reshape([1, ...preprocessedInput.shape]);
    const dict: TensorMap = {};
    dict[INPUT_NODE_NAME] = reshapedInput;
    return this.model.execute(dict, OUTPUT_NODE_NAME) as tfc.Tensor1D;
  }

  getTopKClasses(predictions: tfc.Tensor1D, topK?: number) {
    const values = predictions.dataSync();
    predictions.dispose();

    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({value: values[i], index: i});
    }
    predictionList = predictionList.sort((a, b) => {
      return b.value - a.value;
    });
    if (topK !== undefined) {
      predictionList = predictionList.slice(0, topK);
    }

    return predictionList.map(x => {
      return {label: SCAVENGER_CLASSES[x.index], value: x.value};
    });
  }
}
