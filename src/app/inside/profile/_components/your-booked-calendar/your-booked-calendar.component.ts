import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Helpers } from "app/_cores/_helpers";
import { getSystemMsgByCode } from "app/_share/_enum";
import { IBookingInfor } from "app/_share/_interface";
import { ITableElement } from "app/_share/_interface/share.interface";
import { BookingService, SessionService } from "app/_share/_services";
import { environment } from "environments/environment";
import * as _ from "lodash";
import * as moment from "moment";
import { NzMessageService } from "ng-zorro-antd/message";
import { IBookingItem } from "../../_interfaces";

@Component({
    selector: 'app-your-booked-calendar',
    templateUrl: './your-booked-calendar.component.html'
})

export class YourBookedCalendarComponent implements OnInit {
    data = {
        bookedListRaw: [] as IBookingItem[],
        bookedList: [] as {
            bookedAt: Date | string | number,
            doctorName: string,
            children: IBookingItem[]
        }[]
    }
    loading = {
        list: false,
        approval: false,
    }
    isDoctor: boolean = false
    defautlFormat: any = null;
    dateFormatForEdit: string = '';
    _dateFormatForShow: string = '';
    timeFormat: string = 'HH:mm a';
    tableHeader: ITableElement[] = [
        { title: "Ngày Hẹn", field: "bookedAt" },
        { title: "Bác sĩ", field: "doctorName" },
        { title: "Ca 1", field: "1" },
        { title: "Ca 2", field: "2" },
        { title: "Ca 3", field: "3" },
        { title: "Ca 4", field: "4" },
    ]
    constructor(
        private bookingSer: BookingService,
        private translate: TranslateService,
        private msg: NzMessageService,
        private sessionSer: SessionService,
    ) {
        this.isDoctor = this.sessionSer.isDoctor();
        this.defautlFormat = environment.FORMAT_SETTING
        if (this.defautlFormat) {
            this._dateFormatForShow = this.defautlFormat.date;
            this.dateFormatForEdit = this._dateFormatForShow ? this._dateFormatForShow.replace('DD', 'dd').replace('YYYY', 'yyyy') : '';
            this.timeFormat = this.defautlFormat['time'] || this.timeFormat

            if (this.timeFormat) {
                this.timeFormat = this.timeFormat.replace(':ss', '');
            }
        }
    }

    ngOnInit(): void {
        this.getCalendar();
    }

    getCalendar() {
        this.loading.list = true;
        const _request = this.isDoctor ? this.bookingSer.getBookedListByDoctor() : this.bookingSer.getBookedListByUser();
        if (_request) {
            _request.subscribe({
                next: resp => {
                    if (resp.data && resp.data.length) {
                        this.data.bookedListRaw = resp.data.map((item: any) => {
                            return {
                                ...item,
                                expired: !item.bookedAt ? false : moment(new Date()).unix() > item.bookedAt,
                                shift: item.bookedShift,
                                bookedAt: item.bookedAt.toString().length > 13 ? item.bookedAt / 1000 : item.bookedAt
                            }
                        });
                        this.data.bookedList = _.orderBy(this.cookingBookedList(this.data.bookedListRaw), ['bookedAt']);
                    } else {
                        this.data.bookedListRaw = [];
                        this.data.bookedList = [];
                    }
                    this.loading.list = false;
                },
                error: error => {
                    this.showError(error['error'] ? error['error'].code || 8 : 8);
                    this.data.bookedListRaw = [];
                    this.data.bookedList = [];
                    this.loading.list = false;
                },
                complete: () => {
                    this.loading.list = false;
                },
            });
        }
    }

    cookingBookedList(_list: IBookingItem[]): { bookedAt: Date | string | number, doctorName: string, children: IBookingItem[] }[] {
        const _bookedListByDate = _.chain(_list)
            .groupBy('bookedAt')
            .toPairs()
            .map(item => {
                const _object = _.zipObject(['bookedAt', 'children'], item);
                const childs = [..._object['children']]
                return {
                    ..._object,
                    bookedAt: +_object['bookedAt'],
                    children: childs
                }
            }).value()
        return this.cookingSameDate(_bookedListByDate as any)
    }

    cookingSameDate(list: { bookedAt: Date | string | number, doctorName: string, children: IBookingItem[] }[]): { bookedAt: Date | string | number, doctorName: string, children: IBookingItem[] }[] {
        let cookedList = [] as any[]
        if (list && list.length) {
            list.forEach(item => {
                const _doctorIds = _.union(item.children.map((child: any) => child.doctorId || ''));
                if (_doctorIds.length > 1) {
                    _doctorIds.forEach(doctorId => {
                        const childById = item.children.filter(child => child.doctorId === doctorId);
                        cookedList.push({
                            bookedAt: item.bookedAt,
                            doctorName: childById[0].doctorName || '',
                            children: this.cookingShifts(childById),
                        })
                    });
                } else {
                    cookedList.push(_.cloneDeep({
                        ...item,
                        doctorName: item.children[0].doctorName || '',
                        children: this.cookingShifts(item.children),
                    }));
                }
            })
        }
        return cookedList
    }

    cookingShifts(list: any[]) {
        const _returnList = [] as any[];
        let count = 1;
        while (_returnList.length < 4) {
            const _existItem = list.find(item => item.bookedShift === count);
            if (_existItem) {
                _returnList.push(_existItem);
            } else {
                _returnList.push(null);
            }
            count++
        }
        return _returnList.map(item => {
            return this.parseMissingfield(item)
        })
    }

    parseMissingfield(item: any) {
        if (!item) return null
        const bookedTime = item.bookedShift === 1 ? 8 : item.bookedShift === 2 ? 10 : item.bookedShift === 3 ? 13 : 15;
        return {
            ...item,
            start: Helpers.dateTime.setHour(bookedTime, item.bookedAt),
            end: Helpers.dateTime.setHour(bookedTime + 2, item.bookedAt),
            expired: moment().unix() * 1000 >= Helpers.dateTime.setHour(bookedTime, item.bookedAt),
            shift: item.bookedShift,
            visibleInforModal: false,
        }
    }

    approval(id: number, approve: boolean, allowApproval: boolean) {
        if (allowApproval) {
            this.loading.approval = true;
            this.bookingSer.approvalBooking(id, { approve: approve }).subscribe({
                next: resp => {
                    this.showSuccess();
                    this.getCalendar();
                    this.loading.approval = false;
                },
                error: error => {
                    this.showError(error['error'] ? error['error'].code || 8 : 8);
                    this.loading.approval = false;
                },
                complete: () => {
                    this.loading.approval = false;
                },
            });
        }
    }

    onToggleBookedInforModal(parentIdx: number, childIdx: number, evt: boolean) {
        if (!this.loading.approval) {
            if (this.data.bookedList[parentIdx]) {
                if (this.data.bookedList[parentIdx].children && this.data.bookedList[parentIdx].children[childIdx]) {
                    this.data.bookedList[parentIdx].children[childIdx].visibleInforModal = evt;
                }
            }
        }
    }

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }

    showSuccess() {
        this.msg.success(this.translate.instant('SYS_MSG.SUCCESS'));
    }
}