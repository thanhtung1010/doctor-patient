import { Component, HostListener, Input } from "@angular/core";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { KEY_CODE_WINDOW } from "app/_share/_enum";
import { IPost } from "app/_share/_interface";

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html'
})

export class PostComponent {
    @Input() textOnly: boolean = false;
    @Input() postInfor: IPost | null = null;

    visibleFullPostModal: boolean = false;
    editorConfig: AngularEditorConfig = {
        editable: false,
        spellcheck: false,
        height: 'auto',
        minHeight: '300px',
        width: 'auto',
        minWidth: '0',
        translate: 'no',
        enableToolbar: false,
        showToolbar: false,
        uploadWithCredentials: false,
        sanitize: false,
    }

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        const keyCode = event.keyCode
        if (keyCode === KEY_CODE_WINDOW.ESCAPE && this.visibleFullPostModal) {
            this.visibleFullPostModal = false
        }
    }
    constructor() { }

    onToggleVisibleFullPost(visible: boolean) {
        this.visibleFullPostModal = visible;
    }
}