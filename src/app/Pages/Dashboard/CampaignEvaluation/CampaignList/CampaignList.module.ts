import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/shared/loader/Loader.module';
import { CampaignList } from './CampaignList';
import { ProgramsDetailsComponent } from '../programs-details/programs-details.component';
import { AddProgramsComponent } from '../programs-details/add-programs/add-programs.component';

import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule



 
const ChildRoutes: Routes = [
    {
        path: 'campaign-list',
        component:CampaignList
      },
      { path: 'program-details', component: ProgramsDetailsComponent },
      { path: 'add-programs', component: AddProgramsComponent },
  ] 

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    ReactiveFormsModule ,
    CommonModule,
    LoaderModule
  ],
  declarations:[
    CampaignList,
    ProgramsDetailsComponent,
    AddProgramsComponent
  ]
})
export class CampaignListModule { }
