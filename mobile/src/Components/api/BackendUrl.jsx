// const BackendUrl = 'http://203.129.217.246:8005' //live server
// const BackendUrl = 'http://192.168.29.190:8005' // stagging server
// const BackendUrl = 'http://192.168.0.202:8000' // local server
// const BackendUrl = 'http://192.168.0.240:86' // local server

const BackendUrl = import.meta.env.VITE_REACT_URL;

export default BackendUrl