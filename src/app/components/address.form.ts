import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Address} from "../models/address.model";

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

    @Output() onAddressChanged: EventEmitter<Address> = new EventEmitter<Address>();
    @Output() onCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();

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
        let rval: Address = new Address();
        rval.name = address.name;
        rval.address1 = address.address1;
        rval.address2 = address.address2;
        rval.city = address.city;
        rval.state = address.state;
        rval.zip = address.zip;
        rval.country = address.country;
        return rval;
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

}