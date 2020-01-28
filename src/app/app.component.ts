import { Component, Input } from '@angular/core';
import { Operation } from './model/operation';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http' // etape 1
import { Categorie } from './model/Categorie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'finance';
  tabCategorie: Categorie[];
  tab: Operation[] = [];
  tabMois: Operation[] = [];
  mois: number;
  nomCategorie: string;
  budget: number;
  url = 'https://projet-c0034.firebaseio.com/operations.json';
  urlCat = 'https://projet-c0034.firebaseio.com/categories.json';
  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {// chargement des données à l'ouverture
    const today = new Date();
    this.mois = today.getMonth() + 1;
    this.loadBdd();
    this.loadCatBdd();
    this.onFiltrerMois();
  }

  onAjouter(form: NgForm) {
    let description = form.value['description'];
    let date = form.value['date'];
    let categorie = form.value['categorie'];
    let debit = form.value['debit'];
    let credit = form.value['credit'];

    let o: Operation = new Operation(description, date, categorie, debit, credit);
    form.reset();// je vide les champs
    this.tab.push(o);
    this.saveBdd();
    this.onFiltrerMois();
  }

  onDelete(i: number): void {
    this.tab.splice(i, 1);
    this.onFiltrerMois();

  }

  loadBdd() {

    this.httpClient.get<Operation[]>(this.url)
      .subscribe(
        (response) => {

          if (response != undefined) {
            this.tab = response;
          }

        }, (error) => {
          console.log('error');
        }
      );
  }

  saveBdd() {
    this.httpClient.put(this.url, this.tab)
      .subscribe(
        () => {
          console.log('SAVE OK !');
        }, (error) => {
          console.log('error');
        }
      );
  }

  onFiltrerMois() {
    this.tabMois.splice(0, this.tabMois.length)

    if (this.mois == 13) {
      for (let o of this.tab) {
        this.tabMois.push(o);
      }
    } else {
      for (let o of this.tab) {
        let dateOperation = new Date(o.date);
        let moisOperation = dateOperation.getMonth() + 1;
        if (moisOperation == this.mois) {
          this.tabMois.push(o);
        }

      }

    }
  }

  onAjouterCategorie() {
    let nomCategorie = this.nomCategorie;
    let budget = this.budget;
    let c: Categorie = new Categorie(nomCategorie, budget);
    console.log(c);

    this.tabCategorie.push(c);
    this.saveCatBdd();
    this.nomCategorie = '';
    this.budget = undefined;

  }



  saveCatBdd() {
    this.httpClient.put(this.urlCat, this.tabCategorie)
      .subscribe(
        () => {
          console.log('SAVE OK !');
        }, (error) => {
          console.log('error');
        }
      );
  }

  loadCatBdd() {

    this.httpClient.get<Categorie[]>(this.urlCat)
      .subscribe(
        (response) => {

          if (response != undefined) {
            this.tabCategorie = response;
          }

        }, (error) => {
          console.log('error');
        }
      );
  }

  onDeleteCat(i: number): void {
    this.tabCategorie.splice(i, 1);

  }
  depenseParCategorie(categorie: string): number {
    let depenseReelle: number = 0;
    for (let c of this.tabCategorie) {
      if (categorie == c.nomCategorie) {

        for (let o of this.tabMois) {
          if (categorie == o.categorie) {
            depenseReelle += o.debit;
          }
        }

      }

    }
    return depenseReelle;
  }


}
