import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { RichTextEditorComponent } from "@syncfusion/ej2-angular-richtexteditor";
import { loadingType } from "../../_enum/loading.enum";

@Component({
    selector: 'app-write-content',
    templateUrl: './write-content.component.html'
})

export class WriteContentComponent implements OnInit {
    @ViewChild('richTextEditor') rteObj: RichTextEditorComponent | null = null;
    content: any = null;
    customToolbar = {
        items: ['Bold', 'Italic', 'Undo', 'Redo', 'Image', 'CreateLink']
    };
    insertImageSettings = {
        saveUrl: 'https://med-service-demo.herokuapp.com/api/upload',
    }

    constructor() { }

    ngOnInit(): void { }

    uploadImg(env: any, type: string) {
        console.log(env, type)
        if (type === 'imageSelected') {
            return {
                ...env,
                cancel: true
            }
        }
    }

    imageSelected(evt: any) {
        if (this.rteObj) {
            console.log(evt)
            console.log(this.rteObj)
        }
    }

    imageUploadSuccess(args: any) {
        if (args.e.currentTarget.getResponseHeader('name') != null) {
            args.file.name = args.e.currentTarget.getResponseHeader('name');
            let filename: any = document.querySelectorAll(".e-file-name")[0];
            filename.innerHTML = args.file.name.replace(document.querySelectorAll(".e-file-type")[0].innerHTML, '');
            filename.title = args.file.name;
        }
    }

    onChangeContent(evt: any) {
        console.log(evt, 'onchange')
    }
}