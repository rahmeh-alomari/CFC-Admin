import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/shared/loader/Loader.module';
import { TransferB2BComponent } from './transfer-BtoB/transferB2B.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { OurRequestsComponent } from './our-requests/our-requests.component';

import { WorksflowComponent } from './worksflow/worksflow.component';
import { AddWorkflowComponent } from './worksflow/add-workflow/add-workflow.component';
import { BrowserModule } from '@angular/platform-browser';
import { ApprovallevelComponent } from './approvallevel/approvallevel.component';
import { AddapprovallevelComponent } from './approvallevel/addapprovallevel/addapprovallevel.component';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RequestFormb2cComponent } from './request-formb2c/request-formb2c.component';
import { WorkflowResolverService } from 'src/app/shared/Services/workflow-resolver.service';
import { TransferBtoCComponent } from './transfer-bto-c/transfer-bto-c.component';
import { PreviewLevelWorkflowComponent } from './our-requests/preview-level-workflow/preview-level-workflow.component';
import { ApprovalLevelWorkflowComponent } from './our-requests/approval-level-workflow/approval-level-workflow.component';



 
const ChildRoutes: Routes = [
  { path: 'transfer-b2b/:id', component: TransferB2BComponent, resolve: { permissions: WorkflowResolverService } ,  },
  
      {
        path: 'Works-flow',
        component:WorksflowComponent,
       
      },
      {
        path: 'AddWorkflowComponent',
        component:AddWorkflowComponent
      },
      {
        path: 'Approva-llevel',
        component:ApprovallevelComponent
      },
  ]

@NgModule({
  imports: [
  
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    CommonModule,
    LoaderModule,
    NgbTooltipModule,
  
    ReactiveFormsModule,
  
  ],
  declarations:[
    TransferB2BComponent,
 
    RequestFormComponent,
    OurRequestsComponent,
   
    WorksflowComponent,
    AddWorkflowComponent,
    ApprovallevelComponent,
    AddapprovallevelComponent,
    RequestFormb2cComponent,
    TransferBtoCComponent,
    PreviewLevelWorkflowComponent,
    ApprovalLevelWorkflowComponent
  ]
})
export class TransferModule { } 
