import { AnimationPlayer } from '../animation-player';
import { AnimationPlayerElement } from '../animation-player-element';
import { ElementConfig } from '../models/index.model';

describe('AnimationPlayer', () => {
  let player: AnimationPlayer;

  beforeEach(() => {
    player = new AnimationPlayer();
  });

  it('should be created', () => {
    expect(player).toBeInstanceOf(AnimationPlayer);
  });

  describe('after creation', () => {
    it('should be initialized with default speed', () => {
      expect(player.speed).toBe(1);
    });

    it('should not autoplay', () => {
      expect(player.isPlaying).toBeFalsy();
    });

    it('should have default speed settings', () => {
      expect(player.maxSpeed).toBe(1);
      expect(player.minSpeed).toBe(0.1);
      expect(player.defaultSpeed).toBe(1);
      expect(player.speed).toBe(1);
      expect(player.speedScale).toBe(1.1);
    });

    it('should have default timings', () => {
      expect(player.startTime).toBe(0);
      expect(player.endTime).toBe(0);
      expect(player.duration).toBe(0);
    });

    it('should set progress to 0', () => {
      expect(player.progress).toBe(0);
    });

    it('should set elapsedSeconds to 0', () => {
      expect(player.elapsedSecodns).toBe(0);
    });
  });

  it('should set defaultSpeed', () => {
    const expectedDefautlSpeed = 0.5;
    player.defaultSpeed = expectedDefautlSpeed;
    expect(player.defaultSpeed).toBe(expectedDefautlSpeed);
  });

  it('should throw error if defaultSpeed is less than minSpeed', () => {
    try {
      player.defaultSpeed = -1;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] defaultSpeed cannot be less than 0');
    }
  });

  it('should throw error if defaultSpeed is less than minSpeed', () => {
    try {
      player.defaultSpeed = 0;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] defaultSpeed cannot be less than minSpeed');
    }
  });

  it('should throw error if defaultSpeed is greater than maxSpeed', () => {
    try {
      player.defaultSpeed = 1.1;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] defaultSpeed cannot be greater than maxSpeed');
    }
  });

  it('should throw error if maxSpeed is less than minSpeed', () => {
    try {
      player.maxSpeed = 0;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] maxSpeed cannot be less than minSpeed');
    }
  });

  it('should throw error if maxSpeed is less than 0', () => {
    try {
      player.maxSpeed = -1;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] maxSpeed cannot be less than 0');
    }
  });

  it('should throw error if speedScale is less than 0', () => {
    try {
      player.speedScale = -1;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] speedScale cannot be less than 0');
    }
  });

  it('should throw error if speed is less than 0', () => {
    try {
      player.speed = -1;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] speed cannot be less than 0');
    }
  });

  it('should throw error if speed is less than minSpeed', () => {
    try {
      player.speed = 0;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] speed cannot be less than minSpeed');
    }
  });

  it('should throw error if speed is greater than maxSpeed', () => {
    try {
      player.speed = 1.1;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] speed cannot be greater than maxSpeed');
    }
  });

  it('should properly set minSpeed', () => {
    const expectedMinSpeed = 0.0001;
    player.minSpeed = expectedMinSpeed;
    expect(player.minSpeed).toBe(expectedMinSpeed);
  });

  it('should throw error on negative minSpeed', () => {
    try {
      player.minSpeed = -1;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] minSpeed cannot be less than 0');
    }
  });

  it('should throw error if minSpeed is greater than maxSpeed', () => {
    try {
      player.minSpeed = 1.5;
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] maxSpeed cannot be greater than minSpeed');
    }
  });

  it('should increase speed', () => {
    const expectedSpeed = player.speed * player.speedScale;
    player.maxSpeed = 2;
    player.increaseSpeed();
    expect(player.speed).toBe(expectedSpeed);
  });

  it('shoul not increase speed to be greater than maxSpeed', () => {
    player.minSpeed = 0.6;
    player.maxSpeed = 1.5;
    player.speed = 1;
    player.speedScale = 2;

    const expectedSpeed = 1;

    player.increaseSpeed();

    expect(player.speed).toBe(expectedSpeed);
  });

  it('should decrease speed', () => {
    const expectedSpeed = player.speed / player.speedScale;
    player.decreaseSpeed();
    expect(player.speed).toBe(expectedSpeed);
  });

  it('should not decrease speed to be less than minSpeed', () => {
    player.minSpeed = 0.6;
    player.maxSpeed = 2;
    player.speed = 1;
    player.speedScale = 2;

    const expectedSpeed = 1;

    player.decreaseSpeed();

    expect(player.speed).toBe(expectedSpeed);
  });

  it('should reset speed to default', () => {
    player.maxSpeed = 5;
    player.speed = 4;
    expect(player.speed).toBe(4);
    player.resetSpeed();
    expect(player.speed).toBe(player.defaultSpeed);
  });

  it('should change speed scale', () => {
    player.speedScale = 2;
    expect(player.speedScale).toBe(2);
  });

  it('should create element', () => {
    const elementConfig: ElementConfig = {
      mountTime: 1000,
      updateStartTime: 1000,
      updateEndTime: 2000,
      unmountTime: 2000,
    };
    player.createElement(elementConfig);

    expect(player.duration).toBe(elementConfig.unmountTime);
  });

  it('should properly remove element', () => {
    const elementConfig: ElementConfig = {
      mountTime: 1000,
      updateStartTime: 1000,
      updateEndTime: 2000,
      unmountTime: 2000,
    };
    const element = player.createElement(elementConfig);

    expect(player.removeElement(element.id)).toBeTruthy();
  });

  it('should properly handle removing of unexisting element', () => {
    const unexistingElementId = -1;
    expect(player.removeElement(unexistingElementId)).toBeFalsy();
  });

  it('should properly handle element remvoing by unexisting timeline id', () => {
    const unexistingElementId = -1;
    const unexistingTimelineId = -1;
    expect(player.removeElement(unexistingElementId, unexistingTimelineId)).toBeFalsy();
  });

  it('should add element to the default timeline', () => {
    const elementConfig: ElementConfig = {
      mountTime: 1000,
      updateStartTime: 1000,
      updateEndTime: 2000,
      unmountTime: 2000,
    };
    const element = new AnimationPlayerElement(elementConfig);

    player.addElement(element);

    expect(player.duration).toBe(element.unmountTime);
  });

  it('should add element to timeline by id', () => {
    const elementConfig: ElementConfig = {
      mountTime: 1000,
      updateStartTime: 1000,
      updateEndTime: 2000,
      unmountTime: 2000,
    };
    const element = new AnimationPlayerElement(elementConfig);

    const timelineId = player.createTimeline();
    player.addElement(element, timelineId);

    expect(player.duration).toBe(element.unmountTime);
  });

  it('should throw error after adding element to not existing timeline', () => {
    const elementConfig: ElementConfig = {
      mountTime: 1000,
      updateStartTime: 1000,
      updateEndTime: 2000,
      unmountTime: 2000,
    };
    const element = new AnimationPlayerElement(elementConfig);
    const unexistingTimelineId = -1;

    try {
      player.addElement(element, unexistingTimelineId);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', `[SVGPlayer] Cannot add SVGPlayerElement to not existing timeline with id ${unexistingTimelineId}`);
    }
  });

  it('should throw error after creating element on not existing timelime', () => {
    const elementConfig: ElementConfig = {
      mountTime: 1000,
      updateStartTime: 1000,
      updateEndTime: 2000,
      unmountTime: 2000,
    };
    const unexistingTimelineId = -1;

    try {
      player.createElement(elementConfig, unexistingTimelineId);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', `[SVGPlayer] Cannot create and add SVGPlayerElement to not existing timeline with id ${unexistingTimelineId}`)
    }
  });

  it('should be paused after using from method', () => {
    const puaseSpy = spyOn(player, 'pause').and.callThrough();

    player.play();
    expect(player.isPlaying).toBeTruthy();
    player.from(0.5);
    expect(puaseSpy).toHaveBeenCalled();
    expect(player.isPlaying).toBeFalsy();
  });

  it('should properly handle rewind by using not normalized value', () => {
    const elementConfig: ElementConfig = {
      mountTime: 1000,
      updateStartTime: 1000,
      updateEndTime: 2000,
      unmountTime: 2000,
    };

    player.createElement(elementConfig);

    player.from(1000, false);
    expect(player.progress).toBe(0.5);
    expect(player.elapsedSecodns).toBe(1000);
  });

  it('should throw error on rewind positive oveflow (normalized value)', () => {
    try {
      player.from(1.1);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] The normalized progress cannot be greater than 1');
    }
  });

  it('should throw error on rewind negative oveflow (normalized value)', () => {
    try {
      player.from(-0.1);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] The normalized progress cannot be less than 0');
    }
  });

  it('should throw error on rewind positive oveflow', () => {
    const elementConfig: ElementConfig = {
      mountTime: 0,
      updateStartTime: 0,
      updateEndTime: 2000,
      unmountTime: 2000,
    };
    player.createElement(elementConfig);

    try {
      player.from(2500, false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] The progress cannot be greater than endTime');
    }
  });

  it('should throw error on rewind negative oveflow', () => {
    try {
      player.from(-100, false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', '[SVGPlayer] The progress cannot be less than startTime');
    }
  });

  it('should create timeline and return timelineId', () => {
    const timelineId = player.createTimeline();
    expect(timelineId).toBeTruthy();
  });

  it('should run', () => {
    player.play();

    expect(player.isPlaying).toBeTruthy();
  });

  it('should trigger onPlay hook', () => {
    const onPlayCallback = () => { };
    const onPlayCallbackSpy = jest.fn(onPlayCallback);

    player.onPlay(onPlayCallbackSpy);
    player.play();

    expect(onPlayCallbackSpy).toHaveBeenCalled();
  });

  it('should not trigger onPlay hook if player is played already', () => {
    const onPlayCallback = () => { };
    const onPlayCallbackSpy = jest.fn(onPlayCallback);

    player.onPlay(onPlayCallbackSpy);
    player.play();
    player.play();
    player.play();
    player.play();
    player.play();
    player.play();

    expect(onPlayCallbackSpy).toHaveBeenCalledTimes(1);
  });

  it('should pause', () => {
    player.play();
    player.pause();

    expect(player.isPlaying).toBeFalsy();
  });

  it('should trigger onPause hook', () => {
    const onPauseCallback = () => { };
    const onPauseCallbackSpy = jest.fn(onPauseCallback);

    player.onPause(onPauseCallbackSpy);
    player.play();
    player.pause();

    expect(onPauseCallbackSpy).toHaveBeenCalled();
  });

  it('should not trigger onPause hook if pause is set already', () => {
    const onPauseCallback = () => { };
    const onPauseCallbackSpy = jest.fn(onPauseCallback);

    player.onPause(onPauseCallbackSpy);
    player.play();
    player.pause();
    player.pause();
    player.pause();
    player.pause();

    expect(onPauseCallbackSpy).toHaveBeenCalledTimes(1);
  });

  it('should stop', () => {
    player.play();
    player.stop();

    expect(player.progress).toBe(0);
    expect(player.elapsedSecodns).toBe(0);
  });

  it('should stop player on pause', () => {
    player.play();
    player.pause();
    player.stop();

    expect(player.progress).toBe(0);
    expect(player.elapsedSecodns).toBe(0);
  });

  it('should trigger onStop hook', () => {
    const onStopCallback = () => { };
    const onStopCallbackSpy = jest.fn(onStopCallback);

    player.onStop(onStopCallbackSpy);

    player.play();
    player.stop();

    expect(onStopCallbackSpy).toHaveBeenCalled();
  });

  it('should remove default timeline', () => {
    const elementConfig: ElementConfig = {
      mountTime: 1000,
      updateStartTime: 1000,
      updateEndTime: 2000,
      unmountTime: 2000,
    };

    player.createElement(elementConfig);
    expect(player.duration).toBe(elementConfig.unmountTime);
    expect(player.removeTimeline()).toBeTruthy();
    expect(player.duration).toBe(0);
  });

  it('should remove timelien by id', () => {
    const elementConfig: ElementConfig = {
      mountTime: 1000,
      updateStartTime: 1000,
      updateEndTime: 2000,
      unmountTime: 2000,
    };

    const timelineId = player.createTimeline();
    player.createElement(elementConfig, timelineId);
    expect(player.duration).toBe(elementConfig.unmountTime);
    expect(player.removeTimeline(timelineId)).toBeTruthy();
    expect(player.duration).toBe(0);
  });

  it('should properly handle removing of timeline by unexisting id', () => {
    const unexistingTimelineId = -1;
    expect(player.removeTimeline(unexistingTimelineId)).toBeFalsy();
  });

  it('should remove all timelines', () => {
    const element1 = { mountTime: 0, updateStartTime: 0, updateEndTime: 1000, unmountTime: 1000 };
    const element2 = { mountTime: 2000, updateStartTime: 2000, updateEndTime: 3000, unmountTime: 3000 };
    player.createElement(element1);
    const timelineId = player.createTimeline();
    player.createElement(element2, timelineId);
    expect(player.duration).toBe(3000);
    player.removeAllTimelines();
    expect(player.duration).toBe(0);
  });

  it('should update progress/elapsedSeconds on update', () => {
    const elementConfig: ElementConfig = { mountTime: 0, updateStartTime: 0, updateEndTime: 1000, unmountTime: 1000 };
    player.createElement(elementConfig);
    player.play();
    player.update();
    expect(player.progress).not.toBe(0);
    player.update();
    expect(player.elapsedSecodns).not.toBe(0);
  });

  it('should trigger on finish hook', () => {
    const onFinishCallback = () => { };
    const onFinishCallbackSpy = jest.fn(onFinishCallback);

    player.onFinish(onFinishCallbackSpy);
    player.from(0.999);
    player.play();
    player.update();

    expect(onFinishCallbackSpy).toHaveBeenCalled();
  });

  it('should not trigger on finish hook if it was not provided', () => {
    const onFinishCallback = () => { };
    const onFinishCallbackSpy = jest.fn(onFinishCallback);

    player.from(0.999);
    player.play();
    player.update();

    expect(onFinishCallbackSpy).not.toHaveBeenCalled();
  });

  it('should properly clear timeline', () => {
    player.createElement({ mountTime: 0, updateStartTime: 1000, updateEndTime: 1000, unmountTime: 2000 });
    player.clearTimeline();

    expect(player.duration).toBe(0);
  });

  it('should not update scene if player has not been run yet', () => {
    const expectedProgress = player.progress;
    const expectedElapsedSeconds = player.elapsedSecodns;

    player.update();
    player.update();
    player.update();

    expect(player.progress).toBe(expectedProgress);
    expect(player.elapsedSecodns).toBe(expectedElapsedSeconds);
  });

  it('should properly handle clearing of unexisting timeline', () => {
    const unexistingTimelineId = -1;
    expect(player.clearTimeline(unexistingTimelineId)).toBeFalsy();
  })

  describe('should update timing', () => {

    it('on create element', () => {
      const updateTimingsSpy = spyOn(player, 'updateTimings');
      player.createElement({ mountTime: 0, updateStartTime: 0, updateEndTime: 100, unmountTime: 100 });

      expect(updateTimingsSpy).toHaveBeenCalled();
    });

    it('on create timeline', () => {
      const updateTimingsSpy = spyOn(player, 'updateTimings');
      player.createTimeline();

      expect(updateTimingsSpy).toHaveBeenCalled();
    });

    it('on remove element', () => {
      const updateTimingsSpy = spyOn(player, 'updateTimings');
      const element = player.createElement({ mountTime: 0, updateStartTime: 0, updateEndTime: 100, unmountTime: 100 });
      player.removeElement(element.id);

      expect(updateTimingsSpy).toHaveBeenCalled();
    });

    it('on remove timeline', () => {
      const updateTimingsSpy = spyOn(player, 'updateTimings');
      const element = player.createElement({ mountTime: 0, updateStartTime: 0, updateEndTime: 100, unmountTime: 100 });
      player.removeElement(element.id);

      player.removeTimeline();

      expect(updateTimingsSpy).toHaveBeenCalled();
    });

    it('on remove all timelines', () => {
      const updateTimingsSpy = spyOn(player, 'updateTimings');
      player.createElement({ mountTime: 0, updateStartTime: 0, updateEndTime: 100, unmountTime: 100 });
      player.removeTimeline();
      expect(updateTimingsSpy).toHaveBeenCalled();
    });

    it('on clear timeline', () => {
      const updateTimingsSpy = spyOn(player, 'updateTimings');
      player.createElement({ mountTime: 0, updateStartTime: 1000, updateEndTime: 1000, unmountTime: 2000 });
      expect(player.clearTimeline()).toBeTruthy();
      expect(updateTimingsSpy).toHaveBeenCalled();
    });
  });
});
