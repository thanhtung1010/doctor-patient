import * as _ from "lodash";

export class HomePageModel {
    threadFilter: 'ALL' | 'FOLLOW' | number = 'ALL';

    constructor(_params: any) {
        if (_params) {
            if (_params['threadFilter']) {
                if (_.isNumber(_params['threadFilter'])) {
                    this.threadFilter = +_params['threadFilter'];
                } else {
                    this.threadFilter = _params['threadFilter'];
                }
            }
        }
    }

    // private checkForString(param: 'specialist' | 'content' | 'consult', value: any) {
    //     if (value && !_.isEmpty(value)) {
    //         this[param] = value;
    //     }
    // }
    // private checkForNumber(param: 'threadId', value: any) {
    //     if (value && !_.isNaN(+value)) {
    //         this[param] = +value;
    //     }
    // }
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