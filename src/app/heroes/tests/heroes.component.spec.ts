import { of } from 'rxjs/observable/of';

import { HeroesComponent } from '../heroes.component';
import { Hero } from '../../hero';
import { tick, fakeAsync } from '../../../../node_modules/@angular/core/testing';

describe('HeroesComponent', () => {

  let sut: HeroesComponent;
  let heroServiceMock: any;
  let data: Array<Hero>;

  beforeEach(() => {

    data = [
      { id: 0, name: 'hero0', strength: 11 },
      { id: 1, name: 'hero1', strength: 18 },
      { id: 2, name: 'hero2', strength: 80 },
    ];

    heroServiceMock = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    sut = new HeroesComponent(heroServiceMock);

  });

  describe('delete', () => {

    it('should delete 1 hero from the heroes list', () => {
      heroServiceMock.deleteHero.and.returnValue(of(true));
      sut.heroes = data;

      sut.delete(data[0]);

      const actualHeroesListLength: number = sut.heroes.length;
      const expectedHeroesListLength: number = 2;

      expect(expectedHeroesListLength).toEqual(actualHeroesListLength);
    });

    it('shouldn`t modify the heroes list, when the provided hero doesn`t exist', () => {
      const nonExistingHero: Hero = { id: 100, name: 'name', strength: 0 };

      heroServiceMock.deleteHero.and.returnValue(of(true));
      sut.heroes = data;

      sut.delete(nonExistingHero);

      const actualHeroesListLength: number = sut.heroes.length;
      const expectedHeroesListLength: number = 3;

      expect(expectedHeroesListLength).toEqual(actualHeroesListLength);
    });

    it('should remove the provided hero from the heroes list', () => {
      const heroToDelete: Hero = data[0];

      heroServiceMock.deleteHero.and.returnValue(of(true));
      sut.heroes = data;

      sut.delete(heroToDelete);

      const actualResult = sut.heroes.filter((hero: Hero) => hero.id === heroToDelete.id);
      const expectedResult = [];

      expect([...actualResult]).toEqual([...expectedResult]);
    });

    it('heroService.deleteHero should be called once', () => {
      const hero: Hero = data[0];

      heroServiceMock.deleteHero.and.returnValue(of(true));
      sut.heroes = data;

      sut.delete(hero);

      expect(heroServiceMock.deleteHero).toHaveBeenCalledTimes(1);
    });

    it('heroService.deleteHero should be called with the provided hero object', () => {
      const heroToDelete: Hero = data[0];

      heroServiceMock.deleteHero.and.returnValue(of(true));
      sut.heroes = data;

      sut.delete(heroToDelete);

      expect(heroServiceMock.deleteHero).toHaveBeenCalledWith(heroToDelete)
    });

    it('heroService.deleteHero.subscribe should be called once', fakeAsync(() => {
      const subscribeSpy = jasmine.createSpyObj(['subscribe']);
      console.log(subscribeSpy);

      const heroToDelete: Hero = data[0];

      heroServiceMock.deleteHero.and.returnValue(subscribeSpy);
      sut.heroes = data;

      sut.delete(heroToDelete);
      tick();
      expect(subscribeSpy.subscribe).toHaveBeenCalledTimes(1);
    }));

  });

  describe('ngOnInit', () => {

    beforeEach(() => heroServiceMock.getHeroes.and.returnValue(of(data)));

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

    beforeEach(() => heroServiceMock.getHeroes.and.returnValue(of(data)));

    it('when getHeroes is called heroService.getHeroes should be called once', () => {
      const heroService = (sut as any).heroService;

      sut.getHeroes();

      expect(heroService.getHeroes).toHaveBeenCalledTimes(1);
    });

    it('when getHeroes is called heroes shouldn`t be undefined', () => {
      sut.getHeroes();

      expect(sut.heroes).toBeDefined();
    });

  });

  describe('add', () => {
    let hero: Hero;

    beforeEach(() => hero = data[0]);

    it('when add is called with empty string, shouldn`t add new hero', () => {
      const heroName: string = '';
      heroServiceMock.addHero.and.returnValue(of(heroName));

      sut.add(heroName);

      expect(heroServiceMock.addHero).not.toHaveBeenCalled();
    });

    it('when add is called with non empty string, should add new hero', () => {
      const heroName: string = hero.name;
      const expectedParameters = { name: hero.name, strength: hero.strength };

      heroServiceMock.addHero.and.returnValue(of(heroName));
      sut.heroes = [];

      sut.add(heroName);

      expect(heroServiceMock.addHero).toHaveBeenCalledWith(expectedParameters);
    });

    it('when add is called with valid parameter heroService.addHero should be called once', () => {
      const hero: Hero = data[0];

      sut.heroes = data;
      heroServiceMock.addHero.and.returnValue(of(hero));

      sut.add(hero.name);

      expect(heroServiceMock.addHero).toHaveBeenCalledTimes(1);
    });

    it('when add is called with hero object heroService.addHero should be called with the same parameters', () => {
      const hero: Hero = data[0];
      const expectedResult = { name: hero.name, strength: hero.strength };

      sut.heroes = data;
      heroServiceMock.addHero.and.returnValue(of(expectedResult));

      sut.add(expectedResult.name);

      expect(heroServiceMock.addHero).toHaveBeenCalledWith(expectedResult);
    });

    it('when add is called the hero array length should be incremented once', () => {
      const hero: Hero = data[0];

      sut.heroes = data;
      heroServiceMock.addHero.and.returnValue(of(hero));

      const expectedHeroListLength: number = sut.heroes.length + 1;

      sut.add(hero.name);
      const actualHeroListLength: number = sut.heroes.length;

      expect(expectedHeroListLength).toEqual(actualHeroListLength);
    });

  });

});
