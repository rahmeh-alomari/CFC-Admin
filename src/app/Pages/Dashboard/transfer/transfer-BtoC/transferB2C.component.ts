import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/Services/user.service';

@Component({
  selector: 'app-transfer-B2C',
  templateUrl: './transferB2C.component.html',
  styleUrls: ['./transferB2C.component.css']
})
export class TransferB2CComponent implements OnInit {

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
  pickedBank:any;
  banks = [
    { nameEn: 'SAUDI HOLLANDI BANK', nameAr: 'البنك الأول', bic: 'AAALSARI' },
    { nameEn: 'BANQUE SAUDI FRANSI', nameAr: 'البنك السعودي الفرنسي', bic: 'BSFRSARI' },
    { nameEn: 'AL INMA BANK', nameAr: 'بنك الإنماء', bic: 'INMASARI' },
    { nameEn: 'ARAB NATIONAL BANK', nameAr: 'البنك العربي الوطني', bic: 'ARNBSARI' },
    { nameEn: 'AL RAJHI BANK', nameAr: 'مصرف الراجحي', bic: 'RJHISARI' },
    { nameEn: 'BANK AL-JAZIRA', nameAr: 'البنك الجزيرة', bic: 'BJAZSAJE' },
    { nameEn: 'BANKMUSCAT', nameAr: 'بنك مسقط', bic: 'BMUSSARI' },
    { nameEn: 'EMIRATES BANK INTERNATIONAL PJSC', nameAr: 'بنك الإمارات الدولي', bic: 'EBILSARI' },
    { nameEn: 'FIRST ABU DHABI BANK', nameAr: 'بنك أبوظبي الأول', bic: 'FABMSARI' },
    { nameEn: 'JPMORGAN CHASE BANK, N.A. RIYADH', nameAr: 'بنك جي بي مورجان تشيس', bic: 'CHASSARI' },
    { nameEn: 'BNP PARIBAS SAUDI ARABIA', nameAr: 'بنك بي إن بي باريباس السعودية', bic: 'BNPASARI' },
    { nameEn: 'GULF INTERNATIONAL BANK B.S.C., RIYADH', nameAr: 'بنك الخليج الدولي', bic: 'GULFSARI' },
    { nameEn: 'BANK AL BILAD', nameAr: 'بنك البلاد', bic: 'ALBISARI' },
    { nameEn: 'NATIONAL BANK OF BAHRAIN', nameAr: 'البنك الوطني البحريني', bic: 'NBOBSARI' },
    { nameEn: 'NATIONAL BANK OF KUWAIT', nameAr: 'البنك الوطني الكويتي', bic: 'NBOKSAJE' },
    { nameEn: 'SAUDI NATIONAL BANK', nameAr: 'البنك الأهلي السعودي', bic: 'NCBKSAJE' },
    { nameEn: 'RIYAD BANK', nameAr: 'بنك الرياض', bic: 'RIBLSARI' },
    { nameEn: 'SAUDI BRITISH BANK', nameAr: 'البنك السعودي البريطاني', bic: 'SABBSARI' },
    { nameEn: 'SAUDI ARABIAN MONETARY AGENCY', nameAr: 'مؤسسة النقد العربي السعودي', bic: 'SAMASARI' },
    { nameEn: 'SAUDI INVESTMENT BANK', nameAr: 'البنك السعودي للاستثمار', bic: 'SIBCSARI' },
    { nameEn: 'STC Bank', nameAr: 'بنك إس تي سي', bic: 'STCJSARI' },
    { nameEn: 'D360 Bank', nameAr: 'دال ثلاثمائة و ستون', bic: 'DBAKSARI' },
    { nameEn: 'Standard Chartered Bank', nameAr: 'بنك ستاندرد تشارترد', bic: 'SCBLSAR2' }
  ];
  constructor(private http: HttpClient, private usersService: UsersService) { }
  validateKey(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const invalidKeys = ["-", ".", "e", "E"];
      const isInvalidKey = invalidKeys.includes(event.key);
      const isNotNumberKey = isNaN(Number(event.key)) && event.key !== "Backspace" && event.key !== "Tab";
      if (isInvalidKey || isNotNumberKey) {
        event.preventDefault();
      }
    }
  }

  ngOnInit() {
    this.usersService.getUsersAccounts().subscribe((res:any)=>{
      if (res.status) {
        for (let i = 0; i < res.response.length; i++) {
          this.userList[i] = { id: res.response[i].id, name: res.response[i].name }
        }
      }
      console.log("this.userList",this.userList);
    })
  }
  pickedUser() {
    console.log("this.toAccount",this.toAccount);
    this.usersService.getAccountData(this.toAccount).subscribe((res: any) => {
      if (res.status) {
        this.pickedAccountData={
          user_id:res.response.filter(field=>field.kyc_detail_id===37)[0].user_id,
          name:res.response.filter(field=>field.kyc_detail_id===137)[0].value,
          creditAccount:res.response.filter(field=>field.kyc_detail_id===37)[0].value,
          bank:res.response.filter(field=>field.kyc_detail_id===121)[0].value,
        }
      }
    })
  }
  selectedBank(){
    this.pickedAccountData.bic=this.pickedBank;
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
            this.info = data.response;
          }
          
        },
        (error) => {
          this.loading = false;
          this.error = "An error occurred while fetching data.";
        }
      );
  }
}