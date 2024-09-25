import { Injectable } from "@angular/core";

import { apiServiceComponent } from "../Services/api.service";

@Injectable({ providedIn: "root" })
export class UsersService {
  private url: string = "";

  constructor(private api: apiServiceComponent) {}

  adminList() {
    this.url = "admin_list";
    let query = "";
    return this.api.get(this.url, query);
  }
  accounts(account, startDate, endDate) {
    this.url = `statment?account=${account}&start_date=${startDate}&end_date=${endDate}`;
    let query = "";
    return this.api.get(this.url, query);
  }
  getStatment(account, startDate, endDate) {
    this.url = `getStatment?accountNumber=${account}&startDate=${startDate}&endDate=${endDate}`;
    let query = "";
    return this.api.get(this.url, query);
  }
  transferBetweenOurAccounts(debitAccount, creditAccount,amount) {
    this.url = `internalTransfer?amount=${amount}&creditAccount=${creditAccount}&debitAccount=${debitAccount}`;
    let query = "";
    return this.api.get(this.url, query);
  }
  getUsersAccounts() {
    this.url = `getUsers`;
    let query = "";
    return this.api.get(this.url, query);
  }
  getAccountData(accountId){
    this.url = `getIban?user_id=${accountId}`;
    let query = "";
    return this.api.get(this.url, query);
  }
  transferBetweenTwoAccounts(amount,creditAccount,debitAccount,bic ,user_id) {
    this.url = `payemtAdmin?amount=${amount}&creditAccount=${creditAccount}&debitAccount=${debitAccount}&bic=${bic}&user_id=${user_id}`;
    let query = "";
    return this.api.get(this.url, query);
  }
  getStatus(IBAN) {
    this.url = `bankStatus?debitAccount=${IBAN}`;
    let query = "";
    return this.api.get(this.url, query);
  }
  balances(accountNumber) {
    this.url = `balance?account=${accountNumber}`;
    let query = "";
    return this.api.get(this.url, query);
  }
  departmentList(data) {
    this.url = "get_department";
    return this.api.post(this.url, data);
  }

  adminDepartments() {
    this.url = "admin_department";
    return this.api.get(this.url, "");
  }

  getUserTpe() {
    this.url = `usertype_list/2`;
    return this.api.get(this.url, "");
  }

  getAdminDetails(id) {
    this.url = `get_user_detail/${id}`;
    return this.api.get(this.url, "");
  }

  addAdmins(data) {
    this.url = "add_admin";
    return this.api.post(this.url, data);
  }

  updateAdmin(data) {
    this.url = "update_admin";
    return this.api.post(this.url, data);
  }

  adminIpList() {
    this.url = "admin_ip_list";
    return this.api.get(this.url, "");
  }

  addAdminIp(data) {
    this.url = "add_admin_ip";
    return this.api.post(this.url, data);
  }

  adminIpLogList() {
    this.url = "list_adminiplogs";
    return this.api.get(this.url, "");
  }

  addEmailTemplates(data) {
    this.url = "insert_template";
    return this.api.post(this.url, data);
  }

  updateEmailTemplates(data) {
    this.url = "update_template";
    return this.api.post(this.url, data);
  }

  templatesList() {
    this.url = "list_template";
    return this.api.get(this.url, "");
  }

  getTemplatesDetails(id) {
    this.url = `get_email_byid/${id}`;
    return this.api.get(this.url, "");
  }

  getTemplatesType() {
    this.url = `get_template_type`;
    return this.api.get(this.url, "");
  }
}
