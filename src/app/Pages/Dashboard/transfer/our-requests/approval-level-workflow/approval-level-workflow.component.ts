import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { KYCService } from 'src/app/shared/Services/kyc.service';
import { UsersService } from 'src/app/shared/Services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-approval-level-workflow',
  templateUrl: './approval-level-workflow.component.html',
  styleUrls: ['./approval-level-workflow.component.css']
})
export class ApprovalLevelWorkflowComponent implements OnInit {

  @Input() requestData: any; // Define an input property to receive the data
  @Input() acceptedId: number; // For the accepted ID
  fromAccount: string = "";
  toAccount: any = null;
  loading: boolean = false;
  error: string = "";
  info: any = null;
  fromAccounts: any = ["0108095517580016", "0190095517580017", "0108095517580018"];
  toAccounts: any = ["0108095517580016", "0190095517580017", "0108095517580018"];
  amount: any = 0;
  userList: any[] = [];
  pickedAccountData: any;
  @Input()itemId:any;
  @Input()approvalLevelId:any;
  pickedBank:any;
  userId: number;
  requestNumber: any;

 
  LANG=environment.english_translations;
  constructor(public activeModal: NgbActiveModal,private kycService: KYCService,private usersService: UsersService, private toast: ToastrManager) {}
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



transferBalance() {
  this.loading = true;
  this.error = "";
  this.info = null;
  this.usersService
    .transferBetweenTwoAccounts(this.amount,this.pickedAccountData.creditAccount,this.fromAccount,this.pickedAccountData.bic ,this.pickedAccountData.user_id)
    .subscribe(
      (data:any) => {
        this.loading = false;
        if(data.status){
          console.log("data.statusdata.status",data.status)
          this.info = data.response;
        }
        this.toast.successToastr(this.LANG.updated_successfully);
      },
      (error) => {
        this.loading = false;
        this.error = "An error occurred while fetching data.";
        this.toast.errorToastr(this.LANG.Something_went_wrong_Please_try_again_later);
      }
    );
}



handleAcceptance(status: string) {

  // Set the status based on acceptance/rejection
  const workflowStatus = status === 'accept' ? 1 : 0; // 1 for accept, 0 for reject
  const requestData = {
    fromAccount: this.fromAccount,
    toAccount: this.toAccount,
    amount: this.amount
  };
  console.log('Workflow instance added successfully:',requestData,workflowStatus,this.requestNumber);

  this.kycService.addWorkflowInstance(
    this.requestData.work_flow_id, // Use the acceptedId passed to the modal
    this.userId, // Ensure you have this populated (set in ngOnInit or passed as input)
    this.requestNumber, // Ensure this is populated from the requestData
    "preview", // approval_level_id
    workflowStatus, // Set the correct status
    requestData // The object containing fromAccount, toAccount, and amount
  ).subscribe(
    (response) => {
      console.log('Workflow instance added successfully:', response);
      this.activeModal.close({ 
     
        status: workflowStatus 
    }); 
    this.toast.successToastr(this.LANG.updated_successfully);
      // Update requestData with the new response item
      // const currentData = this.kycService.getRequestDataValue(); // Get the latest data
      // const updatedData = [...currentData, response]; // Add the new item to the array
      // this.kycService.updateRequestData(updatedData); // Emit updated data through the service

      // Optionally dismiss the modal
      this.confirm(); // Close the modal on success
    },
    (error) => {
      console.error('Error adding workflow instance:', error);
      this.toast.errorToastr(this.LANG.Something_went_wrong_Please_try_again_later);
    }
  );
}
 confirm() {
    this.activeModal.close('confirm');
  }

  dismiss() {
    this.activeModal.dismiss('cancel');
  }
}