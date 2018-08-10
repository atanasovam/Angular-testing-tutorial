import {
  TestBed,
  fakeAsync,
  tick,
  ComponentFixture,
} from "@angular/core/testing";
import { of } from "rxjs/observable/of";
import { Location } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { HeroDetailComponent } from "./hero-detail.component";
import { HeroService } from "../hero.service";
import { Hero } from "../hero";

describe('HeroDetailComponent', () => {

  let sut: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;

  let activatedRouteMock;
  let heroServiceMock;
  let locationMock;

  let hero;

  beforeEach(() => {

    hero = { id: 3, name: 'hero6', strength: 18 };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => hero.id,
        },
      },
    };

    heroServiceMock = jasmine.createSpyObj(['getHero', 'updateHero']);
    locationMock = jasmine.createSpyObj(['back']);

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      declarations: [
        HeroDetailComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: HeroService, useValue: heroServiceMock },
        { provide: Location, useValue: locationMock },
      ],
    });

    heroServiceMock.getHero.and.returnValue(of(hero));

    fixture = TestBed.createComponent(HeroDetailComponent);
    sut = fixture.componentInstance;

  });

  it('component`s template h2 tag should contains the hero`s uppercase name', () => {
    fixture.detectChanges();

    const h2TextContent: string = fixture.nativeElement.querySelector('h2').textContent;

    expect(h2TextContent).toContain(hero.name.toUpperCase());
  });

  it('should call updateHero when save is called', () => {
    fixture.detectChanges();

    heroServiceMock.updateHero.and.returnValue(of({}));

    sut.save();

    expect(heroServiceMock.updateHero).toHaveBeenCalledTimes(1);
  });

  describe('ngOnInit', () => {

    it('after ngOnInit is have been called getHero should be called once', () => {

      spyOn(sut, 'getHero');

      fixture.detectChanges();

      expect(sut.getHero).toHaveBeenCalledTimes(1);
    });

    it('after ngOnInit is have been called heroService.getHero should be called once', () => {
      fixture.detectChanges();

      const heroServiceSpy = (sut as any).heroService;

      expect(heroServiceSpy.getHero).toHaveBeenCalledTimes(1);
    });

    it('after ngOnInit is have been called getHero should be called with ', () => {
      fixture.detectChanges();

      const heroServiceSpy = (sut as any).heroService;

      expect(heroServiceSpy.getHero).toHaveBeenCalledWith(hero.id);
    });

    it('after ngOnInit is have been called the hero property should be defined after heroService.getHero have been called', () => {
      fixture.detectChanges();

      expect(sut.hero).toBeDefined();

    });

    it('after ngOnInit is have been called getHero should be of type void', () => {
      const getHeroResult = sut.getHero();

      expect(getHeroResult).toBeUndefined();
    });

    it('after ngOnInit have been called, component`s template should contains the hero`s id ', () => {
      fixture.detectChanges();

      const divTextContent: string = fixture.nativeElement.querySelector('div').textContent;

      expect(divTextContent).toContain(hero.id);
    });

    it('after ngOnInit have been called, component`s template input element should contains the hero`s name ', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const divTextContent: string = fixture.nativeElement.querySelector('input').value;

      expect(divTextContent).toContain(hero.name);
    }));

    it('after ngOnInit have been called, the hero property shouldn`t be undefined', () => {
      fixture.detectChanges();

      expect(sut.hero).not.toBeUndefined;
    });

  });

  describe('goBack', () => {

    it('on `go back` button click, goBack should be called once', () => {
      fixture.detectChanges();

      spyOn(sut, 'goBack');
      const backButton = fixture.nativeElement.querySelector('button');

      backButton.click();

      expect(sut.goBack).toHaveBeenCalledTimes(1);
    });

    it('on `go back` button click, goBack should be called without parameters', () => {
      fixture.detectChanges();

      spyOn(sut, 'goBack');
      const backButton = fixture.nativeElement.querySelector('button');

      backButton.click();

      expect(sut.goBack).toHaveBeenCalledWith();
    });

    it('on `go back` button click, goBack should be of type void', () => {
      const goBackResult = sut.goBack();

      expect(goBackResult).toBeUndefined();
    });

    it('when goBack is called location.back should be called', () => {
      fixture.detectChanges();

      const locationSpy = (sut as any).location;

      sut.goBack();

      expect(locationSpy.back).toHaveBeenCalledTimes(1);
    });

    it('when goBack is called location.back should be called with no parameters', () => {
      fixture.detectChanges();

      const locationSpy = (sut as any).location;

      sut.goBack();

      expect(locationSpy.back).toHaveBeenCalledWith();
    });

  });

  describe('save', () => {

    it('on `save` button click, save should be called once', () => {
      fixture.detectChanges();

      spyOn(sut, 'save');
      const saveButton = fixture.nativeElement.querySelectorAll('button')[1];

      saveButton.click();

      expect(sut.save).toHaveBeenCalledTimes(1);
    });

    it('on `save` button click, save should be called without parameters', () => {
      fixture.detectChanges();

      spyOn(sut, 'save');
      const saveButton = fixture.nativeElement.querySelectorAll('button')[1];

      saveButton.click();

      expect(sut.save).toHaveBeenCalledWith();
    });

    it('save should be of type void', () => {
      heroServiceMock.updateHero.and.returnValue(of({}));

      const saveResult = sut.save();

      expect(saveResult).toBeUndefined();
    });

    it('heroService.updateHero should be called once after save have been called', () => {
      heroServiceMock.updateHero.and.returnValue(of({}));

      sut.save();

      expect(heroServiceMock.updateHero).toHaveBeenCalledTimes(1);
    });

    it('heroService.updateHero should be called once after save have been called', () => {
      const expectedHero: Hero = sut.hero;
      heroServiceMock.updateHero.and.returnValue(of({}));

      sut.save();

      expect(heroServiceMock.updateHero).toHaveBeenCalledWith(expectedHero);
    });

    it('HeroDetailComponent.goBack should be called once after save have been called', () => {
      heroServiceMock.updateHero.and.returnValue(of({}));
      const goBackSky = spyOn(sut, 'goBack');
      sut.save();

      expect(goBackSky).toHaveBeenCalledTimes(1);
    });

    it('HeroDetailComponent.goBack should be called once after save have been calledwithout parameters', () => {
      heroServiceMock.updateHero.and.returnValue(of({}));
      const goBackSky = spyOn(sut, 'goBack');
      sut.save();

      expect(goBackSky).toHaveBeenCalledWith();
    });

  });

});
