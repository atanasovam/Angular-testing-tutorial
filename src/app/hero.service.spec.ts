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

  describe('getHeroes', () => {

    it('should call get with the default URL', () => {

      sut.getHeroes().subscribe();

      httpTestingController.expectOne(baseURL);

    });

    describe('when there is a successful response', () => {

      let logSpy;

      beforeEach(() => {

        logSpy = spyOn((sut as any), 'log');

        sut.getHeroes().subscribe();

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

  describe('getHeroNo404', () => {

    let expectedUrl: string;

    beforeEach(() => expectedUrl = `${baseURL}/?id=${heroID}`);

    it('should call get with the default URL', () => {

      sut.getHeroNo404(heroID).subscribe();

      httpTestingController.expectOne(expectedUrl);

    });

    describe('when there is a successful response', () => {

      let logSpy;

      beforeEach(() => {

        expectedUrl = `${baseURL}/?id=${heroID}`;

        logSpy = spyOn((sut as any), 'log');

        sut.getHeroNo404(heroID).subscribe();

        req = httpTestingController.expectOne(expectedUrl);

      });

      describe('when there is recieved data', () => {

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

    describe('when there isn`t a successful response', () => {

      let handleErrorSpy;

      beforeEach(() => {

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

    it('should call get with correctly constructed URL', () => {

      sut.getHero(heroID).subscribe();

      req = httpTestingController.expectOne(baseURL + '/' + heroID);

      req.flush(data);

      httpTestingController.verify();

    });

    describe('when there is a successful response', () => {

      let logSpy;

      beforeEach(() => {

        logSpy = spyOn((sut as any), 'log');

        sut.getHeroes().subscribe();

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
        sut.getHero(heroID).subscribe();

        req = httpTestingController.expectOne(baseURL + '/' + heroID);
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

      sut.searchHeroes(heroName).subscribe();

      req = httpTestingController.expectOne(`${baseURL}/?name=${heroName}`);

    });

    it('should return Observable of empty array if term is false-like', () => {

      actualResult = sut.searchHeroes(' ');
      req.flush([data[1]]);

      expect(actualResult).toEqual(of([]));

    });

    it('should call http.get with correctly constructed URL', () => {
      const heroName: string = data[0].name;
      req.flush(data);

      actualResult = sut.searchHeroes(heroName).subscribe();

      httpTestingController.expectOne(`${baseURL}/?name=${heroName}`);

    });

    it('searchHeroes shouldn`t returns observble of empty array if it is called with true-like parameter ', () => {
      const heroName: string = data[0].name;
      req.flush(data);

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
    let actualResult;
    let httpOptions;

    beforeEach(() => {

      httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };

      hero = data[0];

      sut.addHero(hero).subscribe();

      req = httpTestingController.expectOne(baseURL);

    });

    describe('when there is a successful response', () => {

      let logSpy;

      beforeEach(() => {

        logSpy = spyOn((sut as any), 'log');

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
    let actualResult;

    beforeEach(() => {

      hero = data[0];

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
