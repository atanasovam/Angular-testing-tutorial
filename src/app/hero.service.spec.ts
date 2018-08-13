import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from "@angular/common/http/testing";
import { of } from "rxjs/observable/of";
import { TestBed } from "@angular/core/testing";

import { MessageService } from "./message.service";
import { HeroService } from "./hero.service";
import { Hero } from "./hero";
import { Observable } from "rxjs/Observable";

describe('HeroService', () => {
  const isObservable = (objectToCheck): boolean => {

    const isInstanceOfObservable: boolean = objectToCheck instanceof Observable;
    const hasRequiredObservableMethods: boolean = typeof objectToCheck.lift === 'function' && typeof objectToCheck.subscribe === 'function';

    return isInstanceOfObservable || hasRequiredObservableMethods;
  };

  let httpTestingController: HttpTestingController;
  let messageServiceMock;
  let sut: HeroService;

  let baseURL: string;
  let heroID: number;
  let data: Array<Hero>;
  let req: TestRequest;

  beforeEach(() => {

    baseURL = 'api/heroes';
    messageServiceMock = jasmine.createSpyObj(['add']);

    data = [
      { id: 11, name: 'Mr. Nice', strength: 10 },
      { id: 12, name: 'Narco', strength: 5 },
    ];

    heroID = data[0].id;

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        HeroService,
        { provide: MessageService, useValue: messageServiceMock },
      ],
    });

    httpTestingController = TestBed.get(HttpTestingController);
    sut = TestBed.get(HeroService);

  });

  describe('getHeroes', () => {

    it('should call get with the default URL', () => {
      sut.getHeroes().subscribe();

      httpTestingController.expectOne(baseURL);
    });

    it('getHeroes should be of type Observable', () => {
      const getHeroesResult = sut.getHeroes();

      const isGetHeroesOfTypeObservable = isObservable(getHeroesResult)

      expect(isGetHeroesOfTypeObservable).toEqual(true)
    });

    describe('when there is a successful response', () => {

      beforeEach(() => data = []);

      it('should call log once', () => {
        const logSpy = spyOn((sut as any), 'log');

        sut.getHeroes().subscribe();
        req = httpTestingController.expectOne(baseURL);
        req.flush(data);

        expect(logSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with correct parameters', () => {
        const logSpy = spyOn((sut as any), 'log');

        sut.getHeroes().subscribe();
        req = httpTestingController.expectOne(baseURL);
        req.flush(data);

        expect(logSpy).toHaveBeenCalledWith('fetched heroes');

      });

    });

    describe('when there isn`t a successful response', () => {

      it('should call handleError once', () => {
        const handleErrorSpy = spyOn((sut as any), 'handleError').and.callThrough();

        sut.getHeroes().subscribe();
        const req: TestRequest = httpTestingController.expectOne(baseURL);
        req.flush({}, {
          status: 400,
          statusText: 'oops',
        });

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct parameters', () => {
        const handleErrorSpy = spyOn((sut as any), 'handleError').and.callThrough();

        sut.getHeroes().subscribe();
        req = httpTestingController.expectOne(baseURL);
        req.flush({}, {
          status: 400,
          statusText: 'oops',
        });

        expect(handleErrorSpy).toHaveBeenCalledWith('getHeroes', []);

      });

    });

  });

  describe('getHeroNo404', () => {

    let expectedUrl: string;

    beforeEach(() => expectedUrl = `${baseURL}/?id=${heroID}`);

    it('should call get with the default URL of the hero service', () => {

      sut.getHeroNo404(heroID).subscribe();

      httpTestingController.expectOne(expectedUrl);

    });

    describe('when there is a successful response, ', () => {
      let logSpy;

      beforeEach(() => expectedUrl = `${baseURL}/?id=${heroID}`);

      it('there is received data should call log once', () => {
        const logSpy = spyOn((sut as any), 'log');

        sut.getHeroNo404(heroID).subscribe();
        req = httpTestingController.expectOne(expectedUrl);
        req.flush(data);

        expect(logSpy).toHaveBeenCalledTimes(1);
      });


      it('there is received data and outcome, should call log with correct parameters', () => {
        const expectedLogMessage = `fetched hero id=${heroID}`;
        logSpy = spyOn((sut as any), 'log');

        sut.getHeroNo404(heroID).subscribe();
        req = httpTestingController.expectOne(expectedUrl);
        req.flush(data);

        expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);
      });

      it('there isn`t received data and there isn`t outcome, should call log with correct parameters', () => {
        const expectedLogMessage = `did not find hero id=${heroID}`;
        logSpy = spyOn((sut as any), 'log');

        sut.getHeroNo404(heroID).subscribe();
        req = httpTestingController.expectOne(expectedUrl);
        req.flush([]);

        expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);
      });

    });

    describe('when there isn`t a successful response', () => {
      let handleErrorSpy;

      beforeEach(() => expectedUrl = `${baseURL}/?id=${heroID}`);

      it('should made the request with the expected URL', () => {
        sut.getHeroNo404(heroID).subscribe();

        req = httpTestingController.expectOne(expectedUrl);

      });

      it('should call handleError once', () => {
        handleErrorSpy = spyOn((sut as any), 'handleError');

        sut.getHeroNo404(heroID).subscribe();

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct parameters', () => {
        handleErrorSpy = spyOn((sut as any), 'handleError');

        sut.getHeroNo404(heroID).subscribe();

        expect(handleErrorSpy).toHaveBeenCalledWith(`getHero id=${heroID}`);

      });

    });

    it('getHeroNo404 should be of type Observable', () => {
      const getHeroNo404Result = sut.getHeroNo404(heroID);
      const isGetHeroNo404OfTypeObservable = isObservable(getHeroNo404Result)

      expect(isGetHeroNo404OfTypeObservable).toEqual(true)
    });

  });

  describe('getHero', () => {
    let hero: Hero;

    beforeEach(() => hero = data[0]);

    it('should call get with URL that contains service` default url and hero id', () => {
      const expectedUrl: string = baseURL + '/' + heroID;

      sut.getHero(hero.id).subscribe();
      req = httpTestingController.expectOne(expectedUrl);
      req.flush(data);

      httpTestingController.verify();

    });

    it('getHero should be of type Observable', () => {
      const getHeroResult = sut.getHero(heroID);
      const isGetHeroOfTypeObservable = isObservable(getHeroResult)

      expect(isGetHeroOfTypeObservable).toEqual(true)
    });

    describe('when there is a successful response', () => {

      let expectedUrl: string;

      beforeEach(() => expectedUrl = baseURL + '/' + heroID);

      it('should call log once', () => {
        const logSpy = spyOn((sut as any), 'log');

        sut.getHero(hero.id).subscribe();
        req = httpTestingController.expectOne(expectedUrl);
        req.flush(data);

        expect(logSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with valid message', () => {
        const expectedLogMessage: string = `fetched hero id=${hero.id}`;
        const logSpy = spyOn((sut as any), 'log');

        sut.getHero(hero.id).subscribe();
        req = httpTestingController.expectOne(expectedUrl);
        req.flush(data);

        expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);

      });

    });

    describe('when there isn`t a successful response', () => {

      let expectedUrl: string;

      beforeEach(() => expectedUrl = baseURL + '/' + heroID);

      it('should call handleError once', () => {
        const handleErrorSpy = spyOn((sut as any), 'handleError');

        sut.getHero(heroID).subscribe();
        req = httpTestingController.expectOne(expectedUrl);

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct parameters', () => {
        const handleErrorSpy = spyOn((sut as any), 'handleError');
        const expectedHandleErrorMessage: string = `getHero id=${hero.id}`;

        sut.getHero(heroID).subscribe();
        req = httpTestingController.expectOne(expectedUrl);

        expect(handleErrorSpy).toHaveBeenCalledWith(expectedHandleErrorMessage);

      });

    });

  });

  describe('searchHeroes', () => {

    let hero: Hero;
    let expectedUrl: string;

    beforeEach(() => {

      hero = data[0];
      expectedUrl = `${baseURL}/?name=${hero.name}`;

    });

    it('should return Observable of empty array if term is false-like', () => {

      const actualResult = sut.searchHeroes(' ');

      expect(actualResult).toEqual(of([]));
    });

    it('should made the request with the expected URL', () => {
      sut.searchHeroes(hero.name).subscribe();

      req = httpTestingController.expectOne(expectedUrl);

    });

    it('searchHero should be of type Observable', () => {
      const searchHeroesResult = sut.searchHeroes('hero0');
      const isSearchHeroesOfTypeObservable = isObservable(searchHeroesResult)

      expect(isSearchHeroesOfTypeObservable).toEqual(true)
    });

    describe('when there is a successful response', () => {

      it('should call log once', () => {
        const logSpy = spyOn((sut as any), 'log');
        const term: string = hero.name[1];

        expectedUrl = `${baseURL}/?name=${term}`;

        sut.searchHeroes(term).subscribe();
        req = httpTestingController.expectOne(expectedUrl);
        req.flush([hero]);

        expect(logSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with correct parameter', () => {
        const term: string = hero.name[1];
        const logSpy = spyOn((sut as any), 'log');
        const expectedLogMessage: string = `found heroes matching "${term}"`;

        expectedUrl = `${baseURL}/?name=${term}`;

        sut.searchHeroes(term).subscribe();
        req = httpTestingController.expectOne(expectedUrl);
        req.flush([hero]);

        expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);

      });

    });

    describe('when there isn`t a successful response', () => {

      it('should call handleError once', () => {

        const heroTerm: string = hero.name[1];
        const handleErrorSpy = spyOn((sut as any), 'handleError');

        expectedUrl = `${baseURL}/?name=${heroTerm}`;

        sut.searchHeroes(heroTerm).subscribe();
        req = httpTestingController.expectOne(expectedUrl);

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct parameters', () => {

        const heroTerm: string = hero.name[1];
        const handleErrorSpy = spyOn((sut as any), 'handleError');

        expectedUrl = `${baseURL}/?name=${heroTerm}`;

        sut.searchHeroes(heroTerm).subscribe();
        req = httpTestingController.expectOne(expectedUrl);

        const expectedResult: Array<any> = ['searchHeroes', []];

        expect(handleErrorSpy).toHaveBeenCalledWith(...expectedResult);

      });

    });

  });

  describe('addHero', () => {

    let hero: Hero;

    beforeEach(() => hero = data[0]);

    describe('when there is a successful response', () => {

      it('should call addHero with the default URL of the hero service', () => {

        sut.addHero(hero).subscribe();
        req = httpTestingController.expectOne(baseURL);

      });

      it('should call log once', () => {
        const logSpy = spyOn((sut as any), 'log');

        sut.addHero(hero).subscribe();
        req = httpTestingController.expectOne(baseURL);
        req.flush(hero);

        expect(logSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log once', () => {
        const expectedLogMessage: string = `added hero w/ id=${hero.id}`;
        const logSpy = spyOn((sut as any), 'log');

        sut.addHero(hero).subscribe();
        req = httpTestingController.expectOne(baseURL);
        req.flush(hero);

        expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);
      });

      it('addHero should be of type Observable', () => {
        const addHeroResult = sut.addHero(data[0]);
        const isAddHeroOfTypeObservable = isObservable(addHeroResult)

        expect(isAddHeroOfTypeObservable).toEqual(true)
      });

    });

    describe('when there isn`t a successful response', () => {

      it('should call handleError once', () => {

        const handleErrorSpy = spyOn((sut as any), 'handleError');

        sut.addHero(hero).subscribe();
        req = httpTestingController.expectOne(baseURL);

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct method name', () => {

        const expectedResult: string = 'addHero';
        const handleErrorSpy = spyOn((sut as any), 'handleError');

        sut.addHero(hero).subscribe();
        req = httpTestingController.expectOne(baseURL);

        expect(handleErrorSpy).toHaveBeenCalledWith(expectedResult);

      });

    });

  });

  describe('deleteHero', () => {
    let expectedUrl: string;
    let hero: Hero;

    beforeEach(() => hero = data[0]);

    it('hero object, ID should be number( hero`s id )', () => {
      expectedUrl = `${baseURL}/${hero.id}`;
      sut.deleteHero(hero).subscribe();

      req = httpTestingController.expectOne(expectedUrl);
    });

    it('deleteHero should be of type Observable', () => {
      const deleteHeroResult = sut.deleteHero(data[0]);
      const isDeleteHeroOfTypeObservable = isObservable(deleteHeroResult)

      expect(isDeleteHeroOfTypeObservable).toEqual(true)
    });

    describe('when there is a successful response', () => {

      beforeEach(() => expectedUrl = `${baseURL}/${hero.id}`);

      it('should call log once', () => {

        const logSpy = spyOn((sut as any), 'log');

        sut.deleteHero(hero).subscribe();
        req = httpTestingController.expectOne(expectedUrl);
        req.flush(data);
        expect(logSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with correct value', () => {

        const expectedLogMessage: string = `deleted hero id=${hero.id}`;
        const logSpy = spyOn((sut as any), 'log');

        sut.deleteHero(hero).subscribe();
        req = httpTestingController.expectOne(expectedUrl);
        req.flush(hero);

        expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);

      });

    });

    describe('when there isn`t a successful response', () => {

      beforeEach(() => { });

      it('should call handleError once', () => {
        const handleErrorSpy = spyOn((sut as any), 'handleError');

        sut.deleteHero(hero);

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct value', () => {
        const handleErrorSpy = spyOn((sut as any), 'handleError');
        const expectedResult: string = 'deleteHero';

        sut.deleteHero(hero);

        expect(handleErrorSpy).toHaveBeenCalledWith(expectedResult);

      });

    });

  });

  describe('updateHero', () => {

    let hero: Hero;

    beforeEach(() => hero = data[0]);

    it('should call get with the default URL of the hero service', () => {

      sut.updateHero(hero).subscribe();

      req = httpTestingController.expectOne(baseURL);

    });

    it('updateHero should be of type Observable', () => {
      const updateHeroResult = sut.deleteHero(data[0]);
      const isUpdateHeroOfTypeObservable = isObservable(updateHeroResult)

      expect(isUpdateHeroOfTypeObservable).toEqual(true)
    });

    describe('when there is a successful response', () => {

      it('should call log once', () => {
        const logSpy = spyOn((sut as any), 'log');

        sut.updateHero(hero).subscribe();
        req = httpTestingController.expectOne(baseURL);
        req.flush(hero);

        expect(logSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with correct value', () => {
        const expectedLogMessage: string = `updated hero id=${hero.id}`;
        const logSpy = spyOn((sut as any), 'log');

        sut.updateHero(hero).subscribe();
        req = httpTestingController.expectOne(baseURL);
        req.flush(hero);

        expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);

      });

    });

    describe('when there isn`t a successful response', () => {

      beforeEach(() => { });

      it('should call handleError once', () => {

        const handleErrorSpy = spyOn((sut as any), 'handleError');

        sut.updateHero(hero).subscribe();
        req = httpTestingController.expectOne(baseURL);
        req.flush(hero);

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct value', () => {
        const handleErrorSpy = spyOn((sut as any), 'handleError');
        const expectedResult: string = 'updateHero';

        sut.updateHero(hero).subscribe();
        req = httpTestingController.expectOne(baseURL);
        req.flush(hero);

        expect(handleErrorSpy).toHaveBeenCalledWith(expectedResult);

      });

    });

  });

  describe('handleError', () => {
    let _sut: any;

    beforeEach(() => _sut = (sut as any));

    it('after getHeroes have been called, sut.handleError should be called once', () => {
      spyOn(_sut, 'handleError').and.callThrough();

      sut.getHeroes().subscribe();
      const req: TestRequest = httpTestingController.expectOne(baseURL);
      req.flush({}, {
        status: 400,
        statusText: 'oops',
      });

      expect(_sut.handleError).toHaveBeenCalledTimes(1);
    });

    it('after getHeroes have been called, sut.handleError should be called once', () => {
      spyOn(_sut, 'handleError').and.callThrough();

      sut.getHeroes().subscribe();
      const req: TestRequest = httpTestingController.expectOne(baseURL);
      req.flush({}, {
        status: 400,
        statusText: 'oops',
      });

      expect(_sut.handleError).toHaveBeenCalledTimes(1);
    });

    it('after getHeroes have been called, sut.handleError should be called with message that contains `getHeroes` and an empty array ', () => {
      const expectedParams: Array<any> = ['getHeroes', []];
      spyOn(_sut, 'handleError').and.callThrough();

      sut.getHeroes().subscribe();
      const req: TestRequest = httpTestingController.expectOne(baseURL);
      req.flush({}, {
        status: 400,
        statusText: 'oops',
      });

      expect(_sut.handleError).toHaveBeenCalledWith(...expectedParams);
    });

    it('after getHeroes have been called, messageService.add should be called with message that contains `HeroService: ` + logMessage ', () => {
      const expectedParams: string = 'HeroService: getHeroes failed: Http failure response for api/heroes: 400 oops';

      sut.getHeroes().subscribe();
      const req: TestRequest = httpTestingController.expectOne(baseURL);
      req.flush({}, {
        status: 400,
        statusText: 'oops',
      });

      expect(messageServiceMock.add).toHaveBeenCalledWith(expectedParams);
    });

    it('after getHeroNo404 have been called, sut.handleError should return function witch returns Observable', () => {
      const handleErrorReturnedValue = _sut.handleError('getHero id=${id}', {});

      const result = handleErrorReturnedValue(new Error('oops'));
      const isResultObservable = isObservable(result);

      expect(isResultObservable).toBeTruthy();
    });

    it('after handleError have been called, the result of it`s result function should be the same as the second input parameter', () => {
      const expectedResult = { id: 1 };
      const handleErrorReturnedValue = _sut.handleError(`getHero id=${expectedResult.id}`, expectedResult);

      const result = handleErrorReturnedValue(new Error('oops'));

      expect(result.value).toEqual(expectedResult);
    });

    it('after handleError have been called without second parameter, the result of it`s result function should be Observable of undefined', () => {
      const handleErrorReturnedValue = _sut.handleError('getHero id=1', undefined);

      const result = handleErrorReturnedValue(new Error('oops'));

      expect(result.value).toBeUndefined();
    });
  });

  describe('log', () => {
    let _sut: any;

    beforeEach(() => _sut = (sut as any));

    it('after getHeroes have been called, sut.log should be called once', () => {
      spyOn(_sut, 'log').and.callThrough();

      sut.getHeroes().subscribe();
      const req: TestRequest = httpTestingController.expectOne(baseURL);
      req.flush(data);

      expect(_sut.log).toHaveBeenCalledTimes(1);
    });

    it('after getHeroes have been called, messageService.add should be called once', () => {

      sut.getHeroes().subscribe();
      const req: TestRequest = httpTestingController.expectOne(baseURL);
      req.flush(data);

      expect(_sut.messageService.add).toHaveBeenCalledTimes(1);
    });

    it('after getHeroes have been called, messageService.add should be called with message that contains `HeroService: ` + logMessage ', () => {
      const message: string = 'fetched heroes';
      const expectedMessage: string = 'HeroService: ' + message;

      sut.getHeroes().subscribe();
      const req: TestRequest = httpTestingController.expectOne(baseURL);
      req.flush(data);

      expect(_sut.messageService.add).toHaveBeenCalledWith(expectedMessage);
    });

    it('sut.log should be of type void', () => {
      const actualResult = _sut.log('log');

      expect(actualResult).toBeUndefined();
    });

  });

});
