import { NgModule } from "@angular/core";
import { AlertComponent } from './alert/alert.component';
import { LoadingIconComponent } from './loading-icon/loading-icon.component';
import { DynamicViewDirective } from './dynamic-view.directive';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AlertComponent,
        LoadingIconComponent,
        DynamicViewDirective,
        DropdownDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        LoadingIconComponent,
        DropdownDirective,
        DynamicViewDirective,
        CommonModule
    ],
    entryComponents: [AlertComponent]
})
export class SharedModule {}