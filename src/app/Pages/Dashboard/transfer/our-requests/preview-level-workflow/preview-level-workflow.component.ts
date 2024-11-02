import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { KYCService } from 'src/app/shared/Services/kyc.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preview-level-workflow',
  templateUrl: './preview-level-workflow.component.html',
  styleUrls: ['./preview-level-workflow.component.css']
})
export class PreviewLevelWorkflowComponent implements OnInit {
  @Input() requestData: any;       // Input property to receive the data
  @Input() acceptedId: number;     // Input for the accepted ID

  fromAccount: string = '';
  toAccount: string = '';
  amount: number | null = null;    // Assuming amount is a number
  requestNumber: any;
  userId: any;
  LANG=environment.english_translations;

  constructor(public activeModal: NgbActiveModal, private kycService: KYCService, private toast: ToastrManager) {}

  ngOnInit(): void {
    // Check and parse requestData on init
    if (this.requestData && this.requestData.request) {
      const parsedRequest = JSON.parse(this.requestData.request);
      this.fromAccount = parsedRequest.fromAccount;
      this.toAccount = parsedRequest.toAccount;
      this.amount = parsedRequest.amount;

      // Extract additional details from requestData
      this.userId = this.requestData.user_id;
      this.requestNumber = this.generateRequestNumber();
      this.checkStatus();
    } else {
   
    }
  }

  // Generate a unique request number based on current timestamp
  generateRequestNumber(): string {
    const date = new Date();
    const uniqueId = date.getTime(); // Get the current timestamp
    return `REQ-${uniqueId}`; // Format as "REQ-<timestamp>"
  }

  // Check the status and log the result
  checkStatus() {
    if (this.requestData && this.requestData.status) {
      console.log('Current status:', this.requestData.status);
    } else {
      console.log('No status found or status is undefined');
    }
  }

  // Handle Accept and Reject actions
  handleAcceptance(status: string) {
    // Prevent action if current status is not "Pending"
    if (this.requestData?.status !== 'Pending') {
      console.log('Action not allowed. Current status:', this.requestData.status);
      return;
    }

    const workflowStatus = status === 'accept' ? 1 : 0;
    const requestData = {
      fromAccount: this.fromAccount,
      toAccount: this.toAccount,
      amount: this.amount
    };

    // Add workflow instance with updated status
    this.kycService.addWorkflowInstance(
      this.requestData.work_flow_id,
      this.userId,
      this.requestNumber,
      "preview",
      workflowStatus,
      requestData
    ).subscribe(
      (response) => {
        console.log('Workflow instance added successfully:', response);

        // Close modal and pass updated status
        this.activeModal.close({ 
          status: workflowStatus, 
          response: response
        });

        this.toast.successToastr(this.LANG.updated_successfully);

      },
      (error) => {
        console.error('Error adding workflow instance:', error);
        this.toast.errorToastr(this.LANG.Something_went_wrong_Please_try_again_later);

      }
    );
  }

  // Close modal on confirmation
dismiss() {
  try {
    this.activeModal.dismiss('cancel');
  } catch (error) {
    console.error('Modal dismissal failed:', error);
  }
}

confirm() {
  try {
    this.activeModal.close('confirm');
  } catch (error) {
    console.error('Modal confirmation failed:', error);
  }
}
}
