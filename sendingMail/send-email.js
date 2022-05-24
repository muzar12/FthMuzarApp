// We can use react-native Linking to send email
import qs from 'qs';
import { Linking } from 'react-native';

export async function sendEmail(to, subject, body, options = {}) {
    const { cc, bcc } = options;

    let url = `mailto:${to}`;

    // Create email link query
    const query = qs.stringify({
        subject: subject,
        body: body,
        cc: cc,
        bcc: bcc
    });

    if (query.length) {
        url += `?${query}`;
    }

    // check if we can use this link
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
        throw new Error('Provided URL can not be handled');
    }else{
        console.log("Email sent to: " + to);
    }

    return Linking.openURL(url);
}

/*import React from 'react'
import Schedule from 'react-schedule-job'
import 'react-schedule-job/dist/index.css'
// copy and paste this code and run in your project!
    
const function_1 = () => {};
  

    
const jobs = [
      {
        fn: function_1,
        id: '1',
        schedule: '0 11 8 2 *',   //minuta, ura, dan, mesec
      }
    ]
    
const App = () => {
    return (
      <Schedule 
        jobs={jobs}
        timeZone='Europe/Belgrade'
        dashboard={{ hidden: false }}
      />
    )
}
    
export default App*/


/*db
      .collection("Users")
      .doc(usid)
      .get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
            const userData = docSnapshot.data()
            const email = userData[2];
            console.log(userData)
            sendEmail(email, "Obvestiolo o terapiji !", "Čez 7 dni imate prvo terapijo ! lep pozdrav Fizioterapija Mužar.").then(() => {
              console.log('Your message was successfully sent!');
          });
        }
      });*/

export default sendEmail