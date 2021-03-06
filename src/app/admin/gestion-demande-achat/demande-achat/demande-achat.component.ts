import { ArticleService } from './../../../service/article.service';
import { LigneDemandeAchat } from './../../../Model/ligne-demande-achat.model';
import { DemandeAchat } from './../../../Model/demande-achat.model';
import { LoginService } from './../../../service/LoginService';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DemandeAchatService } from './../../../service/demande-achat.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Article } from 'src/app/Model/article.model';

@Component({
  selector: 'app-demande-achat',
  templateUrl: './demande-achat.component.html',
  styleUrls: ['./demande-achat.component.scss']
})
export class DemandeAchatComponent implements OnInit {

  public isLoading: boolean = false;
  public modalRef!: BsModalRef;
  public modalRefDevisFournisseur!: BsModalRef;
  public formAddDemandeAchat!: DemandeAchat;
  public demandeAchat: DemandeAchat = new DemandeAchat();
  public articleName: string = "";
  public typeOpenDevisModal: 'SHOW' | 'ADD' = 'SHOW';

  constructor(
    public demandeAchatService: DemandeAchatService,
    public articleService: ArticleService,
    public loginService: LoginService,
    private modalSerivce: BsModalService
  ) { }

  ngOnInit(): void {
    this.getAllDemandeAchat();
    this.getAllArticle();
    this.initForm();
  }

  public initForm() {
    this.formAddDemandeAchat = new DemandeAchat();
    this.formAddDemandeAchat.lignedemandeachats = [new LigneDemandeAchat()];
    this.formAddDemandeAchat.lignedemandeachats[0].article = new Article();
  }

  public getAllDemandeAchat() {
    this.demandeAchatService.getAll().subscribe(
      data => {
        this.demandeAchatService.demandeAchats = data;
      }, error => {
        console.log(error);
        this.loginService.toastr.error('Erreur de chargement des demande d\'achat');
      }
    )
  }

  public getAllArticle() {
    this.articleService.getAll().subscribe(
      data => {
        this.articleService.articles = data;
      }, error => {
        console.log(error);
        this.loginService.toastr.error('Erreur de chargement des articles');
      }
    );
  }

  public openModal(template: TemplateRef<any>, demandeAchat?: DemandeAchat) {
    if (demandeAchat) {
      this.demandeAchat = demandeAchat;
    } else {
      this.initForm();
    }
    this.modalRef = this.modalSerivce.show(template,{class:"modal-lg"});
  }
  public openModalDevisFournisseur(template: TemplateRef<any>, demandeAchat?: DemandeAchat, typeOpen: 'SHOW' | 'ADD' = 'SHOW') {
    if (demandeAchat) {
      this.demandeAchat = demandeAchat;
    }
    this.typeOpenDevisModal = typeOpen;
    this.modalRefDevisFournisseur = this.modalSerivce.show(template,{class:"modal-lg"});
  }

  onAddLigneDemandeAchat() {
    let ligneDemandeAchat = new LigneDemandeAchat();
    ligneDemandeAchat.article = new Article();
    this.formAddDemandeAchat.lignedemandeachats.push(ligneDemandeAchat);
  }

  onRemoveLigneDemandeAchat(index: number) {
    this.formAddDemandeAchat.lignedemandeachats.splice(index, 1);
  }

  public onSaveDemandeAchat() {
    this.isLoading = true;
    if (!this.formAddDemandeAchat) {
      this.isLoading = false;
      this.loginService.toastr.error('Veuillez remplir tous les champs');
      return;
    }
    this.formAddDemandeAchat.lignedemandeachats.forEach(element => {
      let article = this.articleService.articles.find(x => x.denomination == element.article.denomination);
      element.article = article? article : element.article;
      element.pt = element.pu * element.quantite;
    });
    this.formAddDemandeAchat.matriculeAcheteurmetier = this.loginService.utilisateur.matricule;
    this.demandeAchatService.saveWithLigne(this.formAddDemandeAchat).subscribe(
      data => {
        this.isLoading = false;
        this.demandeAchatService.demandeAchats.push(data);
        this.modalRef.hide();
        this.loginService.toastr.success('Demande d\'achat ajout??e avec succ??s');
      }, error => {
        console.log(error);
        this.loginService.toastr.error('Erreur d\'ajout de la demande d\'achat');
      }
    )
  }

  public onUpdate() {
    console.log("update demande d'achat coming soon ...");
  }

  onValideDemandeAchat(demandeAchat: DemandeAchat) {
    this.isLoading = true;
    this.demandeAchatService.valider('VALIDE', demandeAchat.reference).subscribe(
      data => {
        this.isLoading = false;
        if (data) {
          this.loginService.toastr.success('Demande d\'achat valid??e avec succ??s');
        } else {
          this.loginService.toastr.error('Erreur de validation de la demande d\'achat');
        }
        demandeAchat.statut = data?'VALIDE':demandeAchat.statut;
      },
      error => {
        console.log(error);
        this.loginService.toastr.error('Erreur de validation de la demande d\'achat');
        this.isLoading = false;
      }
    )
  }

  calculPrix() {
    let total = 0;
    this.formAddDemandeAchat.lignedemandeachats.forEach(element => {
      element.pt = element.pu * element.quantite;
      total += element.pt;
    });

    if (total != NaN) {
      this.formAddDemandeAchat.prixestimatif = total;
    }

  }

}
