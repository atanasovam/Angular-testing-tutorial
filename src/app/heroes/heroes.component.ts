import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  public heroes: Hero[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe((heroes) => this.heroes = heroes);
  }

  add(name: string): void {
    if (!name) {
      return;
    }

    const hero = <Hero>{
      name: name.trim(),
      strength: 11,
    };

    this.heroService.addHero(hero)
      .subscribe((hero) => this.heroes.push(hero));
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter((h: Hero) => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}

// describe("delete")

// Test Cases for Delete
// 0. shouldn`t modify the heroes list, when the provided hero doesn`t exist
// 1. should remove the provided hero from the heroes list
// 2. heroService.deleteHero should be called once
// 3. heroService.deleteHero should be called with the provided hero object.
// 4. heroService.deleteHero.subscribe should be called once