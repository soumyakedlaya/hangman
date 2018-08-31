const myHost = 'http://localhost:4000/';

//makes a get request to LinkedIn API to get the words. On success, call cbSucess. On failure, call cbFailure
export default function getData (url, cbSuccess, cbFailure) {
            fetch(myHost + url, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }})
                .then((resp) => {
                  resp.json();
                })
            .then(function(data) {
                if(cbSuccess) {
                    cbSuccess(data)
                }
            }).catch(function(error) {
                if(cbFailure) {
                    cbFailure(error)
                }
            });
}
