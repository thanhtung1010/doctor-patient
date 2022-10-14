import { Component, Input, OnInit } from "@angular/core";
import { loadingType } from "../../_enum/loading.enum";

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html'
})

export class Loading implements OnInit {
    @Input() type: loadingType = loadingType.Dotcycle;

    constructor() { }

    ngOnInit(): void {
        console.log('loading')
    }
}