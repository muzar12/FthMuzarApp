import firebase from "firebase";
import * as Notifications from 'expo-notifications';
import { sendEmail } from "../sendingMail/send-email";

const db = firebase.firestore();
const auth = firebase.auth();
const datum = new Date()
let nd = "";
let sd = 0;
let day = "";
let work = false;

function processSaving(ime, priimek, prednost, usid) {
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
        if (prednost == "redno" && sd < 6) {
          saveNext10days(ime, priimek, usid); //shrani ga 
          resolve("Done");
        }
        else if (prednost == "hitro" && sd < 10) {
          saveNext10days(ime, priimek, usid); //shrani ga 
          resolve("Done");
        }
        else if (prednost == "zeloHitro" && sd < 14) {
          saveNext10days(ime, priimek, usid); //shrani ga 
          resolve("Done");
        } else {
          console.log("Drugi dan napotnica.");
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

const saveNext10days = (ime, priimek, usid) => {
  for (let i = 0; i < 10; i++) {
    if (day == "6") {
      nd = new Date(datum.setDate(datum.getDate() + 2)) //sobota
      day = 1;
      i -= 1;
    }
    else if (day == '0') { //nedelja
      nd = new Date(datum.setDate(datum.getDate() + 1))
      day = 1;
      i -= 1;
    }
    else {
      db
        .collection(nd.toDateString())
        .doc(usid + "_" + sd)
        .set({
          name: ime,
          lastName: priimek,
          userid: usid,
        })
      nd = new Date(datum.setDate(datum.getDate() + 1)) //gremo na naslednji dan
      day += 1;
      console.log("Dan shranjen.")
    }
  }
}

async function appointments(ime, priimek, prednost, usid) {
  if (prednost == 'redno') {
    nd = new Date(datum.setDate(datum.getDate() + 270))
  }
  else if (prednost == 'hitro') {
    nd = new Date(datum.setDate(datum.getDate() + 180))
  }
  else if (prednost == 'zeloHitro') {
    nd = new Date(datum.setDate(datum.getDate() + 30))
  }
  else {
    console.log("Napaka prednost je: " + prednost)
  }
  day = datum.getDay()
  try {
    while (!work) {
      const rday = await rightDay()
      console.log("Day is " + rday)
      const result = await processSaving(ime, priimek, prednost, usid)
      console.log("Work = " + result)
      if (result === "Done") {
        work = true;
      }
    }
    const trigger = new Date(datum.setDate(datum.getDate() - 18));
    trigger.setMinutes(0);
    trigger.setSeconds(0);
    trigger.setHours(11);
    console.log(trigger + " triger");
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Obvestilo o terapiji !',
        body: 'Ne pozabite, čez 7 dni imate prvo terapijo pri Fizioterapiji Mužar !'
      },
      trigger,
    });
  } catch (error) {
    console.log(error)
    console.log("NE DELA !")
  }
}

export default appointments