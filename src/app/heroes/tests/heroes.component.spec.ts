import { of } from 'rxjs/observable/of';

import { HeroesComponent } from '../heroes.component';
import { Hero } from '../../hero';

describe('HeroesComponent', () => {

  let sut: HeroesComponent;
  let heroServiceMock: any;
  let heroes: Array<Hero>;
  let heroServiceMethodsToSpyOn: Array<string>;

  beforeEach(() => {

    heroes = [
      { id: 0, name: 'hero0', strength: 8 },
      { id: 1, name: 'hero1', strength: 18 },
      { id: 2, name: 'hero2', strength: 80 },
    ];

    heroServiceMock = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    sut = new HeroesComponent(heroServiceMock);

  });

  // REVIEW: Where are the delete tests defined at the bottom of the file?
  describe('delete', () => {

    beforeEach(() => {
      heroServiceMock.deleteHero.and.returnValue(of(true))
    });

    it('should delete 1 hero from the heroes list', () => {

      sut.heroes = heroes;

      sut.delete(heroes[0]);

      const actualHeroesListLength: number = sut.heroes.length;
      const expectedHeroesListLength: number = 2;

      expect(expectedHeroesListLength).toEqual(actualHeroesListLength);

    });

  });

  describe('ngOnInit', () => {

    beforeEach(() => {
      heroServiceMock.getHeroes.and.returnValue(of(heroes))
    });

    it('when ngOnInit is called getHeroes should be called once', () => {
      spyOn(sut, 'getHeroes');

      sut.ngOnInit();

      expect(sut.getHeroes).toHaveBeenCalledTimes(1);
    });

    it('when ngOnInit is called getHeroes should be called without parameters', () => {
      spyOn(sut, 'getHeroes');

      sut.ngOnInit();

      expect(sut.getHeroes).toHaveBeenCalledWith();
    });

  });


  describe('getHeroes', () => {

    beforeEach(() => {
      heroServiceMock.getHeroes.and.returnValue(of(heroes))
    });

    it('when getHeroes is called heroService.getHeroes should be called once', () => {
      const heroService = (sut as any).heroService;

      sut.getHeroes();

      expect(heroService.getHeroes).toHaveBeenCalledTimes(1);

    });

    it('when getHeroes is called heroes shouldn`t be undefined', () => {
      sut.getHeroes();

      expect(sut.heroes).not.toBeUndefined;
    });

  });

  describe('add', () => {

    // REVIEW: when add is called....??? what should happen?
    // REVIEW: missed case that the actual hero was added to the collection
    it('when add is called with empty string', () => {

      const heroName: string = '';

      heroServiceMock.addHero.and.returnValue(of(heroName))

      sut.add(heroName);
      expect(heroServiceMock.addHero).not.toHaveBeenCalled();

    });

    it('when add is called with valid parameter heroService.addHero should be called once', () => {

      const hero: Hero = heroes[0];
      sut.heroes = heroes;

      heroServiceMock.addHero.and.returnValue(of(hero));
      sut.add(hero.name);

      expect(heroServiceMock.addHero).toHaveBeenCalledTimes(1);

    });

    // REVIEW: What happened here?
    xit('when add is called with valid parameter heroService.addHero should be called once', () => {

      const hero: Hero = heroes[0];
      sut.heroes = heroes;

      heroServiceMock.addHero.and.returnValue(of({ name: hero.name, strength: hero.strength }));

      sut.add(hero.name);

      // REVIEW: why access this like that?
      expect((sut as any).heroService.addHero).toHaveBeenCalledWith({ name: hero.name, strength: hero.strength });
    });

    it('when add is called the hero array length should be incremented once', () => {
      sut.heroes = heroes;

      const hero: Hero = heroes[0];
      sut.heroes = heroes;

      heroServiceMock.addHero.and.returnValue(of(hero));

      const expectedHeroListlength: number = sut.heroes.length + 1;

      sut.add(hero.name);
      const actualHeroListlength: number = sut.heroes.length;

      expect(expectedHeroListlength).toEqual(actualHeroListlength);

    });

  });

});

// Test Cases for Delete
// 0. shouldn`t modify the heroes list, when the provided hero doesn`t exist
// 1. should remove the provided hero from the heroes list
// 2. heroService.deleteHero should be called once
// 3. heroService.deleteHero should be called with the provided hero object.
// 4. heroService.deleteHero.subscribe should be called once

// { provide: HeroService, useValue: mockHeroService }
// what are the other 2 options and when do I want to use them
// research the fucking fixture
// research debugElement

// research zone.js
// research QueryList