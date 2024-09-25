import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Params, Router } from "@angular/router";
import { KYCService } from "src/app/shared/Services/kyc.service";
import { FieldType } from "src/app/shared/enums";
import { ToastrManager } from "ng6-toastr-notifications";
import { environment } from "src/environments/environment";
import { CrNumber } from "src/app/shared/Models/cr-number";
import { Location } from "@angular/common";
import { filter } from "rxjs/operators";
import { UsersService } from "src/app/shared/Services/user.service";
declare const $: any;

@Component({
  selector: "app-investor-borrower-kycdetails",
  templateUrl: "./investor-borrower-kycdetails.component.html",
  styleUrls: ["./investor-borrower-kycdetails.component.css"],
})
export class InvestorBorrowerKYCDetailsComponent implements OnInit {
  id: string;
  reason: string = "";
  load: boolean = false;
  pending_load: boolean = false;
  details: any = [];
  field_types = FieldType;
  LANG = environment.english_translations;
  crNumberStr: any;
  crNumber: CrNumber = new CrNumber();
  qualifiedInvestor: any = {
    id: 0,
    investor_id: "",
    min3WorkYear_url: "",
    certificateCME1_url: "",
    professionalCertificate_url: "",
    investTenOpport_url: "",
    netOrigin_url: "",
    created_at: "",
    updated_at: "",
  };
  pdfUrl$: boolean = false;
  watheqDataFromUser: any;
  post_data: any;
  verifyCR: any;
  previousUrl: any;
  currentUrl: string;
  currentPageType: string;
  adminName: any;

  constructor(
    private route: ActivatedRoute,
    private kycService: KYCService,
    private toast: ToastrManager,
    private router: Router,
    private location: Location,
    private usersService: UsersService
  ) {}
  comercialReg(reg) {
    this.load = true;
    this.kycService
      .commercialregistration(reg)
      .subscribe((fullWatheqData: any) => {
        if (fullWatheqData.status) {
          this.post_data = [
            {
              id: 74,
              kyc_id: "9",
              type: 9,
              info_type: 16,
              title: "السجل التجاري",
              length: "",
              mandatory: 1,
              status: "1",
              position: 1,
              user_kyc_id: "",
              value: fullWatheqData.response.crNumber,
              required: false,
              invalid: false,
            },
            {
              id: 112,
              kyc_id: "9",
              type: 6,
              info_type: 16,
              title: "اسم المنشأة",
              length: "",
              mandatory: 1,
              status: "1",
              position: 1,
              user_kyc_id: "",
              value: fullWatheqData.response.crName,
              required: false,
              invalid: false,
            },
            {
              id: 113,
              kyc_id: "9",
              type: 6,
              info_type: 16,
              title: "crEntityNumber",
              length: "",
              mandatory: 1,
              status: "1",
              position: 3,
              user_kyc_id: "",
              value: fullWatheqData.response.crEntityNumber,
              required: false,
              invalid: false,
            },
            {
              id: 114,
              kyc_id: "9",
              type: 1,
              info_type: 16,
              title: "نوع العمل",
              length: "",
              mandatory: 1,
              status: "1",
              position: 4,
              user_kyc_id: "",
              value: fullWatheqData.response.businessType.name,
              required: false,
              invalid: false,
            },
            {
              id: 115,
              kyc_id: "9",
              type: 7,
              info_type: 16,
              title: "تاريخ الاصدار",
              length: "",
              mandatory: 1,
              status: "1",
              position: 5,
              user_kyc_id: "",
              value: fullWatheqData.response.issueDate,
              required: false,
              invalid: false,
            },
            {
              id: 116,
              kyc_id: "9",
              type: 7,
              info_type: 16,
              title: "تاريخ الانتهاء",
              length: "",
              mandatory: 1,
              status: "1",
              position: 6,
              user_kyc_id: "",
              value: fullWatheqData.response.expiryDate,
              required: false,
              invalid: false,
            },
          ];
          const data = {
            field: this.post_data,
            crnumber: JSON.stringify(fullWatheqData.response),
            id: this.id,
          };
          this.kycService.addKyc(data).subscribe((res: any) => {
            if (res.status) {
              this.load = false;
              this.toast.successToastr("Watheq Data is Verified");
            } else {
              this.toast.warningToastr(
                "Data cannot be added because its not verified"
              );
              this.load = false;
            }
          });
          this.getKYCDetails();
          this.getQualifiedInvestor();
          this.getWatheqData();
        } else {
          this.toast.warningToastr("Watheq Data is not verified");
          this.load = false;
        }
      });
  }
  allFiledText: any[];
  allFields: any[];
  allValues: any[];
  actionType: string = "";
  logDateTime: string = "";
  originalValue: string;
  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params["id"]) {
        console.log();
        this.id = atob(atob(params["id"]));
        this.getKYCDetails();
        this.getQualifiedInvestor();
        this.getWatheqData();
      }
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        console.log("this.previousUrl", this.previousUrl);
        console.log("this.currentUrl", this.currentUrl);
        if (this.previousUrl == "/dashboard/inverstors-kyc") {
          this.currentPageType = "Investor Page";
        } else if (this.previousUrl == "/dashboard/borrowers-kyc") {
          this.currentPageType = "Borrower Page";
        }
      });
    this.initializeData();
    this.crNumber = new CrNumber();
  }
  storeOriginalValue(fields: any) {
    this.originalValue = fields;
  }
  onFieldChange(fieldName: string, originalValue: string, change: any): void {
    let value;
    if(originalValue!==undefined)
    value = `${originalValue} => ${change}`;
  else {
    value = `Not Set => ${change}`;
  }
    this.allFiledText.push({ fieldName, value });
  }
  setActionType(action: string): void {
    this.actionType = action;
    this.logDateTime = this.currentPageType || "Investor_Borrower Page",
    this.saveChanges();
  }
  initializeData() {
    this.allFiledText = [];
    this.actionType = "";
    this.logDateTime = this.currentPageType || "Investor_Borrower Page",
    this.adminName = localStorage.getItem("name");
  }
  saveChanges(): void {
    setTimeout(() => {
      const data = {
        UserName: this.adminName,
        ActionType: this.actionType,
        LogDateTime: this.currentPageType || "Investor_Borrower Page",
      };
      this.kycService.storeTrack(data).subscribe((res: any) => {
        if (res) {
          this.allFiledText.map((obj) => {
            obj.Field = obj.fieldName;
            obj.Value = obj.value;
            obj.master_id = res.response.id;
          });
          this.allFiledText.forEach((obj) => {
            this.kycService.insertLog(obj).subscribe((res) => {});
          });
        }
      });
    }, 0);
  }
  getWatheqData() {
    this.load = true;
    this.kycService.getWatheqData({ id: this.id }).subscribe((res: any) => {
      if (res.status) {
        this.watheqDataFromUser = res.response[0];
        this.load = false;
      } else {
        this.toast.warningToastr("No records were found");
        this.load = false;
      }
    });
  }
  getQualifiedInvestor() {
    this.kycService.getQualifInvestorDetails(this.id).subscribe((res: any) => {
      if (res.status) {
        this.qualifiedInvestor = res.response[0];
      }
    });
  }

  getKYCDetails() {
    this.kycService.getUserKycDetails(this.id).subscribe((res: any) => {
      if (res.status) {
        this.details = res.response;
        this.details.display_mobile_number = `${this.details.country_code}${this.details.mobile_number}`;
        if (
          res.response.cr_number_response != null &&
          res.response.cr_number_response != undefined &&
          res.response.cr_number_response != "null"
        ) {
          this.crNumber = JSON.parse(this.details.cr_number_response);
        } else {
          this.crNumber = new CrNumber();
        }
        this.details.detail.map((data) => {
          data.info_type.map((item) => {
            item.detail.map((fields) => {
              //   if(fields.id==22){
              //     console.log(fields.value[84]);
              //   }
              // if(fields.value[84]=='f') {
              //   // const pdfRef =  fields.value.ref('path/to/pdf.pdf')
              //   this.pdfUrl$ = true
              //   console.log("pdf");
              //   }
            });
          });
        });
      }
    });
  }

  approveRejectKYC(status: string) {
    let message = this.LANG.KYC_Approved;
    if (status == "2") {
      if (this.reason == "" || this.reason == undefined) {
        this.toast.warningToastr(this.LANG.Please_give_reason_for_rejection);
        return;
      }
      message = this.LANG.KYC_Rejected;
    }
    if (status == "1") {
      this.load = true;
    } else if (status == "0") {
      this.pending_load = true;
    }
    const data: any = {
      user_id: this.id,
      approved_status: status,
      note: this.reason,
    };
    this.kycService.approveRejectKYC(data).subscribe((res: any) => {
      this.load = false;
      this.pending_load = false;
      if (res.status) {
        this.toast.successToastr(message);
        $("#reject").modal("hide");
        this.reason = "";
      }
    });
  }
  downloadPdf() {}
}
