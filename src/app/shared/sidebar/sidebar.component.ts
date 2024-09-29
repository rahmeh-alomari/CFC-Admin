import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SharedService } from '../Services/shared.service';
import { environment } from 'src/environments/environment';
import { Navigations } from '../enum';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls:['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any[];
  LANG=environment.english_translations;
  user_data:any={};
  navigation_options=Navigations;
  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element; 
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private toast:ToastrManager,
    private shared:SharedService
  ) {
    const user_data=btoa(btoa("user_info"));

    if(localStorage.getItem(user_data) != undefined){
      this.user_data=JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));
      console.log("data",this.user_data)

    }
  }

  // End open close
  ngOnInit() {
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
  }

  logout(){
    localStorage.clear();
    this.toast.successToastr("Logout successfully");
    this.shared.changeUser(false);
    setTimeout(() => {
        this.router.navigate(['/login'])
    }, 500);
  }

  goToSections(type:string){
    this.router.navigate(["/dashboard/section-list"],{queryParams:{type:btoa(btoa(type))}})
  }


  checkRoute(data){
 
    const role=this.user_data.access_control.split(",");
    let index=role.findIndex(item=>{return item == data.toString()})
 
    if(index == -1){
      return null;
    }
    return true;
  }


}
