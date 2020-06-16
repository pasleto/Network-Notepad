import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button  from 'react-bootstrap/Button';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import utils from '../../utils';
import Axios from 'axios';
const Netmask = require('netmask').Netmask;

const useStyles = makeStyles((theme) => ({
    formControlPrefix: {
      margin: theme.spacing(1),
      width: "85%",
      marginBottom: "15px"
    },
    inputLabelPrefix: {

    },
    inputSelectPrefix: {

    },
    menuItemPrefix: {
      paddingTop: "10px",
      paddingBottom: "10px",
    },
    formControlNetworkName: {
        margin: theme.spacing(1),
        width: "85%",
        marginBottom: "15px"
    },
    textFieldNetworkName: {
        
    },
    formControlNetworkDescription: {
        margin: theme.spacing(1),
        width: "85%",
        marginBottom: "15px"
    },
    textFieldNetworkDescription: {
        
    },
    formControlNetworkAddress: {
        margin: theme.spacing(1),
        width: "85%",
        marginBottom: "15px"
    },
    textFieldNetworkAddress: {
        textAlign: "center"
    },
    formControlNetworkMask: {
        margin: theme.spacing(1),
        width: "85%",
        marginBottom: "15px"
    },
    textFieldNetworkMask: {
        textAlign: "center"
    }
  }));

  const prefixArray = {
      30: '255.255.255.252',
      29: '255.255.255.248',
      28: '255.255.255.240',
      27: '255.255.255.224',
      26: '255.255.255.192',
      25: '255.255.255.128',
      24: '255.255.255.0',
      23: '255.255.254.0',
      22: '255.255.252.0',
      21: '255.255.248.0',
      20: '255.255.240.0'
  };

function CreateNetworkBox(props) {
    const classes = useStyles();
    const [networkPrefix, setNetworkPrefix] = React.useState(30);
    const [networkName, setNetworkName] = React.useState('');
    const [networkAddress, setNetworkAddress] = React.useState('');
    const [networkDescription, setNetworkDescription] = React.useState('');
    const [networkMask, setNetworkMask] = React.useState(prefixArray[networkPrefix]);
    const [networkAddressError, setNetworkAddressError] = React.useState(false);

    const handleNetworkPrefixChange = (event) => {
      setNetworkPrefix(event.target.value);
      setNetworkMask(prefixArray[event.target.value]);
    };

    const handleNetworkNameChange = (event) => {
        setNetworkName(event.target.value);
    };

    const handleNetworkAddressChange = (event) => {
        setNetworkAddress(event.target.value);
    };

    const handleNetworkDescriptionChange = (event) => {
        setNetworkDescription(event.target.value);
    };

    const createNewNetwork = async (payload) => {
        const cidrIP = `${payload.networkAddress}/${payload.networkPrefix}`;
        const cidrBlock = new Netmask(cidrIP);
        const ipArray = [];

        const newNetwork = {
            name: payload.networkName,
            networkIP: cidrBlock.base,
            networkPrefix: cidrBlock.bitmask,
            startIP: cidrBlock.first,
            endIP: cidrBlock.last,
            broadcastIP: cidrBlock.broadcast,
            networkMask: cidrBlock.mask,
            description: payload.networkDescription
        };

        cidrBlock.forEach(ip => ipArray.push(ip));
        try{
            const { data, status } = await Axios.post('/api/vlans/create', newNetwork);
            if(status === 200){
                let array = ipArray;

                const newIpArrayPayload = {
                    networkID: data,
                    ipArray: array
                };

                try {
                    const { status } = await Axios.post('/api/ip/create', newIpArrayPayload);
                    if(status === 200){
                      utils.notifySuccess('Network created successfully!');
                      props.reloadNetworksList(false);
                      props.close();
                    }
                } catch (err) {
                  utils.notifyError('Server error!');
                }
            }
        } catch(e) {
            if(e.response.status === 409){
                utils.notifyWarning('Network name already used!');
            }
            utils.notifyError('Server error!');
        }
    }

    const handleNetworkDoneCreate = () => {
        if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(networkAddress)){
            const payload = {
                networkName,
                networkAddress,
                networkPrefix,
                networkMask,
                networkDescription
            }
            createNewNetwork(payload);
        } else {
            setNetworkAddressError(true);
        }
    };

    return (
        <div>
            <Modal.Header closeButton>
                <Modal.Title>Create new network:</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{textAlign: 'center'}}>
                <FormControl className={classes.formControlNetworkName}>
                    <TextField className={classes.textFieldNetworkName} value={networkName} onChange={handleNetworkNameChange} id="network-name-textfield" label="Network name:" />
                </FormControl>
                <FormControl className={classes.formControlNetworkAddress}>
                    <TextField error={networkAddressError} className={classes.textFieldNetworkAddress} value={networkAddress} onChange={handleNetworkAddressChange} id="network-address-textfield" label="Network address:" InputProps={{ pattern: [/^((^|\.)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]?\d))){4}$/] }} />
                </FormControl>
                <div style={{display: 'flex', flexDirection: 'row', width: '89%', marginLeft: 'auto', marginRight: 'auto'}}>
                    <FormControl className={classes.formControlPrefix}>
                        <InputLabel className={classes.inputLabelPrefix} id="prefix-select-label">Network prefix:</InputLabel>
                        <Select className={classes.inputSelectPrefix} value={networkPrefix} onChange={handleNetworkPrefixChange} labelId="prefix-select-label" id="prefix-select" autoWidth={false}>
                            <MenuItem className={classes.menuItemPrefix} value="30" >/30</MenuItem>
                            <MenuItem className={classes.menuItemPrefix} value="29" >/29</MenuItem>
                            <MenuItem className={classes.menuItemPrefix} value="28" >/28</MenuItem>
                            <MenuItem className={classes.menuItemPrefix} value="27" >/27</MenuItem>
                            <MenuItem className={classes.menuItemPrefix} value="26" >/26</MenuItem>
                            <MenuItem className={classes.menuItemPrefix} value="25" >/25</MenuItem>
                            <MenuItem className={classes.menuItemPrefix} value="24" >/24</MenuItem>
                            <MenuItem className={classes.menuItemPrefix} value="23" >/23</MenuItem>
                            <MenuItem className={classes.menuItemPrefix} value="22" >/22</MenuItem>
                            <MenuItem className={classes.menuItemPrefix} value="21" >/21</MenuItem>
                            <MenuItem className={classes.menuItemPrefix} value="20" >/20</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControlNetworkMask}>
                        <TextField className={classes.textFieldNetworkMask} value={networkMask} id="network-mask-textfield" label="Network mask:" InputProps={{ readOnly: true }} disabled />
                    </FormControl>
                </div>
                <FormControl className={classes.formControlNetworkDescription}>
                    <TextField className={classes.textFieldNetworDescription} value={networkDescription} onChange={handleNetworkDescriptionChange} id="network-description-textfield" label="Network description (optional):" />
                </FormControl>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.close}>Cancel</Button>
                <Button variant="primary" disabled={!(networkName.length > 0 && networkAddress.length > 0)} onClick={handleNetworkDoneCreate}>Create</Button>
            </Modal.Footer>
        </div>
    );
};

export default CreateNetworkBox;