import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { KYCService } from "src/app/shared/Services/kyc.service";

@Component({
  selector: "app-transfer-B2B",
  templateUrl: "./transferB2B.component.html",
  styleUrls: ["./transferB2B.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferB2BComponent implements OnInit {
  showForm = false; // Initial state to hide the form
  showtable = true;
  itemId: number;
  permissions: string[] = [];
  showApprovalSection: boolean = false;
  errorMessage: string; // To handle any errors
  userId: number; // User ID from local storage
  requestNumber: number; // Unique request number
  approvalLevelId: string;
  requestData: any; // Initialize requestData
  isInInitiatedSection: boolean = false; // Flag to track if in initiated section
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  paginatedRecords: any[] = [];
  private workflowDataSubscription: Subscription;
  constructor(private route: ActivatedRoute, private kycService: KYCService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Get the userId from localStorage
    const storedUserId = localStorage.getItem('user-id');
    this.requestNumber = Date.now(); // Generates a unique number based on the current timestamp

    if (storedUserId) {
      this.userId = +storedUserId; // Convert to number using '+'
    } else {
      console.error('User ID not found in localStorage');
      return;
    }

    // Subscribe to the route parameters to get the itemId
    this.route.params.subscribe(params => {
      this.itemId = +params['id'];
      console.log('Navigated to TransferB2BComponent with id:', this.itemId);
      this.getPermissionsAndWorkflowData(); // Fetch permissions and workflow data
    });
    this.workflowDataSubscription = this.kycService.workflowDataUpdated$.subscribe(() => {
      this.getWorkflowInstanceData(); // Refresh data on update
    });

  
   
  }

handleRequestDataChange(newData: any) {
  
    this.requestData=newData
    console.log('Updated requestData:', newData);
 
}
  // Method to fetch permissions and workflow instance data
  getPermissionsAndWorkflowData() {
    this.route.data.subscribe(data => {
      this.permissions = data['permissions'] || []; // Resolved data for permissions, default to empty array if undefined

      // Check if 'initiated' exists in the permissions array
      this.showApprovalSection = this.permissions.includes('initiated');
      this.isInInitiatedSection = this.checkIfInInitiatedSection(); // Update the section state

      // Automatically show form or table based on the section
      this.showForm = this.isInInitiatedSection; // Show form if in initiated section
      this.showtable = !this.isInInitiatedSection; // Show table otherwise

      // Fetch workflow data
      this.getWorkflowInstanceData();
    });
  }

  checkIfInInitiatedSection(): boolean {
    // Check if the user has initiated permissions
    return this.permissions.includes('initiated');
  }

  // Method to fetch workflow instance data based on permissions
  getWorkflowInstanceData(): void {
    if (!this.permissions || !Array.isArray(this.permissions)) {
      console.error('Permissions are undefined or not an array');
      return;
    }

    // Determine approval level based on permissions
    if (this.permissions.includes('Approval')) {
      this.approvalLevelId = "preview";
    } else if (this.permissions.includes('preview') || this.permissions.includes('initiated')) {
      this.approvalLevelId = "initiated";
    } else {
      this.approvalLevelId = "fixed";
      console.error('No matching permission found for approval level.');
    }

    // Call the KYC service with the itemId, userId, requestNumber, and approvalLevelId
    this.kycService.getWorkflowInstance(this.itemId, this.userId, this.requestNumber, this.approvalLevelId).subscribe(
      (data) => {
        console.log('Workflow data:', data);
        this.requestData = data; // Update requestData with the fetched workflow data
        console.log("this.requestDatathis.requestData",this.requestData)
        this.cdr.detectChanges(); // Trigger change detection to update the UI
      },
      (error) => {
        console.error('Error fetching workflow data:', error);
      }
    );
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.requestData.length / this.itemsPerPage); // Calculate total pages
    this.paginateRecords(); // Update paginated records
  }

  // Slice the program data to show only records for the current page
  paginateRecords(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.requestData.length); // Prevent exceeding array length
    this.paginatedRecords = this.requestData.slice(startIndex, endIndex);
    console.log("this.paginatedRecords", this.paginatedRecords);
  }

  // Navigate to the previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateRecords();
    }
  }

  // Navigate to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateRecords();
    }
  }
}
