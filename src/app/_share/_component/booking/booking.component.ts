import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Helpers } from "app/_cores/_helpers";
import { ROUTING_DEFINED } from "app/_share/_enum";
import { getSystemMsgByCode } from "app/_share/_enum/errors.enum";
import { IBookingInfor, IDoctorInfor } from "app/_share/_interface";
import { BookingModel } from "app/_share/_models/booking.model";
import { BookingService, SessionService } from "app/_share/_services";
import { environment } from "environments/environment";
import * as _ from "lodash";
import * as moment from "moment";
import { NzMessageService } from "ng-zorro-antd/message";
import { loadingType } from "../../_enum/loading.enum";

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html'
})

export class BookingComponent implements OnInit {
    @Input() showBtn: boolean = true;
    @Output() oSubmitSuccess = new EventEmitter();
    isLogged: boolean = false;
    step = {
        steps: ['BOOKING.SERVICE', 'BOOKING.ORDER', 'BOOKING.APPOINTMENT_INFORMATION'],
        active: 0
    }
    data = {
        doctorListRaw: [] as IDoctorInfor[],
        doctorList: [] as IDoctorInfor[],
        specialists: [] as string[],
        consultationPackage: [],
        consultList: [
            'COUNSELING_AT_HOME',
            'ONLINE_CONSULTATION',
            'COUNSELING_AT_THE_CLINIC'
        ],
        visibleBookingModal: false,
        firstStepValid: false,
        secondStepValid: false,
        thirstStepValid: false,
    }
    bookingInfor: IBookingInfor = {
        doctorId: null,
        specialist: '',

        bookedAt: null,
        shift: null,
        consult: null,
        content: ''
    }
    loading = {
        doctor: false,
        submit: false
    }
    defautlFormat: any = null;
    dateFormatForEdit: string = '';
    _dateFormatForShow: string = '';

    constructor(
        private bookingSer: BookingService,
        private translate: TranslateService,
        private msg: NzMessageService,
        private sessionSer: SessionService,
        private _router: Router,
    ) {
        this.isLogged = this.sessionSer.isLogged();
        this.defautlFormat = environment.FORMAT_SETTING
        if (this.defautlFormat) {
            this._dateFormatForShow = this.defautlFormat.date;
            this.dateFormatForEdit = this._dateFormatForShow ? this._dateFormatForShow.replace('DD', 'dd').replace('YYYY', 'yyyy') : '';
        }
    }

    ngOnInit(): void {
        this.initData();
    }

    initData() {
        this.getAllDoctor();
    }

    getAllDoctor() {
        this.loading.doctor = true;
        this.bookingSer.getAllDoctor().subscribe({
            next: resp => {
                if (resp && resp.data && resp.data.length) {
                    this.data.doctorListRaw = [...resp.data.map((doctor: any) => {
                        return {
                            ...doctor,
                            specialist: (doctor.specialist || '').toUpperCase(),
                        }
                    })]
                    this.getSpecialList(this.data.doctorListRaw);
                } else {
                    this.data.doctorListRaw = [];
                    this.data.specialists = [];
                }
                this.loading.doctor = false;
            },
            error: err => {
                this.showError(err['code'] || 8);
            },
            complete: () => { },
        });
    }

    getSpecialList(list: IDoctorInfor[]) {
        this.data.specialists = _.union(list.map(item => { return item.specialist }))
    }

    gotoStep(step: number) {
        this.step.active += step;
    }

    showError(code: string) {
        const _msg = getSystemMsgByCode(code || '8') as string;
        this.msg.error(this.translate.instant(_msg));
    }

    showSuccess() {
        this.msg.success(this.translate.instant('STATUS.SUCCESS'));
    }

    onchange(evt: any, type: string | null = null) {
        switch (type) {
            // step 1
            case 'doctorId':
                this.bookingInfor.doctorId = evt;
                break;
            case 'specialist':
                this.bookingInfor.specialist = evt;
                this.bookingInfor.doctorId = null;
                this.getDoctorBySpecialist();
                break;
            // step 2
            case 'shifts':
                this.bookingInfor.shift = evt;
                break;
            case 'bookedAt':
                this.bookingInfor.bookedAt = moment(evt).hours(0).unix() * 1000;
                this.getBookedAtList();
                break;
            // step 3
            case 'content':
                this.bookingInfor.content = evt;
                break;
            default:
                break;
        }
        this.checkValidStep();
    }

    getBookedAtList() {
        const _params = {
            bookedAt: this.bookingInfor.bookedAt,
            doctorId: this.bookingInfor.doctorId
        }
        this.bookingSer.getBookedListByDay(_params).subscribe({
            next: resp => { },
            error: (error) => { },
            complete: () => { }
        });
    }

    getDoctorBySpecialist() {
        const _doctorsRaw = [...this.data.doctorListRaw];
        this.data.doctorList = _doctorsRaw.filter(doctor => doctor.specialist === this.bookingInfor.specialist);
    }

    onToggleBookingModal(evt: boolean) {
        this.data.visibleBookingModal = evt;
    }

    checkValidStep() {
        this.data.firstStepValid = this.validStep(0);
        this.data.secondStepValid = this.validStep(1);
        this.data.thirstStepValid = this.validStep(2);
    }

    validStep(step: number): boolean {
        switch (step) {
            case 2:
                return !_.isEmpty(this.bookingInfor.content)
            case 1:
                return !_.isNull(this.bookingInfor.bookedAt) && !_.isNaN(this.bookingInfor.bookedAt)
                    && !_.isNull(this.bookingInfor.shift) && !_.isNaN(this.bookingInfor.shift)

            default:
                return !_.isNull(this.bookingInfor.specialist) && !_.isEmpty(this.bookingInfor.specialist)
                    && !_.isNull(this.bookingInfor.doctorId) && !_.isNaN(this.bookingInfor.doctorId)
                    && !_.isNull(this.bookingInfor.consult) && !_.isEmpty(this.bookingInfor.consult)
        }
    }

    onClickSubmit() {
        if (this.isLogged) {
            this.loading.submit = true;
            this.bookingSer.book({ ...this.bookingInfor }).subscribe({
                next: resp => {
                    this.showSuccess();
                    this.loading.submit = false;
                    this.onToggleBookingModal(false);
                    this.onEmitSucces();
                },
                error: error => {
                    this.showError(error['error'] ? error['error'].code || 8 : 8);
                    this.loading.submit = false;
                },
                complete: () => {
                    this.loading.submit = false;
                },
            });
        } else {
            this.goToURL(ROUTING_DEFINED.OUTSIDE, {
                ...this.bookingInfor,
                signUp: true
            });
        }
    }

    getDoctorNameById(type: string, evt: any): string {
        switch (type) {
            case 'doctorName':
                if (!evt || !_.isNumber(evt)) return ''
                const _doc = this.data.doctorListRaw.find(doc => doc.id === evt);
                return _doc ? _doc.fullName || '' : ''
            case 'shift':
                if (!evt || !_.isNumber(evt)) return ''
                return Helpers.dateTime.getShift(evt)
            default:
                return ''
        }
    }

    goToURL(url: string, param?: Params) {
        if (url) {
            if (param) {
                this._router.navigate([url], { queryParams: param });
            }
            else {
                this._router.navigate([url]);
            }
        }

    }

    onEmitSucces() {
        this.step.active = 0;
        this.bookingInfor = new BookingModel(null);
        this.oSubmitSuccess.emit();
    }
}