import {IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonList, IonPage, IonTitle, IonToolbar, useIonModal} from '@ionic/react';
import './Tab2.css';
import {useFilesystem} from "../hooks/useFilesystem";
import {useEffect, useState} from "react";
import CountdownListEntry from "../components/CountdownListEntry";
import {useDateDiff} from "../hooks/useDateDiff";
import AddDateModal from "../components/AddDateModal";
import {add} from "ionicons/icons";
import {UpdateStateInterface} from "../interfaces/updateState.interface";

const Tab2: React.FC<UpdateStateInterface> = ({update, setUpdate}: UpdateStateInterface) => {
        const {getHeroName, getAllDates} = useFilesystem();
        const {getDiffFromToday} = useDateDiff();
        const [hero, setHero] = useState<string | null>();
        const [dateList, setDateList] = useState<JSX.Element[]>([]);

        const handleDismiss = () => {
            dismiss();
        }

        const [present, dismiss] = useIonModal(AddDateModal, {
            update,
            setUpdate,
            onDismiss: handleDismiss
        });

        const updateList = async () => {
            const {value: newHero} = await getHeroName();
            setHero(newHero);

            const newDateList: JSX.Element[] = []
            let newDates = await getAllDates();
            newDates = newDates.sort((a, b) => getDiffFromToday(a.date) - getDiffFromToday(b.date))
            newDates.forEach(entry =>
                newDateList.push(<CountdownListEntry key={entry.name}
                                                     name={entry.name}
                                                     date={entry.date}
                                                     hero={newHero}
                                                     update={update}
                                                     setUpdate={setUpdate}/>));
            setDateList(newDateList);
        }

        useEffect(() => {
            updateList();
        }, [update])

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Countdown List</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        {dateList}
                    </IonList>
                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton onClick={() => present()}>
                            <IonIcon icon={add}/>
                        </IonFabButton>
                    </IonFab>
                </IonContent>
            </IonPage>
        );
    }
;

export default Tab2;
