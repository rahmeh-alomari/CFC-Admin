import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { KYCService } from 'src/app/shared/Services/kyc.service';
import { environment } from 'src/environments/environment';
import { PreviewLevelWorkflowComponent } from './preview-level-workflow/preview-level-workflow.component';
import { ApprovalLevelWorkflowComponent } from './approval-level-workflow/approval-level-workflow.component';


@Component({
  selector: 'app-our-requests',
  templateUrl: './our-requests.component.html',
  styleUrls: ['./our-requests.component.css']
})
export class OurRequestsComponent implements OnInit, OnChanges    {

  LANG = environment.english_translations;
  program: any[] = [];
  tableHeaders: string[] = [];
  isDisabled: boolean = false; // Enable/disable pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  paginatedRecords: any[] = [];
  programId: number;
  userPermissions: string[] = [];
  @Output() requestDataChange = new EventEmitter<any>();

  @Input() permissions: any;
 
  @Input() requestData: any;
  @Input() itemId: any;
  constructor(private route: ActivatedRoute, private kycService: KYCService, private toast: ToastrManager,private cdr: ChangeDetectorRef, private modalService: NgbModal, private router: Router) {


   }
 
    
  ngOnInit(): void {
    //   this.route.paramMap.subscribe(params => {
    //   this.programId = +params.get('id'); // Get the 'id' from the route parameter
    //   // this.fetchProgramData(this.programId); // Fetch program data and set pagination

    // });
    this.currentPage = 1; // Ensure current page starts at 1
 
    const storedPermissions = localStorage.getItem('userPermissions');
    
    if (storedPermissions) {
      try {
        this.userPermissions = JSON.parse(storedPermissions);
      } catch (error) {
        console.error('Failed to parse user permissions from localStorage:', error);
        this.userPermissions = []; // Fallback to an empty array if parsing fails
      }
    } else {
      console.warn('No user permissions found in localStorage.');
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.requestData) {
      console.log('Received new requestData:', changes.requestData);
      const newRequestData = changes.requestData.currentValue;

      // Check if newRequestData.response is an array
      if (newRequestData && Array.isArray(newRequestData.response)) {
        this.paginatedRecords = []; // Reset records for new data

        // Process each item in newRequestData.response
        for (const item of newRequestData.response) {
          let parsedRequest = {};
          if (this.isJSON(item.request)) {
            // Parse JSON if valid
            parsedRequest = JSON.parse(item.request);
          } else {
            console.warn('Invalid JSON format in request:', item.request);
          }

          // Extract and set default values if parsing failed
          const fromAccount = parsedRequest['fromAccount'] || '';
          const toAccount = parsedRequest['toAccount'] || '';
          const amount = parsedRequest['amount'] || 0;

          // Push formatted records
          this.paginatedRecords.push({
            id: item.id,
            userId: item.user_id,
            userName: item.user?.name || 'Unknown User', // Default if name is missing
            fromAccount,
            toAccount,
            amount,
            status: item.status,
            createdAt: item.created_at,
          });
        }
      } else {

        this.paginatedRecords = []; // Fallback for invalid structure
      }
    }
  }

  // Helper function to check if a string is valid JSON
  private isJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  
  
  
  // navigateToAddProgram(): void {
  //   this.router.navigate(['/dashboard/add-programs'], { queryParams: { id: this.programId } });
  // }
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.requestData.length / this.itemsPerPage);
    console.log("Total Pages:", this.totalPages);
  }
  // goBack(): void {
  //   this.location.back();  // Navigate back to the previous page
  // }
  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }

  // Update pagination details when the data or page changes
  updatePagination(): void {
    this.totalPages = Math.ceil(this.requestData.length / this.itemsPerPage); // Calculate total pages
    this.paginateRecords(); // Update paginated records
  }

  // Slice the program data to show only records for the current page
  paginateRecords(): void {
    // Check if this.requestData is an array before proceeding
    if (Array.isArray(this.requestData)) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.requestData.length);
        this.paginatedRecords = this.requestData.slice(startIndex, endIndex);
        console.log("this.paginatedRecords", this.paginatedRecords);
    } else {
        console.error('requestData is not an array:', this.requestData);
        this.paginatedRecords = []; // Reset to an empty array if not valid
    }
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
  // fetchProgramData(id): void {
  //   this.kycService.getPrograms().subscribe((response) => {
  //     this.program = response.data;  // Assuming the response has a 'data' property
  //     console.log("this.program",response);
  //     this.calculateTotalPages();
  //     this.paginateRecords();

  //   });
  // }
  // fetchProgramData(id): void {
  //   this.kycService.getProgramById(id).subscribe((response) => {
  //     this.program = response.data;  // Assuming the response has a 'data' property
  //     console.log("this.program", this.program);

  //     this.calculateTotalPages();
  //     this.paginateRecords();

  //   });
  // }
  // editProgram(id: number): void {
  //   console.log('Edit program with id:', id);

  //   const modalRef = this.modalService.open(UpdateDetailsComponent);
  //   modalRef.componentInstance.programId = this.programId;
  //   modalRef.componentInstance.id = id;

  //   modalRef.result.then(
  //     (result) => {
  //       console.log(result);

  //       if (result && result.message === 'Data update successfully') {
  //         console.log('Program updated successfully, fetching updated data');
  //         this.fetchProgramData(this.programId);
  //         this.updatePagination();
  //       }
  //     },
  //     (reason) => {
  //       console.log('Modal dismissed with reason:', reason);
  //       this.fetchProgramData(this.programId);
  //     }
  //   );
  // }

  Acceptance(id: number): void {
    console.log('Full requestData:', id); // Log the selected item ID
    const modalRef = this.modalService.open(PreviewLevelWorkflowComponent);
  
    // Ensure requestData exists and check its content
    if (this.requestData && this.requestData.response) {
      const specificRequestData = this.requestData.response.find(item => item.id === id);
      console.log('Specific Request Data:', specificRequestData); // Log the specific data being passed
  
      // Pass the specific requestData to the modal component
      modalRef.componentInstance.requestData = specificRequestData; // Pass only specific data
      modalRef.componentInstance.acceptedId = id; // Pass the accepted ID
  
      // Handle both result and dismissal cases
      modalRef.result.then((result) => {
        if (result) {
          const itemIndex = this.requestData.response.findIndex(item => item.id === id);
          if (itemIndex > -1) {
            // Update the item and create a new response array
            const updatedResponse = this.requestData.response.map((item, index) => {
              if (index === itemIndex) {
                return { ...item, status: result.status }; // Update status
              }
              return item; // Return unchanged item
            });
  
            // Create a new reference for requestData
            this.requestData = { ...this.requestData, response: updatedResponse };
            
            this.requestDataChange.emit(this.requestData); // Emit updated requestData
            console.log('Newly saved data:', this.requestData);
          }
        }
      }).catch((reason) => {
        // Log dismissal reason for debugging, e.g., 'cancel'
        console.log('Modal dismissed with reason:', reason);
      });
    }
  }
  
 

  approvallevel(id: number): void {
    console.log('Full requestData:', id); // Log the selected item ID
    const modalRef = this.modalService.open(ApprovalLevelWorkflowComponent);
  
    // Ensure requestData exists and check its content
    if (this.requestData && this.requestData.response) {
      const specificRequestData = this.requestData.response.find(item => item.id === id);
      console.log('Specific Request Data:', specificRequestData); // Log the specific data being passed
  
      // Pass the specific requestData to the modal component
      modalRef.componentInstance.requestData = specificRequestData; // Pass only specific data
      modalRef.componentInstance.acceptedId = id; // Pass the accepted ID
  
      // Handle both result and dismissal cases
      modalRef.result.then((result) => {
        if (result) {
          const itemIndex = this.requestData.response.findIndex(item => item.id === id);
          if (itemIndex > -1) {
            // Update the item and create a new response array
            const updatedResponse = this.requestData.response.map((item, index) => {
              if (index === itemIndex) {
                return { ...item, status: result.status }; // Update status
              }
              return item; // Return unchanged item
            });
  
            // Create a new reference for requestData
            this.requestData = { ...this.requestData, response: updatedResponse };
            
            this.requestDataChange.emit(this.requestData); // Emit updated requestData
            console.log('Newly saved data:', this.requestData);
          }
        }
      }).catch((reason) => {
        // Log dismissal reason for debugging, e.g., 'cancel'
        console.log('Modal dismissed with reason:', reason);
      });
    }
  }
  
}  
