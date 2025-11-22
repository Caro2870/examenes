import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, LoadingComponent],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, FooterComponent, LoadingComponent, RouterModule],
})
export class SharedModule {}

