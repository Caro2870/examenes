import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamRoutingModule } from './exam-routing.module';
import { ExamStartComponent } from './components/exam-start/exam-start.component';
import { ExamComponent } from './components/exam/exam.component';
import { ExamResultsComponent } from './components/exam-results/exam-results.component';
import { ExamService } from './services/exam.service';

@NgModule({
  declarations: [ExamStartComponent, ExamComponent, ExamResultsComponent],
  imports: [CommonModule, ExamRoutingModule, FormsModule],
  providers: [ExamService],
})
export class ExamModule {}

