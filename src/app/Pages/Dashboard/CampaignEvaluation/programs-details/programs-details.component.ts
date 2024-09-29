import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KYCService } from 'src/app/shared/Services/kyc.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-programs-details',
  templateUrl: './programs-details.component.html',
  styleUrls: ['./programs-details.component.css']
})
export class ProgramsDetailsComponent implements OnInit {
  LANG=environment.english_translations;

  private program: any;

    constructor(private route: ActivatedRoute,private kycService:KYCService,) { }
  
    ngOnInit(): void {
      this.program = this.kycService.getProgram(); 
      console.log('Program data:', this.kycService.getProgram() );
  }
  }