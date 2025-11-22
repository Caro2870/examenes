import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionBankRoutingModule } from './question-bank-routing.module';
import { QuestionBankComponent } from './components/question-bank/question-bank.component';
import { QuestionDetailComponent } from './components/question-detail/question-detail.component';
import { QuestionsService } from './services/questions.service';
import { CommentsModule } from '../comments/comments.module';

@NgModule({
  declarations: [QuestionBankComponent, QuestionDetailComponent],
  imports: [CommonModule, QuestionBankRoutingModule, CommentsModule],
  providers: [QuestionsService],
})
export class QuestionBankModule {}

