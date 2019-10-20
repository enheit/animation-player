import { IAnimationPlayerTimeline } from "./models/animation-player-timeline.model";
import { SVGPlayerElement } from "./animation-player-element";
import createIdGenerator from "./utils/id-generator";
import { Timings } from "./models/index.model";

const generateId = createIdGenerator();

export class SVGPlayerTimeline implements IAnimationPlayerTimeline {
  readonly id = generateId();

  private _elements = new Map<number, SVGPlayerElement>();

  private _startTime: number = 0; // First element mount time
  private _endTime: number = 0; // Last element unmount time
  private _duration = 0;

  get startTime(): number {
    return this._startTime;
  }

  get endTime(): number {
    return this._endTime;
  }

  get duration(): number {
    return this._duration;
  }

  addElement(element: SVGPlayerElement): void {
    this._elements.set(element.id, element);

    this.updateTimings();
  }

  removeElement(id: number): boolean {
    const isRemoved = this._elements.delete(id);

    if (isRemoved) {
      this.updateTimings();
    }

    return isRemoved;
  }

  removeAllElements(): void {
    this._elements.clear();
  }

  getElement(id: number): SVGPlayerElement | undefined {
    return this._elements.get(id);
  }

  getAllElements(): SVGPlayerElement[] {
    return Array.from(this._elements.values());
  }

  update(elapsedTime: number): void {
    this._elements.forEach(element => element.update(elapsedTime));
  }

  private updateTimings(): void {
    const timings = this.getTimings();

    this._duration = timings.duration;
    this._startTime = timings.startTime;
    this._endTime = timings.endTime;
  }

  private getTimings(): Timings {
    const elements = Array.from(this._elements.values());

    if (elements.length === 0) {
      return {
        startTime: 0,
        endTime: 0,
        duration: 0,
      };
    }

    let mountTimeMin = elements[0].mountTime;
    let unmountTimeMax = elements[0].unmountTime;

    for (let i = 1; i < elements.length; i++) {
      const element = elements[i];

      if (element.mountTime < mountTimeMin) {
        mountTimeMin = element.mountTime;
      }

      if (element.unmountTime > unmountTimeMax) {
        unmountTimeMax = element.unmountTime;
      }
    }

    return {
      startTime: mountTimeMin,
      endTime: unmountTimeMax,
      duration: unmountTimeMax - mountTimeMin,
    };
  }
}
