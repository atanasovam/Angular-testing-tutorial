import {
    DebugElement,
    Directive,
    Input,
} from '@angular/core';
import {
    TestBed,
    ComponentFixture,
    fakeAsync,
    tick,
} from "@angular/core/testing";
import { of } from "rxjs/observable/of";
import { By } from "@angular/platform-browser";

import { HeroesComponent } from '../heroes.component';
import { HeroComponent } from '../../hero/hero.component';

import { Hero } from '../../hero';
import { HeroService } from '../../hero.service';

@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' },
})
export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    public onClick(): void {
        this.navigatedTo = this.linkParams;
    }
}

describe('HeroesComponent ( deep )', () => {

    let fixture: ComponentFixture<HeroesComponent>;
    let sut: HeroesComponent;
    let heroes: Array<Hero>;
    let heroServiceMock;

    beforeEach(() => {
        heroes = [
            { id: 0, name: 'hero0', strength: 8 },
            { id: 1, name: 'hero1', strength: 18 },
            { id: 2, name: 'hero2', strength: 80 },
        ];

        heroServiceMock = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent,
                RouterLinkDirectiveStub,
            ],
            providers: [
                { provide: HeroService, useValue: heroServiceMock },
            ],
        });

        fixture = TestBed.createComponent(HeroesComponent);
        sut = fixture.componentInstance;

        heroServiceMock.getHeroes.and.returnValue(of(heroes));
        fixture.detectChanges();

    });

    it('should have one child HeroComponent for each element of the hero array', () => {

        const actualHeroesComponentLength: number = fixture.debugElement.queryAll(By.directive(HeroComponent)).length;

        expect(actualHeroesComponentLength).toEqual(heroes.length);

    });

    it('each child HeroComponent should have a hero property equal to the respective hero object element of the parent component', () => {

        const actualHeroesComponentDEList: DebugElement[] = fixture.debugElement.queryAll(By.directive(HeroComponent));

        actualHeroesComponentDEList.forEach((heroComponentElement, index) => {

            const actualHero: Hero = heroComponentElement.componentInstance.hero;
            const expectedHero: Hero = heroes[index];

            expect(actualHero).toEqual(expectedHero);

        });

    });

    it('should call HeroesComponent.delete once when the Hero Component`s delete button is clicked', () => {

        spyOn(sut, 'delete');

        const firstHeroDE: DebugElement = fixture.debugElement.queryAll(By.directive(HeroComponent))[0];
        const deleteBtn = firstHeroDE.query(By.css('button'));

        deleteBtn.triggerEventHandler('click', { stopPropagation: () => { } });

        expect(sut.delete).toHaveBeenCalledTimes(1);

    });

    it('should call heroService.deleteHero with the correct parameters when the Hero Component`s delete button is clicked', () => {

        spyOn(sut, 'delete');

        const firstHeroDE: DebugElement = fixture.debugElement.queryAll(By.directive(HeroComponent))[0];
        const deleteBtn = firstHeroDE.query(By.css('button'));

        deleteBtn.triggerEventHandler('click', { stopPropagation: () => { } });

        expect(sut.delete).toHaveBeenCalledWith(heroes[0]);

    });

    it('should call heroService.deleteHero with the correct parameters when the Hero Component`s delete button is clicked #2', () => {

        spyOn(sut, 'delete');

        const firstHeroComponentInstance: HeroComponent = fixture.debugElement.queryAll(By.directive(HeroComponent))[0].componentInstance;

        firstHeroComponentInstance.delete.emit(null);

        expect(sut.delete).toHaveBeenCalledWith(heroes[0])

    });

    it('should add new hero to the hero ul list when the add button is clicked', () => {

        const newHero: { id: number, name: string, strength: number } = {
            id: 5,
            name: 'Mr.',
            strength: 56,
        };

        heroServiceMock.addHero.and.returnValue(of(newHero));

        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addBtn = fixture.debugElement.query(By.css('button'));

        inputElement.value = newHero.name;
        addBtn.triggerEventHandler('click', null);

        fixture.detectChanges();

        const heroesText1 = fixture.nativeElement.querySelector('ul').innerText;
        const heroesText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;

        expect(heroesText1).toContain(newHero.name);
        expect(heroesText).toContain(newHero.name);

    });

    it('should have the correct route for the first hero', fakeAsync(() => {

        const firstHeroDE = fixture.debugElement.queryAll(By.directive(HeroComponent))[0];

        const routerLink = firstHeroDE.query(By.directive(RouterLinkDirectiveStub))
            .injector.get(RouterLinkDirectiveStub);

        const btn = firstHeroDE.query(By.css('a'));
        btn.triggerEventHandler('click', null);

        expect(routerLink.navigatedTo).toBe('/detail/0');

    }));

});
