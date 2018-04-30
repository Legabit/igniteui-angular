import { CommonModule } from "@angular/common";
import {
    AfterViewInit,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    NgModule,
    Output,
    QueryList,
    Renderer,
    ViewChild,
    ViewChildren
} from "@angular/core";
import { IgxToggleDirective, IgxToggleModule } from "../directives/toggle/toggle.directive";
import { IgxDropDownItemComponent } from "./drop-down-item.component";

export interface ISelectionEventArgs {
    oldSelection: IgxDropDownItemComponent;
    newSelection: IgxDropDownItemComponent;
    event?: Event;
}

@Component({
    selector: "igx-drop-down",
    templateUrl: "./drop-down.component.html"
})
export class IgxDropDownComponent implements AfterViewInit {
    private _selectedItem: IgxDropDownItemComponent = null;
    private _initiallySelectedItem: IgxDropDownItemComponent = null;
    private _focusedItem: IgxDropDownItemComponent = null;
    private _defaultWidth = "200px";
    private _defaultHeight = "200px";

    @ViewChild(IgxToggleDirective) public toggle: IgxToggleDirective;
    @ContentChildren(IgxDropDownItemComponent, { read: IgxDropDownItemComponent }) public items: QueryList<IgxDropDownItemComponent>;
    @Output() public onSelection = new EventEmitter<ISelectionEventArgs>();
    @Output() public onOpen = new EventEmitter();
    @Output() public onClose = new EventEmitter();

    constructor(private elementRef: ElementRef, private renderer: Renderer) { }

    get selectedItem(): IgxDropDownItemComponent {
        return this._selectedItem;
    }
    set selectedItem(item: IgxDropDownItemComponent) {
        if (item === this.selectedItem) {
            return;
        }

        this._selectedItem = item;
    }

    get initialSelectionChanged() {
        return this.selectedItem !== this._initiallySelectedItem;
    }

    @Input() public width = this._defaultWidth;
    @Input() public height = this._defaultHeight;

    focusFirst() {
        let focusedItemIndex = 0;
        while ((this.items.toArray()[focusedItemIndex]) && ((this.items.toArray()[focusedItemIndex]).isDisabled
            || (this.items.toArray()[focusedItemIndex]).isHeader)) {
            focusedItemIndex++;
        }
        if (focusedItemIndex < this.items.length - 1) {
            if (this._focusedItem) {
                this._focusedItem.isFocused = false;
            }
            this._focusedItem = this.items.toArray()[focusedItemIndex];
            this._focusedItem.isFocused = true;
        }

        // const rect = this._focusedItem.element.nativeElement.getBoundingClientRect();
        // const parentRect = this.toggle.element.getBoundingClientRect();
        // if (parentRect.top > rect.top) {
        //     this.toggle.element.scrollTop -= (parentRect.top - rect.bottom + rect.height);
        // }
    }

    focusLast() {
        let focusedItemIndex = (this.items.length - 1);
        while ((this.items.toArray()[focusedItemIndex]) && ((this.items.toArray()[focusedItemIndex]).isDisabled
            || (this.items.toArray()[focusedItemIndex]).isHeader)) {
            focusedItemIndex--;
        }
        if (focusedItemIndex < this.items.length) {
            if (this._focusedItem) {
                this._focusedItem.isFocused = false;
            }
            this._focusedItem = this.items.toArray()[focusedItemIndex];
            this._focusedItem.isFocused = true;
        }

        // const rect = this._focusedItem.element.nativeElement.getBoundingClientRect();
        // const parentRect = this.toggle.element.getBoundingClientRect();
        // if (parentRect.bottom < rect.bottom) {
        //     this.toggle.element.scrollTop += (rect.bottom - parentRect.bottom);
        // }
    }

    focusNext() {
        let focusedItemIndex = -1;
        if (this._focusedItem) {
            focusedItemIndex = this._focusedItem.index;
        }
        while (this.items.toArray()[focusedItemIndex + 1] &&
            (this.items.toArray()[focusedItemIndex + 1].isDisabled || this.items.toArray()[focusedItemIndex + 1].isHeader)) {
            focusedItemIndex++;
        }
        if (focusedItemIndex < this.items.length - 1) {
            if (this._focusedItem) {
                this._focusedItem.isFocused = false;
            }
            this._focusedItem = this.items.toArray()[focusedItemIndex + 1];
            this._focusedItem.isFocused = true;
        }

        // const rect = this._focusedItem.element.nativeElement.getBoundingClientRect();
        // const parentRect = this.toggle.element.getBoundingClientRect();
        // if (parentRect.bottom < rect.bottom) {
        //     this.toggle.element.scrollTop += (rect.bottom - parentRect.bottom);
        // }
    }

    focusPrev() {
        if (this._focusedItem) {
            let focusedItemIndex = this._focusedItem.index;
            while ((this.items.toArray()[focusedItemIndex - 1]) &&
                (this.items.toArray()[focusedItemIndex - 1].isDisabled || this.items.toArray()[focusedItemIndex - 1].isHeader)) {
                focusedItemIndex--;
            }
            if (focusedItemIndex > 0) {
                this._focusedItem.isFocused = false;
                this._focusedItem = this.items.toArray()[focusedItemIndex - 1];
                this._focusedItem.isFocused = true;
            }

            // const rect = this._focusedItem.element.nativeElement.getBoundingClientRect();
            // const parentRect = this.toggle.element.getBoundingClientRect();
            // if (parentRect.top > rect.top) {
            //     this.toggle.element.scrollTop -= (parentRect.top - rect.bottom + rect.height);
            // }
        }
    }

    ngAfterViewInit() {
        this.toggle.element.style.zIndex = 10000;
        this.toggle.element.style.position = "absolute";
        this.toggle.element.style.overflowY = "auto";
    }

    changeSelectedItem(closeDropDown: boolean, event?) {
        const oldSelection = this.selectedItem;
        const newSelection = this._focusedItem;
        this.selectedItem = newSelection;
        const args: ISelectionEventArgs = { oldSelection, newSelection, event };
        this.onSelection.emit(args);
        if (closeDropDown) {
            this.toggle.close(true);
        }
    }

    close() {
        if (this._focusedItem) {
            this._focusedItem.isFocused = false;
        }

        this.onClose.emit();
    }

    open() {
        if (!this.selectedItem && this.items.length > 0) {
            this.selectedItem = this.items.toArray()[0];
        }
        this._initiallySelectedItem = this.selectedItem;
        this._focusedItem = this.selectedItem;
        if (this.selectedItem) {
            this._focusedItem.isFocused = true;
            this.selectedItem.element.nativeElement.scrollIntoView(true);
        }

        this.onOpen.emit();
    }

    toggleDropDown() {
        this.toggle.toggle(true);
    }

    private scrollToItem(item: IgxDropDownItemComponent) {
        const totalHeight: number = this.items.reduce((sum, currentItem) => sum + currentItem.elementHeight, 0);
        let itemPosition = 0;
        itemPosition = this.items
            .filter((itemToFilter) => itemToFilter.index < item.index)
            .reduce((sum, currentItem) => sum + currentItem.elementHeight, 0);

        this.toggle.element.scrollTop = (Math.floor(itemPosition));
    }
}

@NgModule({
    declarations: [IgxDropDownComponent, IgxDropDownItemComponent],
    exports: [IgxDropDownComponent, IgxDropDownItemComponent],
    imports: [CommonModule, IgxToggleModule]
})
export class IgxDropDownModule { }
