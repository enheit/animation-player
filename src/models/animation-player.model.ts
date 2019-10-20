import { SVGPlayerElement } from "../animation-player-element";
import { ElementConfig } from "./animation-player-element.model";

export interface IAnimationPlayer {
  speed: number;
  speedScale: number;
  maxSpeed: number;
  minSpeed: number;
  defaultSpeed: number;

  play(): void;
  pause(): void;
  stop(): void;

  increaseSpeed(): void;
  decreaseSpeed(): void;
  resetSpeed(): void;

  from(progress: number, isNormalized?: boolean): void;

  createTimeline(): number;
  removeTimeline(id?: number): boolean;
  clearTimeline(id?: number): void;
  removeAllTimelines(): void;

  createElement(elementConfig: ElementConfig): SVGPlayerElement;
  addElement(element: SVGPlayerElement, timelineId?: number): void;
  removeElement(id: number, timelineId?: number): boolean;

  onPlay(callback: () => void): void;
  onPause(callback: () => void): void;
  onStop(callback: () => void): void;
  onFinish(callback: () => void): void;

  update(): void;

  // Warning! Use this function carefuly!
  // This function can be used if you changed time boundaries of elements during playing animation
  updateTimings(): void;
}
