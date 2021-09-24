import {Dispatch, SetStateAction} from "react";

export interface UpdateStateInterface {
    update: boolean;
    setUpdate: Dispatch<SetStateAction<boolean>>;
}