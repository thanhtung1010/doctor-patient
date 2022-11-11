import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { getSystemMsgByCode } from "app/_share/_enum";
import { IBookingInfor } from "app/_share/_interface";
import { BookingService } from "app/_share/_services";
import { environment } from "environments/environment";
import * as _ from "lodash";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: 'app-your-booked-calendar',
    templateUrl: './your-booked-calendar.component.html'
})

export class YourBookedCalendarComponent implements OnInit {
    data = {
        bookedListRaw: [] as IBookingInfor[],
        bookedList: [] as {
            bookedAt: Date | string | number,
            children: IBookingInfor[]
        }[]
    }
    defautlFormat: any = null;
    dateFormatForEdit: string = '';
    _dateFormatForShow: string = '';
    constructor(
        private bookingSer: BookingService,
        private translate: TranslateService,
        private msg: NzMessageService,
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
            next: resp => {
                if (resp.data && resp.data.length) {
                    this.data.bookedListRaw = resp.data;
                    this.data.bookedList = this.cookingBookedList(resp.data);
                } else {
                    this.data.bookedListRaw = [];
                    this.data.bookedList = [];
                }
            },
            error: error => {
                this.showError(error['error'] ? error['error'].code || 8 : 8);
                this.data.bookedListRaw = [];
                this.data.bookedList = [];
            },
            complete() { },
        });
    }

    cookingBookedList(_list: IBookingInfor[]): { bookedAt: Date | string | number, children: IBookingInfor[] }[] {
        const _bookedListByDate = _.chain(_list)
            .groupBy('bookedAt')
            .toPairs()
            .map(item => {
                const _object = _.zipObject(['bookedAt', 'children'], item);
                return _object
            }).value()
        return _bookedListByDate as any
    }

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }

    showSuccess() {
        this.msg.success(this.translate.instant('STATUS.SUCCESS'));
    }
}