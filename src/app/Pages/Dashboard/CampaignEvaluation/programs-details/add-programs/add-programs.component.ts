import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { KYCService } from 'src/app/shared/Services/kyc.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';  // Import Location service
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-programs',
  templateUrl: './add-programs.component.html',
  styleUrls: ['./add-programs.component.css']
})
export class AddProgramsComponent implements OnInit {
  programForm: FormGroup;
  LANG=environment.english_translations;
  programId: number;

  constructor(private fb: FormBuilder,private kycService:KYCService,private toast:ToastrManager,private route: ActivatedRoute,private location: Location) {
   
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.programId = +params['id'];  // Extract and convert 'id' to a number
      console.log('Received Program ID:', this.programId);
    });
    console.log('Received Program ID:', this.programId);
    this.programForm = this.fb.group({
      campaign_id: [{ value: this.programId, disabled: true }, Validators.required],

      psd_director_name: ['', Validators.required],
      psd_director_relation: ['', Validators.required],
      psd_director_nationality: ['', Validators.required],
      Licensing: ['', Validators.required],
      Licensing_Purpose:['', Validators.required],
      SPV_trustee: ['', Validators.required],
      spv:['', Validators.required],
      sukuk: ['', Validators.required],
      Sukuk_products: ['', Validators.required],
      Issuer_Paying_Agent:['', Validators.required],
      sukk_face_value: ['', Validators.required],
      Platform_Admin: ['', Validators.required],
        funding_purpose: ['', Validators.required],
        program_tot_face_value: ['', Validators.required],
        sponsor: ['', Validators.required],
        sponsor_Role_desc: ['', Validators.required],
        Sponsor_commitment: ['', Validators.required],
        sponsor_repres: ['', Validators.required],
        subs_mony_Retur: ['', Validators.required],
        Risk_factors: ['', Validators.required],
        Beneficiary: ['', Validators.required],
        entity_beneficiary_Legal: ['', Validators.required],
        Beneficiary_activities: ['', Validators.required],
        Beneficiary_capital: [null, [Validators.required, Validators.min(0)]],
        company_owners: ['', Validators.required],
        conditions_inv_services: ['', Validators.required],
        opportunity__program__infos: ['', Validators.required],
        Subscription_method: ['', Validators.required],
        min_max_subscription: ['', Validators.required],
        Alloc_Offering_restricts: ['', Validators.required],
        property_Promissory_note: ['', Validators.required],
        ruling_regime: ['', Validators.required],
        sukk_document: ['', Validators.required],
        beneficiary_promissory_note: ['', Validators.required],
        offering_proceeds_use: ['', Validators.required],
        early_redemption: ['', Validators.required],
        sukuk_extinguishing: ['', Validators.required],
        Periodic_distrib_amount: [null, [Validators.required, Validators.min(0)]],
        role_custodian_Desc: ['', Validators.required],
        Sukuk_Restrictions: ['', Validators.required],
        Sukuk_assets: ['', Validators.required],
        Murabaha_contract: ['', Validators.required],
        Investment_custody: ['', Validators.required],
        Investment_management: ['', Validators.required],
        Management_fee: [null, [Validators.required, Validators.min(0)]],
        Fund_distribution: ['', Validators.required],
        Valuation_frequency: ['', Validators.required],
        Legal_documents: ['', Validators.required],
        Final_approved_documents: ['', Validators.required],
        Approval_date: ['', Validators.required],
        Approval_user: ['', Validators.required],
        Approval_status: ['', Validators.required],
        Funding_amount: [null, [Validators.required, Validators.min(0)]],
        contract_start_date: ['', Validators.required],
        contract_end_date: ['', Validators.required]
    });
  }
  

  onSubmit() {
    this.programForm.get('campaign_id')?.enable();

    // Ensure that campaign_id is included in the form data even if the input is disabled
    const formData = {
        ...this.programForm.value,
        // Ensure campaign_id is sent in the request
    };

    if (this.programForm.valid) {
        console.log('Form data before submission:', formData); // Log form data

        this.kycService.addProgram(formData).subscribe(
            (response) => {
                console.log('Program added successfully:', response);
                this.toast.successToastr(this.LANG.Program_Added_successfully);

                this.programForm.reset(); // Reset the form after submission
                this.programForm.get('campaign_id')?.disable();

            },
            (error) => {
                this.toast.warningToastr(error.message);
                console.error('Error adding program:', error);
                this.programForm.get('campaign_id')?.disable();

            }
        );
    } else {
        console.log('Form is invalid');
        this.programForm.get('campaign_id')?.disable();

    }
    
}

goBack(): void {
    this.location.back();  // Navigate back to the previous page
  }
}