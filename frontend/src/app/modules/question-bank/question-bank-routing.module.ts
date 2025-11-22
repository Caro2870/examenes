import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionBankComponent } from './components/question-bank/question-bank.component';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';

const routes: Routes = [
  { path: '', component: QuestionBankComponent },
  { path: ':id', component: QuestionDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionBankRoutingModule {}

