import { Component, Input, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-comments',
  template: `
    <div class="comments-section">
      <h3>Comentarios</h3>
      <div class="comment-form">
        <textarea [(ngModel)]="newComment" placeholder="Escribe un comentario..."></textarea>
        <button class="btn btn-primary" (click)="addComment()">Comentar</button>
      </div>
      <div class="comments-list">
        <div *ngFor="let comment of comments" class="comment">
          <div class="comment-header">
            <strong>{{ comment.usuario.nombre }} {{ comment.usuario.apellido }}</strong>
            <span class="date">{{ comment.created_at | date }}</span>
          </div>
          <p>{{ comment.texto }}</p>
          <div class="comment-actions">
            <button (click)="vote(comment.id, 'positivo')">👍 {{ comment.votos_positivos }}</button>
            <button (click)="vote(comment.id, 'negativo')">👎 {{ comment.votos_negativos }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comment-form {
      margin-bottom: 20px;
    }
    .comment-form textarea {
      width: 100%;
      min-height: 80px;
      margin-bottom: 10px;
    }
    .comment {
      padding: 15px;
      border-bottom: 1px solid #eee;
    }
    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .comment-actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
  `],
})
export class CommentsComponent implements OnInit {
  @Input() preguntaId!: number;
  comments: any[] = [];
  newComment = '';

  constructor(private commentsService: CommentsService) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentsService.getComments(this.preguntaId).subscribe((data: any) => {
      this.comments = data;
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.commentsService.createComment({
      pregunta_id: this.preguntaId,
      texto: this.newComment,
    }).subscribe(() => {
      this.newComment = '';
      this.loadComments();
    });
  }

  vote(commentId: number, tipo: string) {
    this.commentsService.voteComment({
      comentario_id: commentId,
      tipo,
    }).subscribe(() => {
      this.loadComments();
    });
  }
}

