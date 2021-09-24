import {IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonModal} from '@ionic/react';
import './Tab1.css';
import {useFilesystem} from "../hooks/useFilesystem";
import {useDateDiff} from "../hooks/useDateDiff";
import {useEffect, useState} from "react";
import {CountdownInterface} from "../interfaces/countdown.interface";
import {UpdateStateInterface} from "../interfaces/updateState.interface";
import {add} from "ionicons/icons";
import AddDateModal from "../components/AddDateModal";

const Tab1: React.FC<UpdateStateInterface> = ({update, setUpdate}: UpdateStateInterface) => {
    const {getHero} = useFilesystem();
    const {getDiffFromToday} = useDateDiff();
    const [hero, setHero] = useState<CountdownInterface>();
    const [days, setDays] = useState("0");

    useEffect(() => {
        getHero().then(countdown => {
            if (countdown) {
                setHero(countdown)
                setDays(getDiffFromToday(countdown.date).toString())
            }
        });
    }, [update])

    const handleDismiss = () => {
        dismiss();
    }

    const [present, dismiss] = useIonModal(AddDateModal, {
        update,
        setUpdate,
        onDismiss: handleDismiss
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{hero ? hero.name : "Countdown"}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{hero ? hero.name : "Countdown"}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                {hero ? <>
                        <IonCard>
                            <IonCardHeader>
                                <IonText color="primary">
                                    <h1 className="ion-text-center" style={{
                                        fontSize:
                                            `${Math.max(50 - 5 * days.length, 10)}vw`
                                    }}>
                                        {days}
                                    </h1>
                                </IonText>
                            </IonCardHeader>
                            <IonCardContent>
                                There are {days} days until {(new Date(hero.date)).toLocaleDateString()}.
                            </IonCardContent>
                        </IonCard>
                    </> :
                    <>
                        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton onClick={() => present()}>
                                <IonIcon icon={add}/>
                            </IonFabButton>
                        </IonFab>
                    </>}
            </IonContent>
        </IonPage>
    );
};

export default Tab1;
