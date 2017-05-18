import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Address} from "../models/address.model";
import {ModelUtils} from "../util/model.util";

export interface IParticipantSelectionResolver {

    isParticipantSelected(address: Address, fieldName?: string): boolean;

}

@Component({
    moduleId: module.id,
    selector: "address-form",
    templateUrl: "address.form.html",
    styleUrls: ["address.form.css"]
})
export class AddressForm {

    _address: Address;
    model: Address;
    get address(): Address {
        return this._address;
    }
    @Input()
    set address(address: Address) {
        this._address = address;
        this.model = this.clone(address);
    }

    @Input() resolver: IParticipantSelectionResolver;

    @Output() onAddressChanged: EventEmitter<Address> = new EventEmitter<Address>();
    @Output() onCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onFieldFocused: EventEmitter<string> = new EventEmitter<string>();

    public save(): void {
        this.onAddressChanged.emit(this.model);
    }

    public reset(): void {
        this.model = this.clone(this.address);
    }

    public cancel(): void {
        this.reset();
        this.onCanceled.emit(true);
    }

    public clone(address: Address): Address {
        return ModelUtils.clone(address);
    }

    public isDirty(): boolean {
        if (this.model.name !== this.address.name) {
            return true;
        }
        if (this.model.address1 !== this.address.address1) {
            return true;
        }
        if (this.model.address2 !== this.address.address2) {
            return true;
        }
        if (this.model.city !== this.address.city) {
            return true;
        }
        if (this.model.state !== this.address.state) {
            return true;
        }
        if (this.model.zip !== this.address.zip) {
            return true;
        }
        if (this.model.country !== this.address.country) {
            return true;
        }
        return false;
    }

    public focusOn(fieldName: string): void {
        this.onFieldFocused.emit(fieldName);
    }

    public focusAway(fieldName: string): void {
        this.onFieldFocused.emit(null);
    }

    public isParticipantSelected(fieldName: string): boolean {
        if (this.resolver) {
            return this.resolver.isParticipantSelected(this.address, fieldName);
        }
    }

}