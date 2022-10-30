import { Component, Input, OnInit } from "@angular/core";
import { loadingType } from "../../_enum/loading.enum";

@Component({
    selector: 'app-write-content',
    templateUrl: './write-content.component.html'
})

export class WriteContentComponent implements OnInit {
    // example conten

    constructor() { }

    ngOnInit(): void { }

    uploadImg(evt: any) {
        console.log(evt)
    }
}