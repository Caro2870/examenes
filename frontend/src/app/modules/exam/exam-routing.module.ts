import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamStartComponent } from './components/exam-start/exam-start.component';
import { ExamComponent } from './components/exam/exam.component';
import { ExamResultsComponent } from './components/exam-results/exam-results.component';

const routes: Routes = [
  { path: 'start', component: ExamStartComponent },
  { path: ':id', component: ExamComponent },
  { path: 'results/:id', component: ExamResultsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamRoutingModule {}

