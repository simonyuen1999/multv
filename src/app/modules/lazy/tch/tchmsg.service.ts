import { Injectable } from '@angular/core';
import { TCH } from './TCH';

@Injectable({
  providedIn: 'root'
})
export class TchmsgService {

  constructor() { }

  getTCH(): TCH[] {
    // Add a return statement here
    return [
      {
        TIME: "2014-01-01 12:00:00",
        TYPE: "ABC",
        STATUS: "Ready",
        MSG_ID: 1234
      },
      {
        TIME: "2014-02-01 16:00:00",
        TYPE: "xyz",
        STATUS: "Pending",
        MSG_ID: 6789
      }
    ];
  }
}
