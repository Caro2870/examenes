import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin/admin.component';
import { AdminService } from './services/admin.service';

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, AdminRoutingModule, FormsModule],
  providers: [AdminService],
})
export class AdminModule {}

