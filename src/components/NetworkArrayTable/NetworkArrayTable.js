import React from 'react';
import MaterialTable from 'material-table';
import utils from '../../utils';
import Axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

function NetworkArrayTable(props) {
    const [choosenNetworkIpArray, setChoosenNetworkIpArray] = React.useState();
	const [usedOnly, setUsedOnly] = React.useState(false);

    const pingDevice = async (destination) => {
        utils.notifyInfo(`Pinging ${destination} ...`, 1500);
        try {
            const { data, status } = await Axios.post('/api/device/ping', { ip: destination });
            if(status === 200){
                if(data.status === 'online') {
                    setTimeout(() => {
                        utils.notifySuccess(`${destination} is online 👍🏻`);
                    }, 500);
                } else {
                    utils.notifyError(`${destination} is offline 👎🏻`);
                }
            } else {
                utils.notifyError(`Unable to ping ${destination}`);
            }
        } catch(e) {
            utils.notifyError(`Unable to ping ${destination}`);
        }
    };

    const handleCheckSearch = async (usedOnly) => {
        if(choosenNetworkIpArray !== undefined){
            try {
                const search = {
                    id: props.id,
                    usedOnly: usedOnly
                };
                const { data, status } = await Axios.post('/api/ip/array/list', search);
                if(status === 200){
                    setChoosenNetworkIpArray(data);
                }
            } catch(e) {
                utils.notifyError('Unable to retrieve list of IP addresses!');
            }
        }
    };

    React.useEffect(() => {
          const loadNetworkAddresses = async (id) => {
            try {
              const { data, status } = await Axios.get(`/api/ip/array/${id}`);
              if(status === 200){
                setChoosenNetworkIpArray(data);
              }
            } catch(e) {
              utils.notifyError('Unable to retrieve list of IP addresses!');
            }
          };

          loadNetworkAddresses(props.id);
      }, [props.id]);

    if(choosenNetworkIpArray !== undefined) {
        return (
            <div className="Network-Array-Table">
                <MaterialTable style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
                    title= { '' }
                    columns={[
                        { title: 'IP Address', field: 'ip_address', cellStyle: {backgroundColor: '#FFFFFF', textAlign: 'center', padding: '0'}, editable: 'never', sorting: false },
                        { title: 'Device', field: 'device_name', cellStyle: {backgroundColor: '#FFFFFF', textAlign: 'center'}, sorting: false },
                        { title: 'MAC Address', field: 'mac_address', cellStyle: {backgroundColor: '#FFFFFF', textAlign: 'center'}, sorting: false },
                        { title: 'Comment', field: 'comment', cellStyle: {backgroundColor: '#FFFFFF', textAlign: 'center'}, sorting: false },
                        { title: 'Assigned place', field: 'assigned_place', cellStyle: {backgroundColor: '#FFFFFF', textAlign: 'center'}, sorting: true, lookup: { 'Static on DHCP': 'Static on DHCP', 'Static on device': 'Static on device', 'Reserved only': 'Reserved only' } },
                        { title: 'Last edited', field: 'last_edited', cellStyle: {backgroundColor: '#FFFFFF', textAlign: 'center'}, editable: 'never', sorting: true, render: rowData => <span>{new Date(rowData.last_edited).toLocaleString()}</span> }
                    ]}
                    data={choosenNetworkIpArray}
                    options={{
                        rowStyle: rowData => ({
                            backgroundColor: rowData.is_used ? 'rgba(255, 0, 0, 0.75)' : 'rgba(0, 255, 0, 0.75)',
                            textAlign: 'center'
                        }),
                        pageSize: 10,
                        pageSizeOptions: [10,25,50,100,choosenNetworkIpArray.length],
                        headerStyle: {backgroundColor: '#03a9f4', fontWeight: 'bold', textAlign: 'center'},
                        cellStyle: {textAlign: 'center'},
                        draggable: false
                    }}
                    actions={[{
                        icon: () => <SettingsInputAntennaIcon />,
                        tooltip: 'Ping IP',
                        onClick: (event, rowData) => { pingDevice(rowData.ip_address) }
                    },
                    {
                        icon: () => usedOnly ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />,
                        isFreeAction: true,
                        tooltip: 'Used only',
                        onClick: (event) => {
                            setUsedOnly(!usedOnly);
                            handleCheckSearch(!usedOnly);
                        }
                    }
                    ]}
                    editable={{
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve,reject) => {
                                setTimeout( async () => {
                                if (oldData) {
                                    if(newData.device_name !== '') {
                                        if(newData.assigned_place !== ''){
                                            const payload = {
                                                id: newData.id,
                                                deviceName: newData.device_name,
                                                comment: newData.comment,
                                                assignedPlace: newData.assigned_place,
                                                macAddress: newData.mac_address
                                            };
                                            const { status } = await Axios.post('/api/device/add', payload);
                                            if(status === 200){
                                                utils.notifySuccess('Device edited!');
                                                choosenNetworkIpArray[oldData.tableData.id].device_name = newData.device_name;
                                                choosenNetworkIpArray[oldData.tableData.id].comment = newData.comment;
                                                choosenNetworkIpArray[oldData.tableData.id].assigned_place = newData.assigned_place;
                                                choosenNetworkIpArray[oldData.tableData.id].mac_address = newData.mac_address;
                                                choosenNetworkIpArray[oldData.tableData.id].is_used = true;
                                                choosenNetworkIpArray[oldData.tableData.id].last_edited = new Date();
                                                props.reloadCountsCallback();
                                            } else {
                                                utils.notifyError('Error while editing device!');
                                            }
                                        } else {
                                            utils.notifyWarning('Assigned place cannot be empty!');
                                            reject();
                                        }
                                    } else {
                                        utils.notifyWarning('Device cannot be empty!');
                                        reject();
                                    }
                                }
                                resolve();
                            }, 600);
                        }),
                        onRowDelete: oldData =>
                            new Promise(resolve => {
                                setTimeout( async () => {
                                    const payload = {
                                        id: oldData.id
                                    };
                                    const { status } = await Axios.post('/api/device/remove', payload);
                                    if(status === 200){
                                        utils.notifySuccess('Device deleted!');
                                        choosenNetworkIpArray[oldData.tableData.id].device_name = '';
                                        choosenNetworkIpArray[oldData.tableData.id].comment = '';
                                        choosenNetworkIpArray[oldData.tableData.id].assigned_place = '';
                                        choosenNetworkIpArray[oldData.tableData.id].mac_address = '';
                                        choosenNetworkIpArray[oldData.tableData.id].is_used = false;
                                        choosenNetworkIpArray[oldData.tableData.id].last_edited = new Date();
                                        props.reloadCountsCallback();
                                        resolve();
                                    } else {
                                        utils.notifyError('Error while deleting device!');
                                    }
                                resolve();
                            }, 600);
                        }),
                    }}
                />
            </div>
        )
    } else {
        return <div className="ClipBox"><ClipLoader sizeUnit={'px'} size={50} color={'#03a9f4'} loading={true} className={'ClipLoader'} /></div> 
    }
};

export default NetworkArrayTable;