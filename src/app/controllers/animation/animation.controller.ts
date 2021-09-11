import { Sprite } from "../../models/types/index";
import { Controller, Subscription, View } from "@app/models";
import { inject } from "app/core/inversion-of-control/inversion-of-control.engine";
import { NextFrameService } from "../../services/next-frame/next-frame.service";
import { cropImage } from "app/utils/image-cropper/image-cropper";

export type AnimationControl = {
  next: (sprite: Sprite, duration: number, invert?: boolean) => void;
};

export const animateView: Controller<AnimationControl> = (view: View) => {
  const nextFrameService = inject(NextFrameService);
  let animationControl: Subscription;
  return { next: startAnimation };

  function startAnimation(sprite: Sprite, duration: number, invert = false) {
    if (animationControl) {
      animationControl.unsubscribe();
    }

    const frequency = Math.round(sprite.frameCount / duration);
    let actualFrame = 1;

    animationControl = nextFrameService.checkFramePass(frequency).subscribe({
      next: () => {
        view.sprite = getSpriteFrame(sprite, actualFrame, invert);
        actualFrame++;
        if (actualFrame === sprite.frameCount) {
          actualFrame = 1;
        }
      },
    });
  }

  function getSpriteFrame(sprite: Sprite, frame: number, invert: boolean) {
    const { image } = sprite;
    const totalWidth = image.width;

    const unitaryWidth = totalWidth / sprite.frameCount;

    const cut = {
      x: unitaryWidth * frame,
      y: 0,
      width: unitaryWidth,
      height: image.height,
    };
    let newImage = cropImage(image, cut);
    return newImage;
  }
};
