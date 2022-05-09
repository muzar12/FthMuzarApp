import firebase from "firebase";

const datum = new Date()
const db = firebase.firestore();
const auth = firebase.auth();
let nd = "";
let sd = "";
let day = "";
let work = false;

const appointmentsSP = (ime, priimek, obiski, usid) => {
  nd = new Date (datum.setDate(datum.getDate() + 7))
  day = datum.getDay()
  while (!work) {
    if (day == '0') { //nedelja
      nd = new Date (datum.setDate(datum.getDate() + 1))
      day = 1;
    }
    else if (day == '6') { //sobota
      nd = new Date (datum.setDate(datum.getDate() + 2))
      day = 1;
    }
    db
      .collection('nd') //dan v katerega shranimo
      .get()
      .then((QuerySnapshot) => {
        sd = QuerySnapshot.size //koliko jih je že v tem danu shranjenih
        console.log('V tem danu jih je ' + sd);
      });
    if (sd < 17) {
      //shrani ga 
      saveNextdays(ime, priimek, obiski, usid);
      work = true;
    }
    else {
      nd = new Date (datum.setDate(datum.getDate() + 1)) // gres na drugi dan
    }
  }
}

const saveNextdays = (ime, priimek, obiski, usid) => {
  for (let i = 0; i < parseInt(obiski); i++) {
    if (day == "6") {
      nd = new Date(datum.setDate(datum.getDate() + 2)) //ce je sobota dodamo 2 dni da pridemo na ponedeljek
      day = 1; 
    }
    else if (day == '0') { //nedelja
      nd = new Date (datum.setDate(datum.getDate() + 1))
      day = 1;
    }
    else {
      db
        .collection(nd.toDateString())
        .doc(usid)
        .set({
          name: ime,
          lastName: priimek,
        })
        .then(() => {
          console.log('User added in ' + nd + " day.");
        });
      nd = new Date (datum.setDate(datum.getDate() + 1)) //gremo na naslednji dan
      day +=1;
    }
  }
}

export default appointmentsSP