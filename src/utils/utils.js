import React from 'react';
import { toast } from 'react-toastify';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import logo from '../assets/logo.png';


const notifyDefault = (value) => toast(<div style={{display: 'flex', flexDirection: 'row', marginTop: '5px', marginBottom: '5px'}}><img alt="logo" src={logo} className="Toast-Logo" style={{marginRight: '15px', marginLeft: '15px', marginTop: 'auto', marginBottom: 'auto'}} /><span style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px', textAlign: 'center', width: '100%'}}>{value}</span></div>);
const notifySuccess = (value) => toast.success(<div style={{display: 'flex', flexDirection: 'row', marginTop: '5px', marginBottom: '5px'}}><CheckIcon style={{marginRight: '15px', marginLeft: '15px', marginTop: 'auto', marginBottom: 'auto'}} /><span style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px', textAlign: 'center', width: '100%'}}>{value}</span></div>);
const notifyInfo = (value, timeOut) => toast.info(<div style={{display: 'flex', flexDirection: 'row', marginTop: '5px', marginBottom: '5px'}}><InfoIcon style={{marginRight: '15px', marginLeft: '15px', marginTop: 'auto', marginBottom: 'auto'}} /><span style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px', textAlign: 'center', width: '100%'}}>{value}</span></div>, { autoClose: timeOut ? timeOut : 5000 });
const notifyWarning = (value) => toast.warn(<div style={{display: 'flex', flexDirection: 'row', marginTop: '5px', marginBottom: '5px'}}><WarningIcon style={{marginRight: '15px', marginLeft: '15px', marginTop: 'auto', marginBottom: 'auto'}} /><span style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px', textAlign: 'center', width: '100%'}}>{value}</span></div>);
const notifyError = (value) => toast.error(<div style={{display: 'flex', flexDirection: 'row', marginTop: '5px', marginBottom: '5px'}}><ErrorIcon style={{marginRight: '15px', marginLeft: '15px', marginTop: 'auto', marginBottom: 'auto'}} /><span style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px', textAlign: 'center', width: '100%'}}>{value}</span></div>);

const notifyDefaultPersistent = (value) => toast(<div style={{display: 'flex', flexDirection: 'row', marginTop: '5px', marginBottom: '5px'}}><img alt="logo" src={logo} className="Toast-Logo" style={{marginRight: '15px', marginLeft: '15px', marginTop: 'auto', marginBottom: 'auto'}} /><span style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px'}}>{value}</span></div>, {autoClose: false, hideProgressBar: true, closeOnClick: false, draggable: false, toastId: 0, closeButton: false});
const notifySuccessPersistent = (value) => toast.success(<div style={{display: 'flex', flexDirection: 'row', marginTop: '5px', marginBottom: '5px'}}><CheckIcon style={{marginRight: '15px', marginLeft: '15px', marginTop: 'auto', marginBottom: 'auto'}} /><span style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px'}}>{value}</span></div>, {autoClose: false, hideProgressBar: true, closeOnClick: false, draggable: false, toastId: 1, closeButton: false});
const notifyInfoPersistent = (value) => toast.info(<div style={{display: 'flex', flexDirection: 'row', marginTop: '5px', marginBottom: '5px'}}><InfoIcon style={{marginRight: '15px', marginLeft: '15px', marginTop: 'auto', marginBottom: 'auto'}} /><span style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px'}}>{value}</span></div>, {autoClose: false, hideProgressBar: true, closeOnClick: false, draggable: false, toastId: 2, closeButton: false});
const notifyWarningPersistent = (value) => toast.warn(<div style={{display: 'flex', flexDirection: 'row', marginTop: '5px', marginBottom: '5px'}}><WarningIcon style={{marginRight: '15px', marginLeft: '15px', marginTop: 'auto', marginBottom: 'auto'}} /><span style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px'}}>{value}</span></div>, {autoClose: false, hideProgressBar: true, closeOnClick: false, draggable: false, toastId: 3, closeButton: false});
const notifyErrorPersistent = (value) => toast.error(<div style={{display: 'flex', flexDirection: 'row', marginTop: '5px', marginBottom: '5px'}}><ErrorIcon style={{marginRight: '15px', marginLeft: '15px', marginTop: 'auto', marginBottom: 'auto'}} /><span style={{marginTop: 'auto', marginBottom: 'auto', marginRight: '10px'}}>{value}</span></div>, {autoClose: false, hideProgressBar: true, closeOnClick: false, draggable: false, toastId: 4, closeButton: false});

const notifyDismissAll =  () => toast.dismiss();
const notifyDismissOne =  (id) => toast.dismiss(id);


export default { notifyDefault, notifyDefaultPersistent, notifySuccess, notifyInfo, notifyWarning, notifyError, notifySuccessPersistent, notifyInfoPersistent, notifyWarningPersistent, notifyErrorPersistent, notifyDismissAll, notifyDismissOne };