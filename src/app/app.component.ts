import { Component, ViewChild } from '@angular/core';

import { MatDialog, MatTable } from '@angular/material';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { ApiService } from './api.service';

export interface TradingData {
  id: number,
  symbol: string;
  price: number;
  size: number;
  time: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  displayedColumns: string[] = ['symbol', 'price', 'size', 'time', 'action'];
  dataSource : TradingData[] = [];
  sortFlag = 1;

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  constructor(public dialog: MatDialog, public apiService: ApiService) {}

  changeSort() {
    this.sortFlag = this.sortFlag * -1;
    this.sortFlag > 0 ? this.dataSource.sort( this.compareUp ) : this.dataSource.sort( this.compareDown );
    this.table.renderRows();
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

  compareUp( a, b ) {
    if ( parseFloat(a.price) < parseFloat(b.price) ){
      return -1;
    }
    if ( parseFloat(a.price) > parseFloat(b.price) ){
      return 1;
    }
    return 0;
  }

  compareDown( a, b ) {
    if ( parseFloat(a.price) > parseFloat(b.price) ){
      return -1;
    }
    if ( parseFloat(a.price) < parseFloat(b.price) ){
      return 1;
    }
    return 0;
  }

  sendAPI(search_key) {
    this.apiService.getResponse(search_key).subscribe((res: any[])=>{
      for(let i = 0; i< res.length ; i++) {
        var d = new Date(res[i].time);
        var dformat = [d.getMonth()+1,
          d.getDate(),
          d.getFullYear()].join('/')+' '+
        [d.getHours(),
          d.getMinutes(),
          d.getSeconds()].join('/');
        this.dataSource.push({
          id: this.dataSource.length,
          symbol: res[i].symbol,
          price: res[i].price,
          size: res[i].size,
          time: dformat
        });
        this.sortFlag > 0 ? this.dataSource.sort( this.compareUp ) : this.dataSource.sort( this.compareDown );
      }
      this.table.renderRows();
    });
  }

  deleteRowData(row_obj){
    this.dataSource = this.dataSource.filter((value,key)=>{
      return value.id != row_obj.id;
    });
  }
}
