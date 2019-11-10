import { AnimationPlayerElement } from '../animation-player-element';
import { AnimationPlayerTimeline } from '../animation-player-timeline';
import { ElementConfig } from '../models/index.model';

describe('AnimationPlayerTimeline', () => {
  let timeline: AnimationPlayerTimeline;

  let element: AnimationPlayerElement;
  const elementConfig: ElementConfig = {
    mountTime: 5000,
    unmountTime: 10000,
    updateStartTime: 6000,
    updateEndTime: 8000,
  };

  let element2: AnimationPlayerElement;
  const element2Config: ElementConfig = {
    mountTime: 6000,
    unmountTime: 11000,
    updateStartTime: 7000,
    updateEndTime: 9000,
  };

  beforeEach(() => {
    timeline = new AnimationPlayerTimeline();
    element = new AnimationPlayerElement(elementConfig);
    element2 = new AnimationPlayerElement(element2Config);

    timeline.addElement(element);
    timeline.addElement(element2);
  });

  afterEach(() => {
    timeline.removeAllElements();
  });

  it('should properly add element', () => {
    expect(timeline.getAllElements().length).toBe(2);
  });

  it('should properly remove element', () => {
    expect(timeline.removeElement(element2.id)).toBeTruthy();
    expect(timeline.getElement(element2.id)).toEqual(undefined);
    expect(timeline.getAllElements().length).toBe(1);
  });

  it('should properly handle removoving of unexisting element', () => {
    const unexistingId = -1;
    expect(timeline.removeElement(unexistingId)).toBeFalsy();
  });

  it('should properly remove all elements', () => {
    timeline.removeAllElements();

    expect(timeline.getAllElements().length).toEqual(0);
  });

  it('should properly get element', () => {
    expect(timeline.getElement(element.id)).toEqual(element);
  });

  it('should properly get all elements', () => {
    const elements = timeline.getAllElements();
    expect(elements.length).toEqual(2);
    expect(elements[0]).toEqual(element);
    expect(elements[1]).toEqual(element2);
  });

  it('should properly calculate startTime', () => {
    expect(timeline.startTime).toBe(elementConfig.mountTime);
  });

  it('should properly calculate endTime', () => {
    expect(timeline.endTime).toBe(element2Config.unmountTime);
  });

  it('should properly calculate duration', () => {
    expect(timeline.duration).toBe(element2Config.unmountTime - elementConfig.mountTime);
  });

  it('should have id', () => {
    expect(timeline.id).toBeTruthy();
  });

  it('should update elements', () => {
    const elementUpdateSpy = spyOn(element, 'update');
    const element2UpdateSpy = spyOn(element2, 'update');

    timeline.update(3000);
    expect(elementUpdateSpy).toHaveBeenCalled();
    expect(element2UpdateSpy).toHaveBeenCalled();

    timeline.update(3500);
    expect(elementUpdateSpy).toHaveBeenCalledTimes(2);
    expect(element2UpdateSpy).toHaveBeenCalledTimes(2);
  });

  it('should properly update timings on after remove all elements', () => {
    timeline.removeAllElements();

    expect(timeline.startTime).toBe(0);
    expect(timeline.endTime).toBe(0);
    expect(timeline.duration).toBe(0);
  });

  describe('after removing elements', () => {
    it('should properly update startTime', () => {
      timeline.removeElement(element.id);

      expect(timeline.startTime).toBe(element2.mountTime);
    });

    it('should properly update endTime', () => {
      timeline.removeElement(element2.id);

      expect(timeline.endTime).toBe(element.unmountTime);
    });

    it('should properly update duration', () => {
      expect(timeline.duration).toBe(element2.unmountTime - element.mountTime);
      timeline.removeElement(element.id);
      expect(timeline.duration).toBe(element2.unmountTime - element2.mountTime);
      timeline.removeElement(element2.id);
      expect(timeline.duration).toBe(0);
    });
  });

  describe('after adding elements', () => {
    let element3: AnimationPlayerElement;
    const element3Config: ElementConfig = {
      mountTime: 1000,
      unmountTime: 4000,
      updateStartTime: 2000,
      updateEndTime: 3000,
    };

    beforeEach(() => {
      element3 = new AnimationPlayerElement(element3Config);
      timeline.removeAllElements();
    });

    it('should properly update startTime', () => {
      timeline.addElement(element);
      expect(timeline.startTime).toBe(element.mountTime);
      timeline.addElement(element2);
      expect(timeline.startTime).toBe(element.mountTime);
      timeline.addElement(element3);
      expect(timeline.startTime).toBe(element3.mountTime);
    });

    it('should properly update endTime', () => {
      timeline.addElement(element);
      expect(timeline.endTime).toBe(element.unmountTime);
      timeline.addElement(element2);
      expect(timeline.endTime).toBe(element2.unmountTime);
      timeline.addElement(element3);
      expect(timeline.endTime).toBe(element2.unmountTime);
    });

    it('should properly update duration', () => {
      timeline.addElement(element);
      expect(timeline.duration).toBe(element.unmountTime - element.mountTime);
      timeline.addElement(element2);
      expect(timeline.duration).toBe(element2.unmountTime - element.mountTime);
      timeline.addElement(element3);
      expect(timeline.duration).toBe(element2.unmountTime - element3.mountTime);
    });
  });
});
