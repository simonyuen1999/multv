import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TCH } from './TCH';
import { TchmsgService } from './tchmsg.service';

@Component({
  selector: 'app-tch',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './tch.component.html',
  styleUrls: ['./tch.component.scss']
})
export class TchComponent {
  title = 'TCH Component in Lazy Module';

  data: TCH[] = [];

  constructor(private tchmsgService: TchmsgService) {
    console.log('TCH constructor');
    this.data = this.tchmsgService.getTCH();
  }

  onClick() {
    console.log('Button clicked');
    this.data = this.tchmsgService.getTCH();
  }
}
