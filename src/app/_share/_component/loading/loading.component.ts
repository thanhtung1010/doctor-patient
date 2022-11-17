import { Component, Input, OnInit } from "@angular/core";
import { loadingType } from "../../_enum/loading.enum";

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html'
})

export class LoadingComponent {
    @Input() type: loadingType = loadingType.dotCycle;
    LOADING_TYPE = loadingType;

    constructor() { }
}