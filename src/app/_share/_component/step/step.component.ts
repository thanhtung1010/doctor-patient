import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'app-step',
    templateUrl: './step.component.html'
})

export class StepComponent implements OnInit {
    @Input() step: string[] = [];
    @Input() active: number = 0;
    @Output() activeChange = new EventEmitter<number>();

    constructor() { }

    ngOnInit(): void {
    }
}