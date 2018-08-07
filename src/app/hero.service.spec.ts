import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { of } from "rxjs/observable/of";
import { TestBed } from "@angular/core/testing";
import { HttpHeaders } from "@angular/common/http";

import { MessageService } from "./message.service";
import { HeroService } from "./hero.service";
import { Hero } from "./hero";

import * as Rx from "rxjs";

describe('HeroService', () => {

  let httpTestingController: HttpTestingController;
  let messageServiceMock;
  let sut: HeroService;

  let baseURL: string;
  let heroID: number;
  let data: Array<Hero>;
  let req;

  beforeEach(() => {

    baseURL = 'api/heroes';
    messageServiceMock = jasmine.createSpyObj(['add']);
    heroID = 1;

    data = [
      { id: 11, name: 'Mr. Nice', strength: 10 },
      { id: 12, name: 'Narco', strength: 5 },
    ];

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

  // REVIEW: the test coverage is too shallow...
  // what about the inner workings of log and handleError?
  // what about the return type (Observable) of the functions
  describe('getHeroes', () => {

    it('should call get with the default URL', () => {

      sut.getHeroes().subscribe();

      httpTestingController.expectOne(baseURL);

    });

    describe('when there is a successful response', () => {

      let logSpy;

      beforeEach(() => {

        // REVIEW: too much stuff in the beforeEach
        logSpy = spyOn((sut as any), 'log');

        sut.getHeroes().subscribe();

        // REVIEW: never expect in the before/beforeEach
        req = httpTestingController.expectOne(baseURL);
        data = [];

        req.flush(data);

      });

      it('should call log once', () => {

        expect(logSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with correct parameters', () => {

        expect(logSpy).toHaveBeenCalledWith('fetched heroes');

      });

    });

    describe('when there isn`t a successful response', () => {

      let handleErrorSpy;

      beforeEach(() => {

        handleErrorSpy = spyOn((sut as any), 'handleError');

        // REVIEW: Same as above
        sut.getHeroes().subscribe();

        req = httpTestingController.expectOne(baseURL);
        data = [];

        req.flush(data);

      });

      it('should call handleError once', () => {

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct parameters', () => {

        expect(handleErrorSpy).toHaveBeenCalledWith('getHeroes', []);

      });

    });

  });

  // REVIEW: Too heavy on the suite structure -> decreased readability and story-telling
  describe('getHeroNo404', () => {

    let expectedUrl: string;

    beforeEach(() => expectedUrl = `${baseURL}/?id=${heroID}`);

    // REVIEW: "wtf is default url?"
    it('should call get with the default URL', () => {

      sut.getHeroNo404(heroID).subscribe();

      httpTestingController.expectOne(expectedUrl);

    });

    describe('when there is a successful response', () => {

      let logSpy;

      beforeEach(() => {

        // REVIEW: side effect of heavy structure -> duplicated action
        expectedUrl = `${baseURL}/?id=${heroID}`;

        // REVIEW: Again too heavy beforeEach
        logSpy = spyOn((sut as any), 'log');

        sut.getHeroNo404(heroID).subscribe();

        req = httpTestingController.expectOne(expectedUrl);

      });

      // REVIEW: install a spell check extension
      describe('when there is recieved data', () => {

        // REVIEW: side effect of too heavy structure -> where TF is data? It is 4 describes out
        beforeEach(() => req.flush(data));

        it('should call log once', () => {

          expect(logSpy).toHaveBeenCalledTimes(1);

        });


        it('and there is outcome, should call log with correct parameters', () => {
          const expectedLogMessage = `fetched hero id=${heroID}`;

          expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);

        });

      });


      describe('when there isn`t recieved data', () => {

        it('and there isn`t outcome, should call log with correct parameters', () => {
          const expectedLogMessage = `did not find hero id=${heroID}`;

          req.flush([]);

          expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);

        });

      });

    });

    // REVIEW: Incorrect Suite -> copy-paste driven development
    describe('when there isn`t a successful response', () => {

      let handleErrorSpy;

      beforeEach(() => {
        // REVIEW: same as before
        handleErrorSpy = spyOn((sut as any), 'handleError');
        sut.getHeroes().subscribe();

        req = httpTestingController.expectOne(baseURL);
        data = [];

        req.flush(data);

      });

      it('should call handleError once', () => {

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct parameters', () => {

        expect(handleErrorSpy).toHaveBeenCalledWith('getHeroes', data);

      });

    });

  });

  describe('getHero', () => {

    // REVIEW: dafaq is a "correctly constructed URL"
    it('should call get with correctly constructed URL', () => {

      sut.getHero(heroID).subscribe();

      req = httpTestingController.expectOne(baseURL + '/' + heroID);

      req.flush(data);

      httpTestingController.verify();

    });

    // REVIEW: Incorrect suite -> copy-paste driven development
    describe('when there is a successful response', () => {

      let logSpy;

      beforeEach(() => {

        // REVIEW: same as before
        logSpy = spyOn((sut as any), 'log');

        // REVIEW: WTF? getHeroes?
        sut.getHeroes().subscribe();

        req = httpTestingController.expectOne(baseURL);
        data = [];

        req.flush(data);

      });

      it('should call log once', () => {

        expect(logSpy).toHaveBeenCalledTimes(1);

      });

      // REVIEW: dafaq is "correct parameters"
      it('should call log with correct parameters', () => {

        expect(logSpy).toHaveBeenCalledWith('fetched heroes');

      });

    });

    describe('when there isn`t a successful response', () => {

      let handleErrorSpy;

      beforeEach(() => {

        // REVIEW: same as before
        handleErrorSpy = spyOn((sut as any), 'handleError');

        // REVIEW: here we have getHero... consistency level over 9000
        sut.getHero(heroID).subscribe();

        req = httpTestingController.expectOne(baseURL + '/' + heroID);

        // REVIEW: Incorrect response type
        data = [];

        req.flush(data);

      });

      it('should call handleError once', () => {

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct parameters', () => {

        expect(handleErrorSpy).toHaveBeenCalledWith('getHero id=' + heroID);

      });

    });

  });

  describe('searchHeroes', () => {

    let heroName: string;
    let actualResult;

    beforeEach(() => {

      heroName = data[0].name;

      // REVIEW: just no
      sut.searchHeroes(heroName).subscribe();

      req = httpTestingController.expectOne(`${baseURL}/?name=${heroName}`);

    });

    it('should return Observable of empty array if term is false-like', () => {

      actualResult = sut.searchHeroes(' ');

      // REVIEW: flush? why flush?
      req.flush([data[1]]);

      expect(actualResult).toEqual(of([]));
    });

    // REVIEW: what is "correctly"
    it('should call http.get with correctly constructed URL', () => {
      const heroName: string = data[0].name;
      req.flush(data);

      actualResult = sut.searchHeroes(heroName).subscribe();

      httpTestingController.expectOne(`${baseURL}/?name=${heroName}`);

    });

    // REVIEW: Grammar, typos
    it('searchHeroes shouldn`t returns observble of empty array if it is called with true-like parameter ', () => {
      const heroName: string = data[0].name;
      req.flush(data);

      // REVIEW: Incorrect test -> .subscribe(); returns a Subscription, so it will never equal of([])
      actualResult = sut.searchHeroes(heroName).subscribe();

      httpTestingController.expectOne(`${baseURL}/?name=${heroName}`);

      expect(actualResult).not.toEqual(of([]));

    });

    describe('when there is a successful response', () => {

      let logSpy;

      beforeEach(() => {

        logSpy = spyOn((sut as any), 'log');


        heroName = data[0].name;

        actualResult = sut.searchHeroes(heroName);
        req.flush([data[1]]);

      });

      it('should call log once', () => {

        expect(logSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with correct parameter', () => {

        const expectedLogMessage: string = `found heroes matching "${heroName}"`;

        expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);

      });

    });

    describe('when there isn`t a successful response', () => {

      let handleErrorSpy;

      beforeEach(() => {

        handleErrorSpy = spyOn((sut as any), 'handleError');

        // REVIEW: same as before
        heroName = data[0].name;

        actualResult = sut.searchHeroes(heroName);
        req.flush([]);

      });

      it('should call handleError once', () => {

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct parameters', () => {

        const expectedResult: Array<any> = ['searchHeroes', []];

        expect(handleErrorSpy).toHaveBeenCalledWith(...expectedResult);

      });

    });

  });

  describe('addHero', () => {

    let hero: Hero;
    // REVIEW: unused variables
    let actualResult;
    let httpOptions;

    beforeEach(() => {

      httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };

      hero = data[0];

      // REVIEW: Same as before
      sut.addHero(hero).subscribe();

      req = httpTestingController.expectOne(baseURL);

    });

    describe('when there is a successful response', () => {

      let logSpy;

      beforeEach(() => {

        logSpy = spyOn((sut as any), 'log');

        // REVIEW: duplicated action
        actualResult = sut.addHero(hero);
        req.flush(data[0]);

      });

      it('should call log once', () => {

        expect(logSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with correct value', () => {

        const expectedLogMessage: string = `added hero w/ id=${hero.id}`;

        expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);

      });

    });

    describe('when there isn`t a successful response', () => {

      let handleErrorSpy;

      beforeEach(() => {

        handleErrorSpy = spyOn((sut as any), 'handleError');

        actualResult = sut.addHero(hero);
        req.flush(data[0]);

      });

      it('should call handleError once', () => {

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct value', () => {

        const expectedResult: string = 'addHero';

        expect(handleErrorSpy).toHaveBeenCalledWith(expectedResult);

      });

    });

  });

  describe('deleteHero', () => {

    let hero: Hero;
    // REVIEW: unused variable
    let actualResult;

    beforeEach(() => {

      hero = data[0];

      // REVIEW: Same
      sut.deleteHero(hero.id).subscribe();

      req = httpTestingController.expectOne(`${baseURL}/${hero.id}`);

    });

    it('hero object, ID should be number( hero`s id )', () => {

      sut.deleteHero(hero).subscribe();

      req = httpTestingController.expectOne(`${baseURL}/${hero.id}`);

    });

    describe('when there is a successful response', () => {

      let logSpy;

      beforeEach(() => {

        logSpy = spyOn((sut as any), 'log');

        // REVIEW: same
        actualResult = sut.deleteHero(hero);
        req.flush(data[0]);

      });

      it('should call log once', () => {

        expect(logSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with correct value', () => {

        const expectedLogMessage: string = `deleted hero id=${hero.id}`;

        expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);

      });

    });

    describe('when there isn`t a successful response', () => {

      let handleErrorSpy;

      beforeEach(() => {

        handleErrorSpy = spyOn((sut as any), 'handleError');

        actualResult = sut.deleteHero(hero);
        req.flush(data[0]);

      });

      it('should call handleError once', () => {

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct value', () => {

        const expectedResult: string = 'deleteHero';

        expect(handleErrorSpy).toHaveBeenCalledWith(expectedResult);

      });

    });

  });

  describe('updateHero', () => {

    let hero: Hero;
    // REVIEW: unused variable
    let actualResult;

    beforeEach(() => {

      hero = data[0];

      sut.updateHero(hero).subscribe();

      req = httpTestingController.expectOne(baseURL);

    });

    describe('when there is a successful response', () => {

      let logSpy;

      beforeEach(() => {

        logSpy = spyOn((sut as any), 'log');

        actualResult = sut.updateHero(hero);
        req.flush(data[0]);

      });

      it('should call log once', () => {

        expect(logSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with correct value', () => {

        const expectedLogMessage: string = `updated hero id=${hero.id}`;

        expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);

      });

    });

    describe('when there isn`t a successful response', () => {

      let handleErrorSpy;

      beforeEach(() => {

        handleErrorSpy = spyOn((sut as any), 'handleError');

        actualResult = sut.updateHero(hero);
        req.flush(data[0]);

      });

      it('should call handleError once', () => {

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call handleError with correct value', () => {

        const expectedResult: string = 'updateHero';

        expect(handleErrorSpy).toHaveBeenCalledWith(expectedResult);

      });

    });

  });

});
