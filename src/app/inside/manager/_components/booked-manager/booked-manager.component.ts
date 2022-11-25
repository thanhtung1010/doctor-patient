import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IBookedCalendar, IBookingItem } from "app/inside/profile/_interfaces";
import { Helpers } from "app/_cores/_helpers/helpers";
import { IUserProfile } from "app/_cores/_models";
import { CommonService } from "app/_cores/_services/common.service";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { ROLE } from "app/_share/_enum/role.enum";
import { IPost } from "app/_share/_interface";
import { ITableElement } from "app/_share/_interface/share.interface";
import { BookingService } from "app/_share/_services/booking.service";
import { environment } from "environments/environment";
import * as _ from "lodash";
import * as moment from "moment";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
    selector: "app-booked-manager",
    templateUrl: "./booked-manager.component.html"
})

export class BookedManagerComponent implements OnInit {
    data = {
        bookedListRaw: [] as IBookingItem[],
        bookedList: [] as IBookedCalendar[]
    }
    loading = {
        list: false,
        approval: false,
    }
    defautlFormat: any = null;
    dateFormatForEdit: string = '';
    _dateFormatForShow: string = '';
    timeFormat: string = 'HH:mm a';
    ROLE = ROLE
    tableHeader: ITableElement[] = [
        { title: "Ngày Hẹn", field: "bookedAt", align: 'left', width: 150 },
        { title: "Bác sĩ", field: "doctorName", width: 200 },
        { title: "Người hẹn", field: "createdBy", width: 200 },
        { title: "Ca 1", field: "1", width: 250 },
        { title: "Ca 2", field: "2", width: 250 },
        { title: "Ca 3", field: "3", width: 250 },
        { title: "Ca 4", field: "4", width: 250 },
    ]
    constructor(
        private translate: TranslateService,
        private readonly commonSer: CommonService,
        private msg: NzMessageService,
        private bookingSer: BookingService,
    ) {
        this.defautlFormat = environment.FORMAT_SETTING;
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
        this.initData();
    }

    initData() {
        this.getAllBooked();
    }

    getAllBooked() {
        this.loading.list = true
        this.commonSer.getAllBooked().subscribe({
            next: resp => {
                if (resp.data && resp.data.length) {
                    this.data.bookedListRaw = resp.data.map((item: any) => {
                        return {
                            ...item,
                            expired: !item.bookedAt ? false : moment(new Date()).unix() > item.bookedAt,
                            shift: item.bookedShift
                        }
                    });
                    this.data.bookedList = _.orderBy(this.cookingBookedList(resp.data), ['bookedAt']);
                } else {
                    this.data.bookedListRaw = [];
                    this.data.bookedList = [];
                }
                this.loading.list = false;
            },
            error: error => {
                this.showError(error['error'] ? error['error'].code || 8 : 8);
                this.loading.list = false;
            },
            complete: () => {
                this.loading.list = false;
            }
        });
    }

    cookingBookedList(_list: IBookingItem[]): IBookedCalendar[] {
        const _bookedListByDate = _.chain(_list)
            .groupBy('bookedAt')
            .toPairs()
            .map(item => {
                const _object = _.zipObject(['bookedAt', 'children'], item);
                const child = [..._object['children']]
                return {
                    ..._object,
                    bookedAt: _object['bookedAt'].toString().length > 13 ? +_object['bookedAt'] / 1000 : _object['bookedAt'],
                    createdBy: (child[0] as any)['createdBy'] || '',
                    children: child
                }
            }).value()
        return this.cookingSameDate(_bookedListByDate as any)
    }

    cookingSameDate(list: IBookedCalendar[]): IBookedCalendar[] {
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
                            createdBy: childById[0].doctorName || '',
                            children: this.cookingShifts(childById),
                        })
                    });
                } else {
                    cookedList.push(_.cloneDeep({
                        ...item,
                        doctorName: item.children[0].doctorName || '',
                        createdBy: item.children[0].doctorName || '',
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
        const _bookedAt = item.bookedAt.toString().length > 13 ? +item.bookedAt / 1000 : item.bookedAt;
        return {
            ...item,
            start: Helpers.dateTime.setHour(bookedTime, _bookedAt),
            end: Helpers.dateTime.setHour(bookedTime + 2, _bookedAt),
            expired: moment().unix() * 1000 >= Helpers.dateTime.setHour(bookedTime - 1, _bookedAt),
            shift: item.bookedShift,
            visibleInforModal: false,
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

    approval(id: number, approve: boolean, allowApproval: boolean) {
        if (allowApproval) {
            this.loading.approval = true;
            this.bookingSer.approvalBooking(id, { approve: approve }).subscribe({
                next: resp => {
                    this.showSuccess();
                    this.getAllBooked();
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

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }

    showSuccess() {
        this.msg.success(this.translate.instant('SYS_MSG.SUCCESS'));
    }

}