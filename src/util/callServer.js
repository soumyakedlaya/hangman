const myHost = 'http://localhost:4000/';


//makes a get request to LinkedIn API to get the words. On success, call cbSucess. On failure, call cbFailure

export default function getData (url, cbSuccess, cbFailure) {
  fetch(myHost + url, {
      method: 'get',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }})
  .then((resp) =>
          resp.json()
          .then(function(data) {
            console.log("data is ", data)
            if(cbSuccess) {
                cbSuccess(data)
            }
          }).catch(function(error) {
            if(cbFailure) {
                cbFailure(error)
            }
          })
  );
}

// export default function submitData (url, data, cbSuccess, cbFailure) {
//   console.log("data: ", data);
//   fetch(myHost + url, {
//       method: 'post',
//       body: JSON.stringify(data),
//       headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//       }})
//   .then((resp) =>
//           resp.json()
//           .then(function(data) {
//             console.log("data is ", data)
//             if(cbSuccess) {
//                 cbSuccess(data)
//             }
//           }).catch(function(error) {
//             if(cbFailure) {
//                 cbFailure(error)
//             }
//           })
//   );
// }
