import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/shared/loader/Loader.module';
import { TransferB2BComponent } from './transfer-BtoB/transferB2B.component';
import { TransferB2CComponent } from './transfer-BtoC/transferB2C.component';




 
const ChildRoutes: Routes = [
   
      {
        path: 'BetweenOurAccounts',
        component:TransferB2BComponent
      },
      {
        path: 'BetweenTwoAccounts',
        component:TransferB2CComponent
      },
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    CommonModule,
    LoaderModule
  ],
  declarations:[
    TransferB2BComponent,
    TransferB2CComponent
  ]
})
export class TransferModule { } 
