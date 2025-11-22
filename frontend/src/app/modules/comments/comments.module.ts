import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentsService } from './services/comments.service';

@NgModule({
  declarations: [CommentsComponent],
  imports: [CommonModule, FormsModule],
  exports: [CommentsComponent],
  providers: [CommentsService],
})
export class CommentsModule {}

