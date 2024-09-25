import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UsersService } from "src/app/shared/Services/user.service";
@Component({
  selector: "app-transfer-B2B",
  templateUrl: "./transferB2B.component.html",
  styleUrls: ["./transferB2B.component.css"],
})
export class TransferB2BComponent implements OnInit {
  fromAccount: string = "";
  toAccount: string = "";
  loading: boolean = false;
  error: string = "";
  info: any = null;
  fromAccounts:any= ["0108095517580016", "0190095517580017", "0108095517580018"];
  toAccounts:any= ["0108095517580016", "0190095517580017", "0108095517580018"];
  amount: any=0;
  constructor(private http: HttpClient, private usersService: UsersService) {}
  onAccountChange(event) {
    console.log("event",event)
    this.toAccounts = this.fromAccounts;
    this.toAccounts = this.toAccounts.filter((account:any) => account !== this.fromAccount);
  }
  
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
  
  transferBalance() {
    this.loading = true;
    this.error = "";
    this.info = null;
    this.usersService
      .transferBetweenOurAccounts(this.fromAccount, this.toAccount,this.amount)
      .subscribe(
        (data:any) => {
          this.loading = false;
          this.info = data.response;
        },
        (error) => {
          this.loading = false;
          this.error = "An error occurred while fetching data.";
        }
      );
  }
  ngOnInit() {}
}
