import { Component, Input, OnInit } from "@angular/core";
import { loadingType } from "../../_enum/loading.enum";

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html'
})

export class LoadingComponent implements OnInit {
    @Input() type: loadingType = loadingType.dotcycle;
    LOADING_TYPE = loadingType;

    constructor() { }

    ngOnInit(): void {
        console.log('loading')
    }
}