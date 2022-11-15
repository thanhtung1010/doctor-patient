import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IBookingItem } from "app/inside/profile/_interfaces";
import { Helpers } from "app/_cores/_helpers/helpers";
import { IUserProfile } from "app/_cores/_models";
import { CommonService } from "app/_cores/_services/common.service";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { ROLE } from "app/_share/_enum/role.enum";
import { IPost } from "app/_share/_interface";
import { ITableElement } from "app/_share/_interface/share.interface";
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
        bookedList: [] as {
            bookedAt: Date | string | number,
            createdBy: string,
            children: IBookingItem[]
        }[]
    }
    loading = {
        list: false,
    }
    defautlFormat: any = null;
    dateFormatForEdit: string = '';
    _dateFormatForShow: string = '';
    timeFormat: string = 'HH:mm a';
    ROLE = ROLE
    tableHeader: ITableElement[] = [
        { title: "Người tạo", field: "createdBy", align: 'left' },
        { title: "Ngày Hẹn", field: "bookedAt" },
        { title: "Ca 1", field: "1" },
        { title: "Ca 2", field: "2" },
        { title: "Ca 3", field: "3" },
        { title: "Ca 4", field: "4" },
    ]
    constructor(
        private translate: TranslateService,
        private readonly commonSer: CommonService,
        private msg: NzMessageService,
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

    cookingBookedList(_list: IBookingItem[]): { bookedAt: Date | string | number, createdBy: string, children: IBookingItem[] }[] {
        const _bookedListByDate = _.chain(_list)
            .groupBy('bookedAt')
            .toPairs()
            .map(item => {
                const _object = _.zipObject(['bookedAt', 'children'], item);
                const child = [..._object['children']]
                return {
                    ..._object,
                    bookedAt: +_object['bookedAt'] / 1000,
                    createdBy: (child[0] as any)['createdBy'] || '',
                    children: this.cookingShifts(child)
                }
            }).value()
        return _bookedListByDate as any
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
            start: Helpers.dateTime.setHour(bookedTime, item.bookedAt / 1000),
            end: Helpers.dateTime.setHour(bookedTime + 2, item.bookedAt / 1000),
            expired: moment().unix() * 1000 >= Helpers.dateTime.setHour(bookedTime - 1, item.bookedAt / 1000)
        }
    }

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }

    showSuccess() {
        this.msg.success(this.translate.instant('STATUS.SUCCESS'));
    }

}