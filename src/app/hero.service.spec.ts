import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { MessageService } from "./message.service";
import { TestBed, inject } from "@angular/core/testing";
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

    it('should call get with the default URl', () => {
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

      it('should call log once', () => {

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with correct parameters', () => {

        expect(handleErrorSpy).toHaveBeenCalledWith('getHeroes', []);

      });

    });

  });

  describe('getHeroNo404', () => {

    let expectedUrl: string;

    beforeEach(() => expectedUrl = `${baseURL}/?id=${heroID}`);

    it('should call get with the correct URl', () => {

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

    it('should call get with the correct URl', () => {

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
        sut.getHero(1).subscribe();

        req = httpTestingController.expectOne(baseURL + '/' + heroID);
        data = [];

        req.flush(data);

      });

      it('should call log once', () => {

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with correct parameters', () => {

        expect(handleErrorSpy).toHaveBeenCalledWith('getHero id=' + heroID);

      });

    });

  });

  describe('searchHeroes', () => {

    it('should call get with the correct URl', () => {

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
        sut.getHero(1).subscribe();

        req = httpTestingController.expectOne(baseURL + '/' + heroID);
        data = [];

        req.flush(data);

      });

      it('should call log once', () => {

        expect(handleErrorSpy).toHaveBeenCalledTimes(1);

      });

      it('should call log with correct parameters', () => {

        expect(handleErrorSpy).toHaveBeenCalledWith('getHero id=' + heroID);

      });

    });

  });

});
