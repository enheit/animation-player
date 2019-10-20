export interface IAnimationPlayerElement {
  readonly id: number;
  readonly duration: number;

  mountTime: number;
  unmountTime: number;
  
  // TODO: Add possibility to have updates in different moments [---]-----[-----]--[---]>
  // For now it is only possible to have single update [----------------------]>
  updateStartTime: number;
  updateEndTime: number;

  onPlay(callback: () => void): void;
  onPause(callback: () => void): void;

  onMount(callback: () => void): void;
  onBeforeUpdate(callback: () => void): void;
  onUpdate(callback: (progress: number) => void): void;
  onAfterUpdate(callback: () => void): void;
  onUnmount(callback: (elementUnmountProps: elementUnmountProps) => void): void;

  update(time: number): void;
}

export interface ElementConfig {
  mountTime: number;
  unmountTime: number;
  updateStartTime: number;
  updateEndTime: number;
}

export interface elementUnmountProps {
  isBeforeMount: boolean;
  isAfterUnmount: boolean;
}