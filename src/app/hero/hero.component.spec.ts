import { TestBed, ComponentFixture } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from "@angular/platform-browser";

import { HeroComponent } from "./hero.component";
import { EventEmitter } from "events";

describe('HeroComponent', () => {
  let fixture: ComponentFixture<HeroComponent>;
  let sut: HeroComponent;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(HeroComponent);

    sut = fixture.componentInstance;
  });

  describe('hero`s name', () => {

    it('should keep the name correctly', () => {

      sut.hero = { id: 0, name: 'hero0', strength: 8 };
      expect(sut.hero.name).toEqual('hero0');

    });

    it('should diplay the name correctly', () => {

      sut.hero = { id: 0, name: 'hero0', strength: 8 };

      fixture.detectChanges();
      const actualResult = fixture.debugElement.query(By.css('a')).nativeElement.textContent;

      expect(actualResult).toContain('hero0');

    });

    it('should keep the ID correctly', () => {

      sut.hero = { id: 0, name: 'hero0', strength: 8 };
      expect(sut.hero.id).toEqual(0);

    });

  });

  describe('hero`s id', () => {

    it('should diplay the ID correctly', () => {

      sut.hero = { id: 0, name: 'hero0', strength: 8 };

      fixture.detectChanges();
      const actualResult = fixture.debugElement.query(By.css('a')).nativeElement.textContent;

      expect(actualResult).toContain(sut.hero.id);

    });

  });

  it('when the delete button is clicked onDeleteClick should be called once', () => {

    let deleteButton: DebugElement = fixture.debugElement.query(By.css('button.delete'));

    let eventMock: MouseEvent = <MouseEvent>{
      stopPropagation: () => { },
    };

    spyOn(sut, 'onDeleteClick');

    deleteButton.triggerEventHandler('click', eventMock);
    expect(sut.onDeleteClick).toHaveBeenCalledTimes(1);

  });

  it('when the component is initialized the output property delete should be instance of EventEmitter ', () => {

    expect(sut.delete.next).toBeDefined();

  });

  describe('when onDeleteClick is called delete.next', () => {
    let eventMock: MouseEvent;

    beforeEach(() => {
      eventMock = <MouseEvent>{
        stopPropagation: () => { },
      };

      spyOn(sut.delete, 'next');

      sut.onDeleteClick(eventMock);

    });

    it('should be called once', () => {

      expect(sut.delete.next).toHaveBeenCalledTimes(1);

    });

    it('should be called with no parameters', () => {

      expect(sut.delete.next).toHaveBeenCalledWith();

    });

  });

});
