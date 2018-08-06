import {
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
    TestBed,
    ComponentFixture,
} from "@angular/core/testing";
import { of } from "rxjs/observable/of";
import { By } from "@angular/platform-browser";
import { HeroesComponent } from '../heroes.component';
import { HeroService } from '../../hero.service';
import { Hero } from '../../hero';



describe('HeroesComponent ( shallow )', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let sut: HeroesComponent;
    let mockHeroService;
    let heroes: Array<Hero>;

    beforeEach(() => {
        heroes = [
            { id: 0, name: 'hero0', strength: 8 },
            { id: 1, name: 'hero1', strength: 18 },
            { id: 2, name: 'hero2', strength: 80 },
        ];

        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        TestBed.configureTestingModule({
            declarations: [HeroesComponent],
            providers: [
                { provide: HeroService, useValue: mockHeroService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });


        fixture = TestBed.createComponent(HeroesComponent);
        sut = fixture.componentInstance;

        mockHeroService.getHeroes.and.returnValue(of(heroes));
        fixture.detectChanges();

    });

    it('should diplay the name correctly', () => {

        const actualHeroesListLength: number = sut.heroes.length;

        expect(actualHeroesListLength).toEqual(3);
    });

    it('should have one li for each hero', () => {

        const actualHeroesListLength: number = fixture.debugElement.queryAll(By.css('li')).length;

        expect(actualHeroesListLength).toBe(3);
    });

});
