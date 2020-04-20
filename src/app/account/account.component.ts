import { Component, OnInit } from '@angular/core';
import {HttpConnectionService,userInfo,item,order} from '../http-connection.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  myAccount:userInfo;
  backup:userInfo;

  myOrders:order[]=[];

  selectedOrder:number;
  totalPrice:number;

  needChanged=false;
  constructor(private modalService:NgbModal,
  private httpConnection:HttpConnectionService) { }
  ngOnInit() {
    if (!this.httpConnection.localTest){
      this.httpConnection.getOrders().then(val=>{
        this.myOrders=val;
        for (let i of this.myOrders){
          i.price=0;
          for (let j of i.items){
            i.price+=j.price*j.quantity;
          }
        }
      });
      this.httpConnection.getUserInfo().then(val=>{
        this.myAccount=val;
        this.backup=val;
      });
    }
  }
  change(){
    this.needChanged=!this.needChanged;
    if (this.needChanged){
      Object.assign(this.backup,this.myAccount);
    } else {
      Object.assign(this.myAccount,this.backup);
    }
  }
  saveChange(){
    this.needChanged=false;
  }
  showDetail(content,index:number){
    this.selectedOrder=index;
    this.totalPrice=0;
    for (let i of this.myOrders[this.selectedOrder].items){
      this.totalPrice+=i.price*i.quantity;
    }
    this.modalService.open(content,{ariaLabelledBy:'modal-title'});
  }
}