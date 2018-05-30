const functions = require('firebase-functions');
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
var firestore = admin.firestore();

var oauth2 = new OAuth2("177755066264997",
  "18f0561a7b8be39b3a2f99c879e61a7d",
  "", "https://www.facebook.com/dialog/oauth",
  "https://graph.facebook.com/oauth/access_token",
  null);

exports.webhook = functions.https.onRequest((request, response) => {
 
    

    switch (request.body.result.action) {

        case 'details':


						let params = request.body.result.parameters;
						var data = {
						 
								Name: params.Name,
								Phone: params.Phone,
								City: params.City,
								State: params.State,
								BloodType: params.BloodType,
								fbid = req.body.originalRequest.data.sender.id
						}
						firestore.collection('donors').add(data)
							.then(() => {

								response.send({
									speech:
										`Hi ${params.Name} You are successfully registered to Blood Community. Thank You!!`
								});
							})
							.catch((e => {

								console.log("error: ", e);

								response.send({
									speech: "something went wrong when writing on database"
								});
							}))
            break;
            
            
            case 'getData':
			
					let param = request.body.result.parameters;


                    firestore.collection('donors').where('City', '==', param.reqcity).where('BloodType', '==', param.reqblood).get()
					
					 .then((querySnapshot) => {

                    var donors = [];
                    querySnapshot.forEach((doc) => { donors.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    // converting array to speech
                    var speech = `Details :  \n`;

                    donors.forEach((eachDonor, index) => {
                        speech += ` ${index + 1}. ${eachDonor.Name} - ${eachDonor.Phone}  \n`
                    })

                    response.send({
                        speech: speech
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "something went wrong when reading from database"
                    })
                })
						
            break;
            

        case 'countDonors':

            firestore.collection('donors').get()
                .then((querySnapshot) => {

                    var donors = [];
                    querySnapshot.forEach((doc) => { donors.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    response.send({
                        speech: `you have ${donors.length} donors, would you like to see them? (yes/no)`
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "something went wrong when reading from database"
                    })
                })

            break;

        case 'donorList':

            firestore.collection('donors').get()
                .then((querySnapshot) => {

                    var donors = [];
                    querySnapshot.forEach((doc) => { donors.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    // converting array to speech
                    var speech = `here are your orders \n`;

                    donors.forEach((eachDonor, index) => {
                        speech += ` ${index + 1}. ${eachDonor.Name} in ${eachDonor.City} with ${eachDonor.BloodType} is ready to give blood. you can contact on ${eachDonor.Phone} \n`
                    })

                    response.send({
                        speech: speech
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "something went wrong when reading from database"
                    })
                })

            break;
			
			

        default:
            response.send({
                speech: "no action matched in webhook"
            })
    }
});
