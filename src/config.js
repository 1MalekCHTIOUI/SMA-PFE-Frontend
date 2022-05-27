const config = {
    // basename: only at build time to set, and don't add '/' at end off BASENAME for breadcrumbs, also don't put only '/' use blank('') instead,
    // like '/berry-material-react/react/default'
    basename: '',
    defaultPath: '/dashboard/default',
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 12,
    // API_SERVER: 'http://localhost:5000/api/',
    // HOST: 'http://localhost:5000/'
    API_SERVER: 'https://sma-backend-01.herokuapp.com/api/',
    HOST: 'https://sma-backend-01.herokuapp.com/',
    CONTENT: 'https://res.cloudinary.com/sma-backend-storage/image/upload/v1653585335/sma_uploads/'
};

export default config;
