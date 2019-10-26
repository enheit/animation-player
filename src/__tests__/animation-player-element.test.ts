import { AnimationPlayerElement } from '../animation-player-element';
import { ElementUnmountProps } from '../models/index.model';

describe('AnimationPlayerElement', () => {
  const elementConfig = {
    mountTime: 800,
    unmountTime: 3000,
    updateEndTime: 2000,
    updateStartTime: 1000,
  };
  let element: AnimationPlayerElement;

  beforeEach(() => {
    element = new AnimationPlayerElement(elementConfig);
  });

  it('should be created', () => {
    expect(element).toBeInstanceOf(AnimationPlayerElement);
  });

  describe('after creation', () => {
    it('should have correct timing boundaries', () => {
      expect(element.mountTime).toEqual(elementConfig.mountTime);
      expect(element.updateStartTime).toEqual(elementConfig.updateStartTime);
      expect(element.updateEndTime).toEqual(elementConfig.updateEndTime);
      expect(element.unmountTime).toEqual(elementConfig.unmountTime);
    });

    it('should have correct duration', () => {
      const expectedDuration = elementConfig.unmountTime - elementConfig.mountTime;
      expect(element.duration).toEqual(expectedDuration);
    });

    it('should have id', () => {
      expect(element.id).toBeTruthy();
    });
  });

  describe('when receive update', () => {
    it('should trigger onMount hook', () => {
      const onMountCallback = () => { };
      const onMountCallbackSpy = jest.fn(onMountCallback);
      element.onMount(onMountCallbackSpy);

      element.update(1000);

      expect(onMountCallbackSpy).toHaveBeenCalled();
    });

    it('should trigger onMount hook (only once)', () => {
      const onMountCallback = () => { };
      const onMountCallbackSpy = jest.fn(onMountCallback);
      element.onMount(onMountCallbackSpy);

      element.update(1000);
      element.update(1100);
      element.update(1200);

      expect(onMountCallbackSpy).toHaveBeenCalledTimes(1);
    });

    it('should trigger onBeforeUpdate hook', () => {
      const onBeforeUpdateCallback = () => { };
      const onBeforeUpdateCallbackSpy = jest.fn(onBeforeUpdateCallback);
      element.onBeforeUpdate(onBeforeUpdateCallbackSpy);

      element.update(850);

      expect(onBeforeUpdateCallbackSpy).toHaveBeenCalled();
    });

    it('should trigger onBeforeUpdate hook (only once)', () => {
      const onBeforeUpdateCallback = () => { };
      const onBeforeUpdateCallbackSpy = jest.fn(onBeforeUpdateCallback);
      element.onBeforeUpdate(onBeforeUpdateCallbackSpy);

      element.update(850);
      element.update(900);
      element.update(950);

      expect(onBeforeUpdateCallbackSpy).toHaveBeenCalledTimes(1);
    });

    it('should trigger onUpdate hook', () => {
      const onUpdateCallback = () => { };
      const onUpdateCallbackSpy = jest.fn(onUpdateCallback);

      element.onUpdate(onUpdateCallbackSpy);
      element.update(1000);
      expect(onUpdateCallbackSpy).toHaveBeenCalledWith(0); // 0 is expectedProgress
      element.update(1500);
      expect(onUpdateCallbackSpy).toHaveBeenCalledWith(0.5); // 0.5 is expectedProgress
      element.update(2000);
      expect(onUpdateCallbackSpy).toHaveBeenCalledWith(1); // 1 is expectedProgress
    });

    it('should trigger onUpdate hook (5 times)', () => {
      const onUpdateCallback = () => { };
      const onUpdateCallbackSpy = jest.fn(onUpdateCallback);

      element.onUpdate(onUpdateCallbackSpy);

      element.update(1000);
      element.update(1500);
      element.update(2000);

      expect(onUpdateCallbackSpy).toHaveBeenCalledTimes(5);
    });

    it('should trigger onUpdate hook (3 times)', () => {
      const onUpdateCallback = () => { };
      const onUpdateCallbackSpy = jest.fn(onUpdateCallback);

      element.onBeforeUpdate(() => { });
      element.onUpdate(onUpdateCallbackSpy);
      element.onAfterUpdate(() => { })

      element.update(1000);
      element.update(1500);
      element.update(2000);

      expect(onUpdateCallbackSpy).toHaveBeenCalledTimes(3);
    });

    it('should trigger onAfterUpdate hook', () => {
      const onAfterUpdateCallback = () => { };
      const onAfterUpdateCallbackSpy = jest.fn(onAfterUpdateCallback);
      element.onAfterUpdate(onAfterUpdateCallbackSpy);

      element.update(2000);

      expect(onAfterUpdateCallbackSpy).toHaveBeenCalled();
    });

    it('should trigger onAfterUpdate hook (only once)', () => {
      const onAfterUpdateCallback = () => { };
      const onAfterUpdateCallbackSpy = jest.fn(onAfterUpdateCallback);
      element.onAfterUpdate(onAfterUpdateCallbackSpy);

      element.update(2000);
      element.update(2100);
      element.update(2200);

      expect(onAfterUpdateCallbackSpy).toHaveBeenCalledTimes(1);
    });

    it('should not trigger onUnmount hook', () => {
      const onUnmountCallback = () => { };
      const onUnmountCallbackSpy = jest.fn(onUnmountCallback);

      // Enter mount range
      element.update(1000);

      // Jump out of mount boundaries
      element.update(3001);

      expect(onUnmountCallbackSpy).not.toHaveBeenCalled();
    });

    it('should trigger onUnmount hook', () => {
      const onUnmountCallback = () => { };
      const onUnmountCallbackSpy = jest.fn(onUnmountCallback);

      element.onUnmount(onUnmountCallbackSpy);

      // Enter mount range
      element.update(1000);

      // Jump out of mount boundaries
      element.update(3001);

      expect(onUnmountCallbackSpy).toHaveBeenCalled();
    });

    it('should trigger onUnmount hook (only once)', () => {
      const onUnmountCallback = () => { };
      const onUnmountCallbackSpy = jest.fn(onUnmountCallback);

      element.onUnmount(onUnmountCallbackSpy);

      // Enter mount range
      element.update(1000);

      // Jump out of mount boundaries
      element.update(3100);
      element.update(3200);
      element.update(3300);

      expect(onUnmountCallbackSpy).toHaveBeenCalledTimes(1);
    });

    it('should trigger onUnmount hook with unmountProps', () => {
      const onUnmountCallback = () => { };
      const onUnmountCallbackSpy = jest.fn(onUnmountCallback);

      element.onUnmount(onUnmountCallbackSpy);

      // Enter mount range
      element.update(1000);

      // Jump right out of mount boundaries
      element.update(3001);

      expect(onUnmountCallbackSpy).toHaveBeenCalledWith({ isAfterUnmount: true, isBeforeMount: false });

      // Enter mount range
      element.update(2500);

      // Jump left out of mount boundaries
      element.update(50);

      expect(onUnmountCallbackSpy).toHaveBeenCalledWith({ isAfterUnmount: false, isBeforeMount: true });
    });
  });

  it('should properly update mountTime', () => {
    element.mountTime = 0;
    expect(element.mountTime).toEqual(0);
  });

  it('should throw error if mountTime is less than 0', () => {
    try {
      element.mountTime = -1;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] mountTime cannot be less than 0');
    }
  });

  it('should throw error if mountTime is greater than updateStartTime', () => {
    try {
      element.mountTime = 1500;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] mountTime cannot be greater than updateStartTime, updateEndTime or unmountTime');
    }
  });

  it('should throw error if mountTime is greater than updateEndTime', () => {
    try {
      element.mountTime = 2500;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] mountTime cannot be greater than updateStartTime, updateEndTime or unmountTime');
    }
  });

  it('should trow error if mountTime is greater than unmountTime', () => {
    try {
      element.mountTime = 4000;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] mountTime cannot be greater than updateStartTime, updateEndTime or unmountTime');
    }
  });

  it('should properly update updateStartTime', () => {
    element.updateStartTime = 1500;
    expect(element.updateStartTime).toEqual(element.updateStartTime);
  });

  it('should throw error if updateStartTime is less than 0', () => {
    try {
      element.updateStartTime = -1;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] updateStartTime cannot be less than 0');
    }
  });

  it('should throw error if updateStartTime is less than mountTime', () => {
    try {
      element.updateStartTime = 500;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] updateStartTime cannot be less than mountTime');
    }
  })

  it('should throw error if updateStartTime is greater than updateEndTime or unmountTime', () => {
    try {
      element.updateStartTime = 2500;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] updateStartTime cannot be greater than updateEndTime or unmountTime');
    }
  });

  it('should throw error if updateStartTime is greater than updateEndTime or unmountTime', () => {
    try {
      element.updateStartTime = 3500;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] updateStartTime cannot be greater than updateEndTime or unmountTime');
    }
  });

  it('should properly update updateEndTime', () => {
    element.updateEndTime = 2500;
    expect(element.updateEndTime).toEqual(2500);
  });

  it('should throw error if updateEndTime is less than 0', () => {
    try {
      element.updateEndTime = -1;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] updateEndTime cannot be less than 0');
    }
  });

  it('should throw error if updateEndTime is less than updateStartTime or mountTime', () => {
    try {
      element.updateEndTime = 900;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] updateEndTime cannot be less than updateStartTime or mountTime');
    }
  });

  it('should throw error if updateEndTime is less than updateStartTime or mountTime', () => {
    try {
      element.updateEndTime = 500;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] updateEndTime cannot be less than updateStartTime or mountTime');
    }
  });

  it('should throw error if updateEndTime is greater than unmountTime', () => {
    try {
      element.updateEndTime = 3500;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] updateEndTime cannot be greater than unmountTime');
    }
  });

  it('should properly update unmountTime', () => {
    element.unmountTime = 3500;
    expect(element.unmountTime).toEqual(3500);
  });

  it('should throw error if unmountTime is less than 0', () => {
    try {
      element.unmountTime = -1;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] unmountTime cannot be less than 0');
    }
  });

  it('should throw error if unmountTime is less than updateStartTime, updateEndTime or mountTime', () => {
    try {
      element.unmountTime = 500;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] unmountTime cannot be less than updateStartTime, updateEndTime or mountTime');
    }
  });

  it('should throw error if unmountTime is less than updateStartTime, updateEndTime or mountTime', () => {
    try {
      element.unmountTime = 900;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] unmountTime cannot be less than updateStartTime, updateEndTime or mountTime');
    }
  });

  it('should throw error if unmountTime is less than updateStartTime, updateEndTime or mountTime', () => {
    try {
      element.unmountTime = 1500;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayerElement] unmountTime cannot be less than updateStartTime, updateEndTime or mountTime');
    }
  });
});
