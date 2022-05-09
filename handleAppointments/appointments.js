import firebase from "firebase";

const db = firebase.firestore();
const auth = firebase.auth();
const datum = new Date()
let nd = "";
let sd = "";
let day = "";
let work = false;

const appointments = (ime, priimek, prednost, usid) => {
  day = datum.getDay()
  if (prednost == 'redno') {
    nd = datum.setDate(datum.getDate() + 270)
  }
  else if (prednost == 'hitro') {
    nd = datum.setDate(datum.getDate() + 180)
  }
  else if (prednost == 'zeloHitro') {
    nd = datum.setDate(datum.getDate() + 30)
  }
  while (!work) {
    if (day == '0') { //nedelja
      nd += 1;
      day = 1;
    }
    else if (day == '6') { //sobota
      nd += 2;
      day = 1;
    }
    db
      .collection('nd') //dan v katerega shranimo
      .get()
      .then((QuerySnapshot) => {
        sd = QuerySnapshot.size //koliko jih je že v tem danu shranjenih
        console.log('V tem danu jih je ' + sd);
      });
    if (sd < 6 && prednost == "redno") {
      //shrani ga 
      saveNext10days(ime, priimek, usid);
      work = true;
    }
    else if (sd < 10 && prednost == "hitro") {
      // shrani ga
      //saveNext10days();
      work = true;
    }
    else if (sd < 15 && prednost == "zeloHitro") {
      // shrani ga
      //saveNext10days(); 
      work = true;
    }
    else {
      nd += 1; // gres na drugi dan
    }
  }
}

const saveNext10days = (ime, priimek, usid) => {
  for (let i = 0; i < 10; i++) {
    if (day == '0') { //nedelja
      nd += 1;
      day = 1;
    }
    else if (day == "6") {
      nd += 2; //ce je sobota dodamo 2 dni da pridemo na ponedeljek
      day = 1;
    }
    else {
      db
        .collection(nd)
        .doc(datum.toDateString())
        .set({
          name: ime,
          lastName: priimek,
          userid: usid,
        })
        .then(() => {
          console.log('User added in ' + nd + " day.");
        });
      nd += 1; //gremo na naslednji dan
      day += 1;
    }
  }
}

export default appointments