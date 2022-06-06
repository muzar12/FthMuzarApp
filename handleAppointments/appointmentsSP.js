import firebase from "firebase";
import * as Notifications from 'expo-notifications';
import { Platform } from "react-native";

const datum = new Date()
const db = firebase.firestore();
const auth = firebase.auth();
let nd = "";
let sd = "";
let day = "";
let work = false;

function processSaving(ime, priimek, obiski, usid) {
  return new Promise((resolve) => {
    db
      .collection(nd.toDateString()) //dan v katerega shranimo
      .get()
      .then(querySnapshot => {
        sd = querySnapshot.size //koliko jih je že v tem danu shranjenih
        console.log("size: " + sd);
        querySnapshot.forEach(documentSnapshot => {
          console.log('User ID: ', documentSnapshot.id);
        });
        if (sd < 17) {
          saveNextdays(ime, priimek, obiski, usid, sd)
          console.log("je: " + sd);
          resolve("Done");
        } else {
          console.log("Drugi dan SP.");
          nd = new Date(datum.setDate(datum.getDate() + 1)) // gres na drugi dan
          day += 1;
          resolve("Next day");
        }
      })
  })
}

function rightDay() {
  return new Promise((resolve) => {
    if (day == '0') { //nedelja
      nd = new Date(datum.setDate(datum.getDate() + 1))
      day = 1;
      resolve("Nedelja")
    }
    else if (day == '6') { //sobota
      nd = new Date(datum.setDate(datum.getDate() + 2))
      day = 1;
      resolve("Sobota")
    }
    else {
      resolve("Ni sobota, ne nedelja.")
    }
  })
}

const saveNextdays = (ime, priimek, obiski, usid, st) => {
  for (let i = 0; i < parseInt(obiski); i++) {
    if (day == "6") {
      nd = new Date(datum.setDate(datum.getDate() + 2)) //ce je sobota dodamo 2 dni da pridemo na ponedeljek
      day = 1;
      i -= 1;
      console.log("Sobota");
    }
    else if (day == '0') { //nedelja
      nd = new Date(datum.setDate(datum.getDate() + 1))
      day = 1;
      i -= 1;
      console.log("Nedelja");
    }
    else {
      db
        .collection(nd.toDateString())
        .doc(usid + "_" + st)
        .set({
          name: ime,
          lastName: priimek,
          uid: usid
        })
      nd = new Date(datum.setDate(datum.getDate() + 1)) //gremo na naslednji dan
      day += 1;
      console.log("Dan shranjen.")
    }
  }
}

async function appointmentsSP(ime, priimek, obiski, usid) {
  nd = new Date(datum.setDate(datum.getDate() + 7))
  day = datum.getDay()
  try {
    while (!work) {
      const rday = await rightDay()
      console.log("Day is " + rday)
      const result = await processSaving(ime, priimek, obiski, usid)
      console.log("Work = " + result)
      if (result === "Done") {
        work = true;
      }
    }
    const trigger = new Date(datum.setDate(datum.getDate() - 8 - obiski));
    trigger.setMinutes(0);
    trigger.setSeconds(0);
    trigger.setHours(11);
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Obvestilo o terapiji !',
          body: 'Ne pozabite, čez 7 dni imate prvo terapijo pri Fizioterapiji Mužar !'
        },
        trigger,
      });
    } else {
      console.log("Expo notifications not supported on web.")
    }
  } catch (error) {
    console.log(error)
    console.log("NE DELA !")
  }
}

export default appointmentsSP