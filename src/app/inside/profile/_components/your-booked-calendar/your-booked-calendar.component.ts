import { Component, OnInit } from "@angular/core";
import { BookingService } from "app/_share/_services";
import { environment } from "environments/environment";

@Component({
    selector: 'app-your-booked-calendar',
    templateUrl: './your-booked-calendar.component.html'
})

export class YourBookedCalendarComponent implements OnInit {
    defautlFormat: any = null;
    dateFormatForEdit: string = '';
    _dateFormatForShow: string = '';
    constructor(
        private bookingSer: BookingService
    ) {
        this.defautlFormat = environment.FORMAT_SETTING
        if (this.defautlFormat) {
            this._dateFormatForShow = this.defautlFormat.date;
            this.dateFormatForEdit = this._dateFormatForShow ? this._dateFormatForShow.replace('DD', 'dd').replace('YYYY', 'yyyy') : '';
        }
    }

    ngOnInit(): void {
        this.getCalendar();
    }

    getCalendar() {
        this.bookingSer.getBookedListByUser().subscribe({
            next: resp => { },
            error: error => { },
            complete() { },
        });
    }
}