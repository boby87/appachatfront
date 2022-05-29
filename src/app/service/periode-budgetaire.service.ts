import { Adresse } from './Adresse';
import { PeriodeBudgetaire } from './../Model/periode-budgetaire.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LoginService} from "./LoginService";

@Injectable({
  providedIn: 'root'
})
export class PeriodeBudgetaireService {

  public periodeBudgetaires: PeriodeBudgetaire[] = [];

  constructor(private httpClient: HttpClient,public loginService:LoginService) { }

  /**
   * Cette fonction permet de récupérer toutes les périodes budgétaires
   * @returns PeriodeBudgetaire[]
   */
  getAllPeriodeBudgetaires() {
    return this.httpClient.get<PeriodeBudgetaire[]>(Adresse.host + 'budget/all');
  }

  /**
   * Cette fonction permet de créer une période budgétaire
   * @param periodeBudgetaire PeriodeBudgetaire
   * @returns PeriodeBudgetaire
   */
  savePeriodeBudgetaire(periodeBudgetaire: PeriodeBudgetaire) {
    periodeBudgetaire.date=new Date();
    return this.httpClient.post<PeriodeBudgetaire>(Adresse.host + 'budget/save/'+this.loginService.utilisateur.reference, periodeBudgetaire);
  }
}
