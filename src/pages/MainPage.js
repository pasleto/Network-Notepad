import React from 'react';
import Card from 'react-bootstrap/Card';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Axios from 'axios';
import utils from '../utils';
import Modal from 'react-bootstrap/Modal';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { NetworkInfoTable, NetworkArrayTable } from '../components'
import { CreateNetworkBox, DeleteNetworkBox } from '../components';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: "40%",
    marginRight: "10%",
    marginLeft: "10%",
  },
  inputLabel: {
    marginTop: "10px",
    marginLeft: "5px",
  },
  inputSelect: {
    height: "50px",
  },
  menuItem: {
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  addButton: {
    height: "40px",
    marginTop: "20px",
    marginLeft: "20px",
    marginRight: "20px",
    width: "15%",
  },
  deleteButton: {
    height: "40px",
    marginTop: "20px",
    marginLeft: "20px",
    marginRight: "20px",
    width: "15%",
  },
  buttonIcon: {
    marginRight: "10px",
  }
}));

function MainPage() {
  const classes = useStyles();
  const [choosenNetworkId, setChoosenNetworkId] = React.useState('');
  const [networksArray, setNetworksArray] = React.useState([]);
  const [refreshCounts, doRefreshCounts] = React.useState(0);
	const [deleteExistingNetworkPopup, setDeleteExistingNetworkPopup] = React.useState(false);
  const [createNewNetworkPopup, setCreateNewNetworkPopup] = React.useState(false);
  
  const handleDeleteExistingNetworkPopupClose = () => { setDeleteExistingNetworkPopup(false) }
  const handleDeleteExistingNetworkPopupShow = () => { 
      setDeleteExistingNetworkPopup(true);
  }
  const handleCreateNewNetworkPopupClose = () => { setCreateNewNetworkPopup(false) }
  const handleCreateNewNetworkPopupShow = () => { 
      setCreateNewNetworkPopup(true);
  }

  const handleChange = (event) => {
    setChoosenNetworkId(event.target.value);
  };

  const handleReloadNetworksArray = async (clear) => {
    try {
      const { data, status } = await Axios.get('/api/vlans/all');
      if(status === 200){
        setNetworksArray(data);
        if(clear){
          setChoosenNetworkId('');
        }
      }
    } catch(e) {
      utils.notifyError('Unable to retrieve networks list!')
    }
  };

  const reloadCountsCallback = () => {
    doRefreshCounts(refreshCounts+1);
  }

  React.useEffect(() => {
    handleReloadNetworksArray(false);
  }, []);

  return (
    <div className="App-Main-Page">
        <Card className="Home-Page">
          <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', justifyItems: 'center', alignContent: 'center'}}>
            <Button className={classes.deleteButton} onClick={handleDeleteExistingNetworkPopupShow} ><RemoveCircleIcon className={classes.buttonIcon} /> Remove Network</Button>
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
            <Button className={classes.addButton} onClick={handleCreateNewNetworkPopupShow} ><AddCircleIcon className={classes.buttonIcon} /> Add Network</Button>
            <Modal show={createNewNetworkPopup} onHide={handleCreateNewNetworkPopupClose} centered>
                <CreateNetworkBox close={handleCreateNewNetworkPopupClose} reloadNetworksList={handleReloadNetworksArray} />
            </Modal>
            <Modal show={deleteExistingNetworkPopup} onHide={handleDeleteExistingNetworkPopupClose} centered>
                <DeleteNetworkBox choosenNetworkId={choosenNetworkId} close={handleDeleteExistingNetworkPopupClose} reloadNetworksList={handleReloadNetworksArray} />
            </Modal>
          </div>
            { choosenNetworkId !== '' ? <NetworkInfoTable id={choosenNetworkId} refreshCounts={refreshCounts} /> : null }
            { choosenNetworkId !== '' ? <NetworkArrayTable id={choosenNetworkId} reloadCountsCallback={reloadCountsCallback} /> : null }
        </Card>
    </div>
  );
};

export default MainPage;