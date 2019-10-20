import { SVGPlayerElement } from "../animation-player-element";

export interface IAnimationPlayerTimeline {
  readonly id: number | any;
  readonly startTime: number;
  readonly endTime: number;
  readonly duration: number;

  addElement(element: SVGPlayerElement): void;

  removeElement(id: number): boolean;
  removeAllElements(): void;

  getElement(id: number): SVGPlayerElement | undefined;
  getAllElements(): SVGPlayerElement[];

  update(time: number): void;
}