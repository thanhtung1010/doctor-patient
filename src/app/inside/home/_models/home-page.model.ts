import * as _ from "lodash";

export class HomePageModel {
    threadId: null | number = null;

    constructor(_params: any) {
        if (_params) {
            if (_params['threadId']) {
                this.threadId = +_params['threadId'];
            } else {
                this.threadId = null;
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