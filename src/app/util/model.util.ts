import {Address} from "../models/address.model";

export class ModelUtils {

    public static clone(address: Address): Address {
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

}