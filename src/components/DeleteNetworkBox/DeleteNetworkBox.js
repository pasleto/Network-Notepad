import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button  from 'react-bootstrap/Button';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import utils from '../../utils';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      width: "75%",
      marginBottom: "25px",
      marginTop: "15px"
    },
    inputLabel: {
      marginTop: "5px",
      marginLeft: "5px",
    },
    inputSelect: {
      height: "40px",
    },
    menuItem: {
      paddingTop: "5px",
      paddingBottom: "5px",
    },
  }));

function DeleteNetworkBox(props) {
    const classes = useStyles();
    const [choosenNetworkId, setChoosenNetworkId] = React.useState('');
    const [networksArray, setNetworksArray] = React.useState([]);

    const handleChange = (event) => {
        setChoosenNetworkId(event.target.value);
    };

    const handleNetworkDelete = async () => {
        try {
            const { status } = await Axios.post('/api/vlans/delete', { id: choosenNetworkId });
            if(status === 200){
                utils.notifySuccess('Network successfully deleted!');
                if(choosenNetworkId === props.choosenNetworkId){
                    props.reloadNetworksList(true);
                } else {
                    props.reloadNetworksList(false);
                }
                // props.reloadNetworksList();
                props.close();
            }
        } catch(e) {
            utils.notifyError('Unable to delete network!');
        }
    };

    React.useEffect(() => {
        const loadNetworkArray = async () => {
            try {
                const { data, status } = await Axios.get('/api/vlans/all');
                if(status === 200){
                    setNetworksArray(data);
                    setChoosenNetworkId('');
                }
            } catch(e) {
                utils.notifyError('Unable to retrieve Networks List!');
            }
        }
        loadNetworkArray();
    }, []);

    return (
        <div>
            <Modal.Header closeButton>
                <Modal.Title>Delete existing network:</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{textAlign: 'center'}}>
                <span style={{color: 'rgba(255,0,0,1)'}}>This action cannot be undone!</span>
                <FormControl className={classes.formControl}>
                    <InputLabel className={classes.inputLabel} id="network-select-label">Choose network:</InputLabel>
                    <Select className={classes.inputSelect} value={choosenNetworkId} onChange={handleChange} labelId="network-select-label" id="network-select" autoWidth={false}>
                        {
                            networksArray.length > 0 
                            ? networksArray.map((network, i) => {
                                return <MenuItem className={classes.menuItem} value={network.id} key={i}>{network.name}</MenuItem>
                            }) 
                            : <MenuItem className={classes.menuItem} value="" disabled>You have no networks!</MenuItem>
                        }
                    </Select>
                </FormControl>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.close}>Cancel</Button>
                <Button disabled={choosenNetworkId === ''} variant="primary" onClick={handleNetworkDelete}>Delete</Button>
            </Modal.Footer>
        </div>
    );
};

export default DeleteNetworkBox;