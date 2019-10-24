import { ElementConfig, ElementUnmountProps } from './models/index.model';
import createIdGenerator from './utils/id-generator';
import { scale } from './utils/scale';

const generateId = createIdGenerator();

export class AnimationPlayerElement {
  readonly id = generateId();

  private _mountTime = 0;
  private _unmountTime = 0;
  private _updateStartTime = 0;
  private _updateEndTime = 0;

  private _onMountCallback?: () => void;
  private _onBeforeUpdateCallback?: () => void;
  private _onUpdateCallback?: (progress: number) => void;
  private _onAfterUpdateCallback?: () => void;
  private _onUnmountCallback?: (elementUnmountProps: ElementUnmountProps) => void;

  private _onPlayCallback?: () => void;
  private _onPauseCallback?: () => void;

  private _isMountFlag = false;
  private _isBeofreUpdateFlag = false;
  private _isAfterUpdateFlag = false;

  get mountTime(): number {
    return this._mountTime;
  }

  set mountTime(value: number) {
    if (value < 0) {
      throw new Error('[SVGPlayerElement] mountTime cannot be less than 0');
    }

    if (this.unmountTime && value > this.unmountTime) {
      throw new Error('[SVGPlayerElement] mountTime cannot be greater than unmountTime');
    }

    this._mountTime = value;
  }

  get unmountTime(): number {
    return this._unmountTime;
  }

  set unmountTime(value: number) {
    if (value < 0) {
      throw new Error('[SVGPlayerElement] unmountTime cannot be less than 0');
    }

    if (this.mountTime && value < this.mountTime) {
      throw new Error('[SVGPlayerElement] unmountTime cannot be less than mountTime');
    }

    this._unmountTime = value;
  }

  set updateStartTime(value: number) {
    if (value < 0) {
      throw new Error('[SVGPlayerElement] updateStartTime cannot be less than 0');
    }

    if (this.updateEndTime && value > this.updateEndTime) {
      throw new Error('[SVGPlayerElement] updateStartTime cannot be greater than updateEndTime');
    }

    if (this.mountTime && value < this.mountTime) {
      throw new Error('[SVGPlayerElement] updateStartTime cannot be less than mountTime');
    }

    if (this.unmountTime && value > this.unmountTime) {
      throw new Error('[SVGPlayerElement] updateStartTime cannot be greater than unmountTime');
    }

    this._updateStartTime = value;
  }

  get updateStartTime(): number {
    return this._updateStartTime;
  }

  set updateEndTime(value: number) {
    if (value < 0) {
      throw new Error('[SVGPlayerElement] updateStartTime cannot be less than 0');
    }

    if (this.updateStartTime && value < this.updateStartTime) {
      throw new Error('[SVGPlayerElement] updateEndTime cannot be less than updateStartTime');
    }

    if (this.mountTime && value < this.mountTime) {
      throw new Error('[SVGPlayerElement] updateEndTime cannot be less than mountTime');
    }

    if (this.unmountTime && value > this.unmountTime) {
      throw new Error('[SVGPlayerElement] updateEndTime cannot be greater than unmountTime');
    }

    this._updateEndTime = value;
  }

  get updateEndTime(): number {
    return this._updateEndTime;
  }

  get duration(): number {
    return this._unmountTime - this._mountTime;
  }

  constructor(elementConfig: ElementConfig) {
    this.mountTime = elementConfig.mountTime;
    this.unmountTime = elementConfig.unmountTime;
    this.updateStartTime = elementConfig.updateStartTime;
    this.updateEndTime = elementConfig.updateEndTime;
  }

  onMount(callback: () => void): void {
    this._onMountCallback = callback;
  }

  onBeforeUpdate(callback: () => void): void {
    this._onBeforeUpdateCallback = callback;
  }

  onUpdate(callback: (progress: number) => void): void {
    this._onUpdateCallback = callback;
  }

  onAfterUpdate(callback: () => void): void {
    this._onAfterUpdateCallback = callback;
  }

  onUnmount(callback: (elementUnmountProps: ElementUnmountProps) => void): void {
    this._onUnmountCallback = callback;
  }

  onPlay(callback: () => void): void {
    this._onPlayCallback = callback;
  }

  onPause(callback: () => void): void {
    this._onPauseCallback = callback;
  }

  update(elapsedTime: number): void {
    if (this.isInMountRange(elapsedTime)) {
      this.handleMount();

      if (this.isInBeforeUpdate(elapsedTime)) {
        this.handleBeforeUpdate();
      }

      if (this.isInUpdateRange(elapsedTime)) {
        this.handleUpdate(elapsedTime);
      }

      if (this.isInAfterUpdate(elapsedTime)) {
        this.handleAfterUpdate();
      }
    } else {
      this.handleUnmount(elapsedTime);
    }
  }

  private handleMount(): void {
    if (!this._isMountFlag) {
      this._isMountFlag = true;

      if (this._onMountCallback) {
        this._onMountCallback();
      }
    }
  }

  private handleBeforeUpdate(): void {
    if (!this._isBeofreUpdateFlag) {
      this._isBeofreUpdateFlag = true;

      if (this._onBeforeUpdateCallback) {
        this._onBeforeUpdateCallback();
      } else if (this._onUpdateCallback) {
        this._onUpdateCallback(0);
      }
    }
  }

  private handleUpdate(elapsedTime: number): void {
    if (this._onUpdateCallback) {
      const progress = scale(elapsedTime, this.updateStartTime, this.updateEndTime, 0, 1);

      this._onUpdateCallback(progress);

      this.resetUpdateFlags();
    }
  }

  private handleAfterUpdate(): void {
    if (!this._isAfterUpdateFlag) {
      this._isAfterUpdateFlag = true;

      if (this._onAfterUpdateCallback) {
        this._onAfterUpdateCallback();
      } else if (this._onUpdateCallback) {
        this._onUpdateCallback(1);
      }
    }
  }

  private handleUnmount(elapsedTime: number): void {
    if (this._isMountFlag) {
      this._isMountFlag = false;

      if (this._onUnmountCallback) {
        const elementUnmountProps: ElementUnmountProps = {
          isAfterUnmount: this.isInAfterUnmount(elapsedTime),
          isBeforeMount: this.isInBeforeMount(elapsedTime),
        };

        this._onUnmountCallback(elementUnmountProps);
      }

      this.resetUpdateFlags();
    }
  }

  private resetUpdateFlags(): void {
    if (this._isBeofreUpdateFlag) {
      this._isBeofreUpdateFlag = false;
    }

    if (this._isAfterUpdateFlag) {
      this._isAfterUpdateFlag = false;
    }
  }

  private isInMountRange(elapsedTime: number): boolean {
    return elapsedTime >= this._mountTime && elapsedTime <= this._unmountTime;
  }

  private isInUpdateRange(elapsedTime: number): boolean {
    return elapsedTime >= this._updateStartTime && elapsedTime <= this._updateEndTime;
  }

  private isInBeforeUpdate(elapsedTime: number): boolean {
    return elapsedTime >= this._mountTime && elapsedTime <= this._updateStartTime;
  }

  private isInAfterUpdate(elapsedTime: number): boolean {
    return elapsedTime <= this._unmountTime && elapsedTime >= this._updateEndTime;
  }

  private isInBeforeMount(elapsedTime: number): boolean {
    return elapsedTime < this._mountTime;
  }

  private isInAfterUnmount(elapsedTime: number): boolean {
    return elapsedTime > this._unmountTime;
  }
}
