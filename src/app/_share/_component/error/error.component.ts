import { Component, Input, OnInit } from "@angular/core";
import { loadingType } from "../../_enum/loading.enum";

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html'
})

export class ErrorComponent implements OnInit {
    @Input() control: any;

    constructor() { }

    ngOnInit(): void {
        console.log('error')
    }
}