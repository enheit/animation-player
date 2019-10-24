import { AnimationPlayerElement } from './animation-player-element';
import { AnimationPlayerTimeline } from './animation-player-timeline';
import { ElementConfig, Timings } from './models/index.model';
import { Interpolation } from './utils/interpolation';
import { scale, scaleFunc } from './utils/scale';

export class AnimationPlayer {
  private _onPlayCallback?: () => void;
  private _onPauseCallback?: () => void;
  private _onStopCallback?: () => void;
  private _onFinishCallback?: () => void;

  private _isPlaying = false;
  private _elapsedSeconds = 0;
  private _progress = 0;
  private _startTimestamp = 0;

  private _maxSpeed = 1;
  private _minSpeed = 0.1;
  private _defaultSpeed = 1;
  private _speed = 1;
  private _speedScale = 1.1;

  private _defaultTimelineId: number;
  private _timelines = new Map<number, AnimationPlayerTimeline>();
  private _startTime = 0;
  private _endTime = 0;
  private _duration = 0;

  get defaultSpeed(): number {
    return this._defaultSpeed;
  }

  set defaultSpeed(value: number) {
    if (value < 0) {
      throw new Error('[SVGPlayer] defaultSpeed cannot be less than 0');
    }

    if (value > this.maxSpeed) {
      throw new Error('[SVGPlayer] defaultSpeed cannot be greater than maxSpeed');
    }

    if (value < this.minSpeed) {
      throw new Error('[SVGPlayer] defaultSpeed cannot be less than minSpeed');
    }

    this._defaultSpeed = value;
  }

  set speed(value: number) {
    if (value < 0) {
      throw new Error('[SVGPlayer] speed cannot be less than 0');
    }

    if (value < this._minSpeed) {
      throw new Error('[SVGPlayer] speed cannot be less than minSpeed');
    }

    if (value > this._maxSpeed) {
      throw new Error('[SVGPlayer] speed cannot be greater than maxSpeed');
    }

    this._speed = value;
    this._elapsedSeconds = this.getElapsedSeconds(this._progress);
    this._startTimestamp = performance.now() - this._elapsedSeconds;
  }

  get speed(): number {
    return this._speed;
  }

  set speedScale(value: number) {
    if (value < 0) {
      throw new Error('[SVGPlayer] speedScale cannot be less than 0');
    }

    this._speedScale = value;
  }

  get speedScale(): number {
    return this._speedScale;
  }

  set maxSpeed(value: number) {
    if (value < 0) {
      throw new Error('[SVGPlayer] maxSpeed cannot be less than 0');
    }

    if (this.minSpeed && value < this.minSpeed) {
      throw new Error('[SVGPlayer] maxSpeed cannot be less than minSpeed');
    }

    this._maxSpeed = value;
  }

  get maxSpeed(): number {
    return this._maxSpeed;
  }

  set minSpeed(value: number) {
    if (value < 0) {
      throw new Error('[SVGPlayer] minSpeed cannot be less than 0');
    }

    if (this.maxSpeed && value > this.maxSpeed) {
      throw new Error('[SVGPlayer] maxSpeed cannot be greater than minSpeed');
    }

    this._minSpeed = value;
  }

  get minSpeed(): number {
    return this._minSpeed;
  }

  get startTime(): number {
    return this._startTime;
  }

  get endTime(): number {
    return this._endTime;
  }

  get duration(): number {
    return this._duration;
  }

  constructor() {
    this._defaultTimelineId = this.createTimeline();
  }

  play(): void {
    if (!this._isPlaying) {
      this._isPlaying = true;
      this._elapsedSeconds = this.getElapsedSeconds(this._progress);
      this._startTimestamp = performance.now() - this._elapsedSeconds;

      if (this._onPlayCallback) {
        this._onPlayCallback();
      }
    }
  }

  pause(): void {
    if (this._isPlaying) {
      this._isPlaying = false;

      if (this._onPauseCallback) {
        this._onPauseCallback();
      }
    }
  }

  stop(): void {
    if (this._isPlaying) {
      this._isPlaying = false;
    }

    this._progress = 0;
    this._elapsedSeconds = this.getElapsedSeconds(this._progress);

    this.from(this._progress);

    if (this._onStopCallback) {
      this._onStopCallback();
    }
  }

  increaseSpeed(): void {
    if (this.speed * this.speedScale < this.maxSpeed) {
      this.speed *= this.speedScale;

      this._elapsedSeconds = this.getElapsedSeconds(this._progress);
      this._startTimestamp = performance.now() - this._elapsedSeconds;
    }
  }

  decreaseSpeed(): void {
    if (this.speed / this.speedScale > this.minSpeed) {
      this.speed /= this.speedScale;

      this._elapsedSeconds = this.getElapsedSeconds(this._progress);
      this._startTimestamp = performance.now() - this._elapsedSeconds;
    }
  }

  resetSpeed(): void {
    this.speed = this._defaultSpeed;
  }

  from(progress: number, isNormalized: boolean = true): void {
    if (isNormalized) {
      if (progress > 1) {
        throw new Error('[SVGPlayer] The normalized progress cannot be greater than 1');
      } else if (progress < 0) {
        throw new Error('[SVGPlayer] The normalized progress cannot be less than 0');
      }
    } else {
      if (progress > this._endTime) {
        throw new Error('[SVGPlayer] The progress cannot be greater than endTime');
      } else if (progress < this._startTime) {
        throw new Error('[SVGPlayer] The progress cannot be less than startTime');
      }
    }

    if (this._isPlaying) {
      this.pause();
    }

    if (!isNormalized) {
      const scaler = scaleFunc(0, this.endTime, 0, 1);
      progress = scaler(progress);
    }

    if (this._isPlaying) {
      this.pause();
    }

    this._progress = progress;
    this._elapsedSeconds = scale(this._progress, 0, 1, 0, this._duration);
    this.updateTimelines(this._elapsedSeconds);
  }

  createTimeline(): number {
    const timeline = new AnimationPlayerTimeline();
    this._timelines.set(timeline.id, timeline);

    this.updateTimings();

    return timeline.id;
  }

  removeTimeline(id: number = this._defaultTimelineId): boolean {
    const isRemoved = this._timelines.delete(id);

    if (isRemoved) {
      this.updateTimings();
    }

    return isRemoved;
  }

  removeAllTimelines(): void {
    this._timelines.clear();
  }

  clearTimeline(id: number = this._defaultTimelineId): void {
    if (!this._timelines.has(id)) {
      throw new Error(`[SVGPlayer] Cannot clear unexisting timeline with id ${id}`);
    }

    (this._timelines.get(id) as AnimationPlayerTimeline).removeAllElements();
  }

  createElement(elementConfig: ElementConfig, timelineId: number = this._defaultTimelineId): AnimationPlayerElement {
    if (!this._timelines.has(timelineId)) {
      throw new Error(`[SVGPlayer] Cannot create and add SVGPlayerElement to not existing timeline with id ${timelineId}`);
    }

    const element = new AnimationPlayerElement(elementConfig);
    (this._timelines.get(timelineId) as AnimationPlayerTimeline).addElement(element);

    this.updateTimings();

    return element;
  }

  addElement(element: AnimationPlayerElement, timelineId: number = this._defaultTimelineId): void {
    if (!this._timelines.has(timelineId)) {
      throw new Error(`[SVGPlayer] Cannot add SVGPlayerElement to not existing timeline with id ${timelineId}`);
    }

    (this._timelines.get(timelineId) as AnimationPlayerTimeline).addElement(element);

    this.updateTimings();
  }

  removeElement(id: number, timelineId: number = this._defaultTimelineId): boolean {
    if (!this._timelines.has(timelineId)) {
      throw new Error(`[SVGPlayer] Cannot remove SVGPlayerElement from not existing timeline with id ${timelineId}`);
    }

    const timeline = (this._timelines.get(timelineId) as AnimationPlayerTimeline);
    const isRemoved = timeline.removeElement(id);

    if (isRemoved) {
      this.updateTimings();
    }

    return isRemoved;
  }

  onPlay(callback: () => void): void {
    this._onPlayCallback = callback;
  }

  onPause(callback: () => void): void {
    this._onPauseCallback = callback;
  }

  onStop(callback: () => void): void {
    this._onStopCallback = callback;
  }

  onFinish(callback: () => void): void {
    this._onFinishCallback = callback;
  }

  updateTimings(): void {
    const timings = this.getTimings();

    this._startTime = timings.startTime;
    this._endTime = timings.endTime;
    this._duration = timings.duration;
  }

  update(): void {
    if (this._isPlaying) {
      this._progress = this.getProgress();
      this._elapsedSeconds = scale(this._progress, 0, 1, 0, this._duration);
      this.updateTimelines(this._elapsedSeconds);

      if (this._progress === 1) {
        if (this._onFinishCallback) {
          this._onFinishCallback();
        }

        this.pause();
      }
    }
  }

  private getElapsedSeconds(progress: number): number {
    return Interpolation.Linear(0, this._duration / this._speed, progress);
  }

  private getProgress(): number {
    const currentTime = performance.now();
    const delta = currentTime - this._startTimestamp;
    let progress = delta / (this._duration / this._speed);

    // Fix overflow
    progress = progress > 1 ? 1 : progress;

    return progress;
  }

  private updateTimelines(elapsedSeconds: number): void {
    this._timelines.forEach(timeline => timeline.update(elapsedSeconds));
  }

  private getTimings(): Timings {
    const timelines = Array.from(this._timelines.values());

    if (timelines.length === 0) {
      return {
        duration: 0,
        endTime: 0,
        startTime: 0,
      };
    }

    const startTimeMin = 0;
    let endTimeMax = timelines[0].endTime;

    for (let i = 1; i < timelines.length; i++) {
      const timeline = timelines[i];

      if (timeline.endTime > endTimeMax) {
        endTimeMax = timeline.endTime;
      }
    }

    return {
      duration: endTimeMax - startTimeMin,
      endTime: endTimeMax,
      startTime: startTimeMin,
    };
  }
}
