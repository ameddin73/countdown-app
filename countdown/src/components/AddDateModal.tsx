import {IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar} from "@ionic/react";
import moment from "moment/moment";
import {useFilesystem} from "../hooks/useFilesystem";
import {Dispatch, SetStateAction, useState} from "react";
import {closeOutline} from "ionicons/icons";
import {UpdateStateInterface} from "../interfaces/updateState.interface";

export interface AddDateModalInterface extends UpdateStateInterface{
    onDismiss: () => void;
}

const AddDateModal: React.FC<AddDateModalInterface> = ({update, setUpdate, onDismiss}: AddDateModalInterface) => {
    const {getAllDates, saveDate, setHero} = useFilesystem();
    const [name, setName] = useState("");
    const [date, setDate] = useState("");

    const addDate = async () => {
        const allDates = await getAllDates();
        if (name && date) {
            if (allDates.every(entry => entry.name !== name)) {
                await saveDate({
                    name: name,
                    date: date
                });
                if (allDates.length ===0)
                    await setHero({name});
                setName("");
                setDate("");
                setUpdate(!update)
                onDismiss();
            } else {
                alert(`${name} already exists`);
            }
        } else {
            alert("Must set name and date.");
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Add Countdown</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="primary" expand="block" onClick={
                            () => onDismiss()}>
                            <IonIcon slot="icon-only" icon={closeOutline}/>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent scrollEvents={false}>
                <IonItem>
                    <IonLabel position="floating">Name</IonLabel>
                    <IonInput value={name} onIonChange={e => setName(e.detail.value!)}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Date</IonLabel>
                    <IonDatetime min={moment().toISOString()} max="3000" value={date} onIonChange={e => setDate(e.detail.value!)}/>
                </IonItem>
                <IonButton className="ion-margin-top" type="submit" expand="block" onClick={addDate}>Add Date</IonButton>
            </IonContent>
        </IonPage>
    )
}

export default AddDateModal;