import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KYCService } from 'src/app/shared/Services/kyc.service';
import { environment } from 'src/environments/environment';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal/confirm-delete-modal.component';
import { UpdateDetailsComponent } from './update-details/update-details.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Location } from '@angular/common';  // Import Location service

@Component({
  selector: 'app-programs-details',
  templateUrl: './programs-details.component.html',
  styleUrls: ['./programs-details.component.css']
})
export class ProgramsDetailsComponent implements OnInit {
  LANG = environment.english_translations;
  program: any[] = []; 
  tableHeaders: string[] = [];
  isDisabled: boolean = false; // Enable/disable pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 10;
  paginatedRecords: any[] = [];
  programId: number;

  constructor(private route: ActivatedRoute, private location: Location,private kycService: KYCService,private toast:ToastrManager, private modalService: NgbModal, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.programId = +params.get('id'); // Get the 'id' from the route parameter
      console.log('Program ID:', this.programId);
      console.log("this.paginatedRecordsthis.programIdthis.programId", this.programId);
      this.fetchProgramData( this.programId); // Fetch program data and set pagination

    });
    this.currentPage = 1; // Ensure current page starts at 1
  
  }
  goBack(): void {
    this.location.back();  // Navigate back to the previous page
  }
  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }

  // Update pagination details when the data or page changes
  updatePagination(): void {
    this.totalPages = Math.ceil(this.program.length / this.itemsPerPage); // Calculate total pages
    this.paginateRecords(); // Update paginated records
  }

  // Slice the program data to show only records for the current page
  paginateRecords(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.program.length); // Prevent exceeding array length
    this.paginatedRecords = this.program.slice(startIndex, endIndex);
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

  fetchProgramData(id): void {
    this.kycService.getProgramById(id).subscribe((response) => {
      this.program = response;  // Assuming the response has a 'data' property
      console.log("this.program",response);

   
    });
  }
  // Edit a program by opening a modal
  editProgram(id: number): void {
    console.log('Edit program with id:', id);

    const modalRef = this.modalService.open(UpdateDetailsComponent);
    modalRef.componentInstance.programId = id;  // Pass the ID to the modal

    modalRef.result.then((result) => {
      console.log('Modal closed with result:', result);
      if (result === 'updated') {
        // Optionally, refetch data or update the program list based on the result
        this.fetchProgramData( this.programId); // Refresh the data if changes were made
      }
    }, (reason) => {
      console.log('Modal dismissed with reason:', reason);
    });
  }

  // Delete a program with confirmation
  deleteProgram(id: number): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent);

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.kycService.deleteProgram(id).subscribe({
          next: (response) => {
            console.log('Program deleted successfully:', response);
            this.toast.successToastr(this.LANG.Evaluation_deleted_successfully);

            // Remove the deleted program from the list and update pagination
            this.fetchProgramData( this.programId);

            this.updatePagination(); // Recalculate pagination after deletion
          },
          error: (error) => {
            this.toast.warningToastr(error.message);

            console.error('Error deleting program:', error);
          }
        });
      }
    }, (reason) => {
      console.log('Deletion canceled:', reason);
    });
  }
}
