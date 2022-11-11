import * as _ from "lodash";
import { IBookingInfor } from "../_interface";

export class BookingModel {
    doctorId: null | number = null;
    specialist: null | string = null;

    bookedAt: null | number | string | Date = null;
    bookedShift: null | number = null;
    content: string = '';
    consult: string | null = null;

    constructor(_params: IBookingInfor | null) {
        if (_params) {
            this.checkForString('specialist', _params['specialist']);
            this.checkForString('content', _params['content']);
            this.checkForString('consult', _params['consult']);

            this.checkForNumber('doctorId', _params['doctorId']);
            this.checkForNumber('bookedAt', _params['bookedAt']);
            this.checkForNumber('bookedShift', _params['bookedShift']);
        }
    }

    private checkForString(param: 'specialist' | 'content' | 'consult', value: any) {
        if (value && !_.isEmpty(value)) {
            this[param] = value;
        }
    }
    private checkForNumber(param: 'doctorId' | 'bookedAt' | 'bookedShift', value: any) {
        if (value && !_.isNaN(+value)) {
            this[param] = +value;
        }
    }
    //   private checkForBoolean(param: 'expand', value: any) {
    //     if (value) {
    //       if (_.isBoolean(value)) {
    //         this[param] = value;
    //       }
    //       else if (value === "true" || value === 'false') {
    //         this[param] = (value === "true");
    //       }
    //     }
    //   }
}