import {
  TestBed,
  fakeAsync,
  tick,
  ComponentFixture,
  flush,
} from "@angular/core/testing";
import { of } from "rxjs/observable/of";
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { HeroDetailComponent } from "./hero-detail.component";
import { HeroService } from "../hero.service";

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

    // REVIEW: why NO_ERRORS_SCHEMA
    TestBed.configureTestingModule({
      declarations: [
        HeroDetailComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: HeroService, useValue: heroServiceMock },
        { provide: Location, useValue: locationMock },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    });

    heroServiceMock.getHero.and.returnValue(of(hero));

    fixture = TestBed.createComponent(HeroDetailComponent);
    sut = fixture.componentInstance;

    // REVIEW: bad idea to have it here, because there might be cases where you want to do stuff before the NG initiation
    fixture.detectChanges();

  });

  // REVIEW: need better describe organization
  // no way to easily see each method's tests
  // no way to easily see the template tests

  // REVIEW: shallow test coverage
  // where are the sut.getHero tests 

  // REVIEW: hidden expectation -> the title should notify that we expect an uppercase version of the name
  it('should render hero name in a h2 tag', () => {

    const actualResult: string = fixture.nativeElement.querySelector('h2').textContent;

    expect(actualResult).toContain(hero.name.toUpperCase());

  });

  // REVIEW: why fakeAsync?
  it('should call updateHero when save is called', fakeAsync(() => {

    heroServiceMock.updateHero.and.returnValue(of({}));

    sut.save();
    flush();

    expect(heroServiceMock.updateHero).toHaveBeenCalledTimes(1);

  }));

  it('when ngOnInit is called getHero should be called once', () => {

    spyOn(sut, 'getHero');

    sut.ngOnInit();

    expect(sut.getHero).toHaveBeenCalledTimes(1);

  });

  // REVIEW: Inconsistent title and implementation, hint -> copy-paste driven development
  it('when ngOnInit is called getHero should be called once', () => {
    const heroServiceSpy = (sut as any).heroService;

    expect(heroServiceSpy.getHero).toHaveBeenCalledTimes(1);

  });

  // REVIEW: inconsistent title and implementation
  it('when ngOnInit is called getHero should be called with parameter of type number', () => {
    const heroServiceSpy = (sut as any).heroService;

    expect(heroServiceSpy.getHero).toHaveBeenCalledWith(hero.id);

  });

  it('after ngOnInit the hero parameter shouldn`t be undefined', () => {

    expect(sut.hero).not.toBeUndefined;

  });

  it('when goBack is called location.back should be called', () => {
    const locationSpy = (sut as any).location;

    sut.goBack();

    expect(locationSpy.back).toHaveBeenCalledTimes(1);

  });

  it('when goBack is called location.back should be called with no parameters', () => {
    const locationSpy = (sut as any).location;

    sut.goBack();

    expect(locationSpy.back).toHaveBeenCalledWith();

  });

  // REVIEW: duplicated case
  it('after ngOnInit, component`s template h2 tag should contains the hero`s uppercase name ', () => {
    const h2TextContent: string = fixture.nativeElement.querySelector('h2').textContent;

    expect(h2TextContent).toContain(hero.name.toUpperCase());

  });

  it('after ngOnInit, component`s template should contains the hero`s id ', () => {
    const divTextContent: string = fixture.nativeElement.querySelector('div').textContent;

    expect(divTextContent).toContain(hero.id);

  });

  // intgr. tests
  // REVIEW: muuuhahahahah this is a good one, I seeeee 8 bugs, how many do you see here?
  it('after ngOnInit, component`s template input element should contains the hero`s name ', () => {
    const divTextContent: string = fixture.nativeElement.querySelector('input').value;

    setTimeout(() => expect(divTextContent).toContain(hero.name), 2000);

  });

  it('on `go back` button click goBack should be called once', () => {

    spyOn(sut, 'goBack');
    const backButton = fixture.nativeElement.querySelector('button');

    backButton.click();

    expect(sut.goBack).toHaveBeenCalledTimes(1);
  });
  
  it('on `go back` button click goBack should be called without parameters', () => {

    spyOn(sut, 'goBack');
    const backButton = fixture.nativeElement.querySelector('button');

    backButton.click();

    expect(sut.goBack).toHaveBeenCalledWith();
  });

  it('on `save` button click save should be called once', () => {

    spyOn(sut, 'save');
    const saveButton = fixture.nativeElement.querySelectorAll('button')[1];

    saveButton.click();

    expect(sut.save).toHaveBeenCalledTimes(1);
  });
  
  it('on `save` button click save should be called without parameters', () => {

    spyOn(sut, 'save');
    const saveButton = fixture.nativeElement.querySelectorAll('button')[1];

    saveButton.click();

    expect(sut.save).toHaveBeenCalledWith();
  });

});
