import React from 'react';
import Table from 'react-bootstrap/Table';
import LinearProgress from '@material-ui/core/LinearProgress';
import utils from '../../utils';
import Axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Modal from 'react-bootstrap/Modal';
import Button  from 'react-bootstrap/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  formControlNetworkDescripton: {
      margin: theme.spacing(1),
      width: "85%",
      marginBottom: "15px"
  },
  textFieldNetworkDescripton: {
      textAlign: "center"
  }
}));

function NetworkInfoTable(props) {
    const classes = useStyles();
    const [choosenNetworkInfo, setChoosenNetworkInfo] = React.useState();
    const [countOfAllAddress, setCountOfAllAddress] = React.useState();
    const [countOfUsedAddresses, setCountOfUsedAddresses] = React.useState();
    const [countOfUnusedAddresses, setCountOfUnusedAddresses] = React.useState();
    const [editNetwrokDescriptionPopup, setEditNetwrokDescriptionPopup] = React.useState(false);
    const [newNetworkDescription, setNewNetworkDescription] = React.useState('');

    const handleEditNetworkDescriptionPopupShow = () => { setEditNetwrokDescriptionPopup(true) }
    const handleEditNetworkDescriptionPopupClose = () => { setEditNetwrokDescriptionPopup(false) }
    const handleChangeNewNetworkDescription = (event) => { setNewNetworkDescription(event.target.value) };

    const handleEditNetworkDescription = async () => {
      try {
        const { status } = await Axios.post('/api/vlans/edit', { id: props.id, description: newNetworkDescription });
        if(status === 200){
          setNewNetworkDescription('');
          loadNetworkInfo(props.id);
          handleEditNetworkDescriptionPopupClose();
        }
      } catch(e) {
        utils.notifyError('Unable to edit network description!')
      }
    }

    const handleDeleteNetworkDescription = async () => {
      try {
        const { status } = await Axios.post('/api/vlans/edit', { id: props.id, description: '' });
        if(status === 200){
          loadNetworkInfo(props.id);
        }
      } catch(e) {
        utils.notifyError('Unable to delete network description!')
      }
    }

    const handlePercentage = (num1, num2) => {
        return `${((num1 / num2) * 100).toFixed(2)}`;
    };

    const loadNetworkInfo = async (id) => {
      try {
        const { data, status } = await Axios.get(`/api/vlans/${id}`);
        if(status === 200){
          setChoosenNetworkInfo(data);
        }
      } catch(e) {
        utils.notifyError('Unable to retrieve info about network!');
      }
    };
  
    const loadCountAll = async (id) => {
      try {
        const { data, status } = await Axios.get(`/api/ip/count/all/${id}`);
        if(status === 200){
          setCountOfAllAddress(data);
        }
      } catch(e) {
        utils.notifyError('Unable to retrieve count of addresses!');
      }
    };
  
    const loadCountUsed = async (id) => {
      try {
        const { data, status } = await Axios.get(`/api/ip/count/used/${id}`);
        if(status === 200){
          setCountOfUsedAddresses(data);
        }
      } catch(e) {
        utils.notifyError('Unable to retrieve count of used addresses!')
      }
    };
  
    const loadCountUnused = async (id) => {
      try {
        const { data, status } = await Axios.get(`/api/ip/count/unused/${id}`);
        if(status === 200){
          setCountOfUnusedAddresses(data);
        }
      } catch(e) {
        utils.notifyError('Unable to retrieve count of unused addresses!')
      }
    };

    React.useEffect(() => {
          loadNetworkInfo(props.id);
          loadCountAll(props.id);
          loadCountUsed(props.id);
          loadCountUnused(props.id);
      }, [props.id]);

      React.useEffect(() => {
        loadCountAll(props.id);
        loadCountUsed(props.id);
        loadCountUnused(props.id);
      }, [props.refreshCounts, props.id]);

      
        if(choosenNetworkInfo !== undefined && countOfAllAddress !== undefined && countOfUsedAddresses !== undefined && countOfUnusedAddresses !== undefined) {
            return (
                <div className="Network-Info-Table">
                    <Table responsive={true} style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <thead style={{backgroundColor: 'none', border: 'none'}}>
                            <tr>
                                <th style={{width: '50%',border: 'none', padding: '0', fontWeight: '500'}}>
                                  <span className="Network-Description-Box">{ choosenNetworkInfo.description }</span>
                                  <Button variant="secondary" className="Network-Description-Button" onClick={handleEditNetworkDescriptionPopupShow}><EditIcon className="Network-Description-Button-Icon-Edit" /></Button>
                                  <Button variant="secondary" className="Network-Description-Button" onClick={handleDeleteNetworkDescription}><DeleteIcon className="Network-Description-Button-Icon-Delete" /></Button>
                                </th>
                            </tr>
                        </thead>
                    </Table>
                    <Modal show={editNetwrokDescriptionPopup} onHide={handleEditNetworkDescriptionPopupClose} centered>
                      <Modal.Header closeButton>
                          <Modal.Title>Network description:</Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={{textAlign: 'center'}}>
                        <FormControl className={classes.formControlNetworkDescripton}>
                            <TextField className={classes.textFieldNetworkDescripton} value={newNetworkDescription} onChange={handleChangeNewNetworkDescription} id="network-description-textfield" label="Network description:" />
                        </FormControl>
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={handleEditNetworkDescriptionPopupClose}>Cancel</Button>
                          <Button variant="primary" disabled={!(newNetworkDescription.length > 0)} onClick={handleEditNetworkDescription}>Edit</Button>
                      </Modal.Footer>
                    </Modal>
                    <Table responsive={true} style={{ textAlign: 'center' }}>
                        <thead style={{backgroundColor: 'none', border: 'none'}}>
                            <tr>
                                <th style={{width: '20%',border: 'none', padding: '0', fontWeight: '500'}}>Network</th>
                                <th style={{width: '20%',border: 'none', padding: '0', fontWeight: '500'}}># IPs</th>
                                <th style={{width: '20%',border: 'none', padding: '0', fontWeight: '500'}}># Used IPs</th>
                                <th style={{width: '20%',border: 'none', padding: '0', fontWeight: '500'}}># Unused IPs</th>
                                <th style={{width: '20%',border: 'none', padding: '0', fontWeight: '500'}}>% Filled</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{border: 'none', padding: '5px'}}>{choosenNetworkInfo.name}</td>
                                <td style={{border: 'none', padding: '5px'}}>{countOfAllAddress}</td>
                                <td style={{border: 'none', padding: '5px'}}>{countOfUsedAddresses}</td>
                                <td style={{border: 'none', padding: '5px'}}>{countOfUnusedAddresses}</td>
                                <td style={{border: 'none', padding: '5px'}}>{handlePercentage(countOfUsedAddresses, countOfAllAddress)} %</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Table responsive={true} style={{ textAlign: 'center' }}>
                        <thead style={{backgroundColor: 'none', border: 'none'}}>
                            <tr>
                                <th style={{width: '20%',border: 'none', padding: '0', fontWeight: '500'}}>Network address</th>
                                <th style={{width: '20%',border: 'none', padding: '0', fontWeight: '500'}}>Network mask</th>
                                <th style={{width: '20%',border: 'none', padding: '0', fontWeight: '500'}}>Broadcast IP</th>
                                <th style={{width: '20%',border: 'none', padding: '0', fontWeight: '500'}}>First IP</th>
                                <th style={{width: '20%',border: 'none', padding: '0', fontWeight: '500'}}>Last IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{border: 'none', padding: '5px'}}>{choosenNetworkInfo.network_ip}</td>
                                <td style={{border: 'none', padding: '5px'}}>{choosenNetworkInfo.network_mask}</td>
                                <td style={{border: 'none', padding: '5px'}}>{choosenNetworkInfo.broadcast_ip}</td>
                                <td style={{border: 'none', padding: '5px'}}>{choosenNetworkInfo.start_ip}</td>
                                <td style={{border: 'none', padding: '5px'}}>{choosenNetworkInfo.end_ip}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <div style={{width: '95%', marginLeft: 'auto', marginRight: 'auto', paddingTop: '15px'}}>
                        <LinearProgress variant="determinate" color="primary" value={Number(handlePercentage(countOfUsedAddresses, countOfAllAddress))} />
                    </div>
                    <span className="Divider" />
                </div>
            )
        } else {
            return <div className="ClipBox"><ClipLoader sizeUnit={'px'} size={50} color={'#03a9f4'} loading={true} className={'ClipLoader'} /></div> 
        }
};

export default NetworkInfoTable;