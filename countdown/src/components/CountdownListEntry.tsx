import './CountdownListEntry.css';
import {IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNote} from "@ionic/react";
import {star, trash} from "ionicons/icons";
import {useDateDiff} from "../hooks/useDateDiff";
import {useFilesystem} from "../hooks/useFilesystem";
import React, {Dispatch, Ref, SetStateAction} from "react";

export interface CountdownListEntryProps {
    name: string;
    date: string;
    hero: string | null;
    update: boolean;
    setUpdate: Dispatch<SetStateAction<boolean>>;
}

const CountdownListEntry: React.FC<CountdownListEntryProps> = ({name, date, hero, update, setUpdate}: CountdownListEntryProps) => {
    const {setHero, deleteDate} = useFilesystem();
    const {getDiffFromToday} = useDateDiff();

    const setMeHero = async () => {
        await setHero({name});
        setUpdate(!update);
    };

    const deleteMe = async () => {
        await deleteDate({name});
        setUpdate(!update);
    };

    return (
        <IonItemSliding id={name}>
            <IonItem>
                <IonLabel>
                    <h2>{name}</h2>
                    <h3>Days remaining: {getDiffFromToday(date)}</h3>
                </IonLabel>
                <IonNote>Date: {new Date(date).toLocaleDateString()}</IonNote>
                {name === hero && <IonIcon color="primary" icon={star} slot="start"/> }
            </IonItem>
            <IonItemOptions side="start" onIonSwipe={setMeHero}>
                <IonItemOption expandable onClick={setMeHero}>
                    <IonIcon slot="icon-only" icon={star}/>
                </IonItemOption>
            </IonItemOptions>
            <IonItemOptions side="end" onIonSwipe={deleteMe}>
                <IonItemOption expandable color="danger" onClick={deleteMe}>
                    <IonIcon slot="icon-only" icon={trash}/>
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    );
};

export default CountdownListEntry;
