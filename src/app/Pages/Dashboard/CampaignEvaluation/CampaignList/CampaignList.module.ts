import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/shared/loader/Loader.module';
import { CampaignList } from './CampaignList';
import { ProgramsDetailsComponent } from '../programs-details/programs-details.component';
import { AddProgramsComponent } from '../programs-details/add-programs/add-programs.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { ReactiveFormsModule } from '@angular/forms'; 


 
const ChildRoutes: Routes = [
    {
        path: 'campaign-list',
        component:CampaignList
      },
      { path: 'program-details/:id', component: ProgramsDetailsComponent },
      { path: 'add-programs', component: AddProgramsComponent },
      
  ] 

@NgModule({
  declarations:[
    CampaignList,
    ProgramsDetailsComponent,
    AddProgramsComponent,
  
  ],
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    NgbPaginationModule,
    ReactiveFormsModule ,
    CommonModule,
    LoaderModule
  ],
 
})
export class CampaignListModule { }
