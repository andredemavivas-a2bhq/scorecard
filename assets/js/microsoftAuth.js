async function login(){
    console.log('running');
    const config = {
        auth: {
            clientId: '88dbae84-91c8-4ea5-bbdd-cdbdcf47b092',
            authority: 'https://login.microsoftonline.com/common/',
            redirectUri: 'http://localhost:5500/Scorecard_HTML.htm'
        }
    };

    var client = new Msal.UserAgentApplication(config);
    var request = {
        scopes: [ 'user.read' ]
    };
    let loginResponse = await client.loginPopup(request);
    console.log(loginResponse);
    $('#userName').text(loginResponse.account.name);
    localStorage.setItem('userId', loginResponse.uniqueId);
    localStorage.setItem('userName', loginResponse.account.name);
    location.reload();
}

$('.modal-container').on('click', '#login', function(){
    login();
});

$('#logout').on('click', function(){
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    location.reload();
    window.localStorage.clear();
});