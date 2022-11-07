import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Helpers } from "app/_cores/_helpers";
import { IShift } from "app/_share/_interface/booking.interface";
import { environment } from "environments/environment";
import * as moment from "moment";

@Component({
    selector: 'app-shift-list',
    templateUrl: './shift-list.component.html'
})

export class ShiftListComponent implements OnInit, OnChanges {
    @Input() bookedList: any[] = [];
    @Input() bookingDate: any = null;
    @Input() isBooking: boolean = true;
    @Input() shift: null | number = null;
    @Output() oChangeShift = new EventEmitter<null | number>();
    settingFormat: any = null;
    timeFormat: string = 'HH:mm a'

    shiftList: IShift[] = [
        {
            shift: 1,
            startNumber: 8,
            start: Helpers.dateTime.setHour(8),
            end: Helpers.dateTime.setHour(10),
            expired: moment().unix() * 1000 >= Helpers.dateTime.setHour(7),
        },
        {
            shift: 2,
            startNumber: 10,
            start: Helpers.dateTime.setHour(10),
            end: Helpers.dateTime.setHour(12),
            expired: moment().unix() * 1000 >= Helpers.dateTime.setHour(9),
        },
        {
            shift: 3,
            startNumber: 13,
            start: Helpers.dateTime.setHour(13),
            end: Helpers.dateTime.setHour(15),
            expired: moment().unix() * 1000 >= Helpers.dateTime.setHour(12),
        },
        {
            shift: 4,
            startNumber: 15,
            start: Helpers.dateTime.setHour(15),
            end: Helpers.dateTime.setHour(17),
            expired: moment().unix() * 1000 >= Helpers.dateTime.setHour(14),
        },
    ]



    constructor() {
        this.settingFormat = environment.FORMAT_SETTING;
        if (this.settingFormat) {
            this.timeFormat = this.settingFormat['time'] || this.timeFormat

            if (this.timeFormat) {
                this.timeFormat = this.timeFormat.replace(':ss', '');
            }
        }
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['bookingDate'] && changes['bookingDate'].currentValue) {
            this.updateExpired(this.bookingDate)
        }
    }

    updateExpired(date: any) {
        this.shiftList.forEach(shift => {
            shift.start = Helpers.dateTime.setHour(shift.startNumber, date);
            shift.end = Helpers.dateTime.setHour(shift.startNumber + 2, date);
            shift.expired = moment().unix() * 1000 >= Helpers.dateTime.setHour(shift.startNumber - 1, date);
        })
    }

    onChangeShift(shift: number | null) {
        if (this.shift === shift) {
            this.shift = null
        } else {
            this.shift = shift;
        }
        this.oChangeShift.emit(this.shift);
    }
}