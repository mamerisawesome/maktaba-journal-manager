const checkAuth = (immediate, data, callback) => {
    window.gapi.auth.authorize({
        'client_id': process.env.REACT_APP_API_CLIENTID,
        'scope': process.env.REACT_APP_API_SCOPE,
        'immediate': immediate
    }, callback);
};

export { checkAuth };
