import { Article } from './article.model';
import { DemandeAchat } from './demande-achat.model';
export class LigneDemandeAchat {
  id!: number;
  pu!: number;
  pt!: number;
  quantite!: number;
  date!: Date;
  reference!: string;
  demandeachat!: DemandeAchat;
  article!: Article;
}
