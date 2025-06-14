import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import BaseContext from '../Context/BaseContext.jsx';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import dayjs from 'dayjs';
import { add, format } from 'date-fns';
import UserContext from '../Context/UserContext.jsx';


const Dashboard = () => {
  const [merge, setMerge] = useState(false);
  const { base, setBase } = React.useContext(BaseContext);
  const { user, setUser } = React.useContext(UserContext);

  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [selectBase, setSelectBase] = React.useState(user.base);

  const baseNames = user.role === 'admin' ? ([
    'Fort Titan', 'Echo Command', 'Sentinel Base', 'Ironclad Depot', 'Vanguard Station',
    'Guardian Outpost', 'Shadow Ridge', 'Falcon Fortress', 'Phoenix Armory', 'Havoc Point',
    'Redhawk Barracks', 'Thunderhold Base', 'Stormwatch HQ', 'Silver Spear Depot', 'Raven Rock Command',
    'Warhound Keep', 'Crossfire Station', 'Blackstone Bunker', 'Delta Sentinel', 'Legion Hold',
    'Cerberus Outpost', 'Fort Resolute', 'Ironwing Command', 'Helix Forward Base', 'Striker Point'
  ]) : [user.base];

  const handleChange = (event) => {
    setSelectBase(event.target.value);

  };


  console.log(base);
  const assetNames = [
    'Helicopter', 'Rifle', 'Ammo', 'Grenade', 'Tank', 'Radar', 'Jet_Fighter',
    'Aircraft_Carrier', 'Missile_Launcher', 'Submarine', 'Body_Armor', 'Artillery_Cannon',
    'Night_Vision_Goggles', 'Drone', 'Communication_System'
  ];
  const formattedSelectedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  const openingBalance = Array(assetNames.length).fill(0);
  const closingBalance = Array(assetNames.length).fill(0);
  const purchaseNetMovement = Array(assetNames.length).fill(0);
  const transferInNetMovement = Array(assetNames.length).fill(0);
  const transferOutNetMovement = Array(assetNames.length).fill(0);
  const purchase = base.transaction.filter(item => item.movement_type === 'purchase' && item.completion_date === formattedSelectedDate);
  const transferIn = base.transaction.filter(item => item.movement_type === 'transfer in' && item.completion_date === formattedSelectedDate);
  const transferOut = base.transaction.filter(item => item.movement_type === 'transfer out' && item.initiation_date === formattedSelectedDate);
  assetNames.forEach((item, index) => {
    purchase.forEach(transaction => {
      transaction.item_details.forEach(arm => {
        if (item === arm.arm_name) {
          purchaseNetMovement[index] = (purchaseNetMovement[index] || 0) + arm.quantity;
        }
      });
    });
    transferIn.forEach(transaction => {
      transaction.item_details.forEach(arm => {
        if (item === arm.arm_name) {
          transferInNetMovement[index] = (transferInNetMovement[index] || 0) + arm.quantity;
        }
      });
    });
    transferOut.forEach(transaction => {
      transaction.item_details.forEach(arm => {
        if (item === arm.arm_name) {
          transferOutNetMovement[index] = (transferOutNetMovement[index] || 0) + arm.quantity;
        }
      });
    })
  });

  const previousDate = dayjs(selectedDate).subtract(1, "day").format("YYYY-MM-DD");

  const armsData = base.arms_data;
  console.log(formattedSelectedDate);

  const availableDates = armsData.filter(item => item.date < formattedSelectedDate);
  const nearestPreviousDate = availableDates.length > 0
    ? availableDates.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))[0]
    : null;
  console.log(nearestPreviousDate);
  const addArmsData = async () => {
    const response = await axios.post("https://military-asset-be.onrender.com/base/addarmsdata", {
      basename: base.basename,
      date: formattedSelectedDate,
      query: nearestPreviousDate.arms
    });
    if (response.data.base) {
      setBase(response.data.base);
    }
  };

  const selectedArmsData = armsData.find(item => item.date === formattedSelectedDate);
  if (selectedArmsData) {
    selectedArmsData.arms.forEach((item) => {
      assetNames.forEach((name, index) => {
        if (item.arm_name === name) {
          closingBalance[index] += item.total;
        }
      });
    });
  } else if (nearestPreviousDate) {
    nearestPreviousDate.arms.forEach((item) => {
      assetNames.forEach((name, index) => {
        if (item.arm_name === name) {
          closingBalance[index] += item.total;
        }
      });
    });
    addArmsData();
  }

  if (nearestPreviousDate) {
    nearestPreviousDate.arms.forEach((item) => {
      assetNames.forEach((name, index) => {
        if (item.arm_name === name) {
          openingBalance[index] += item.total;
        }
      });
    });
  }





  console.log(openingBalance)
  console.log(closingBalance);
  const netMovement = transferOutNetMovement.map((value, index) =>
    (purchaseNetMovement[index] || 0) + (transferInNetMovement[index] || 0) - (value || 0)
  );
  console.log(netMovement)
  const netSeries = [
    {
      label: 'Net Movement',
      data: netMovement,
    }
  ];




  return (
    <div>
      <div className='p-4 d-flex justify-content-around align-items-center flex-wrap' style={{ width: "100%" }}>
        <div className='m-3 d-flex justify-content-around align-items-center'>
          <div style={{ width: "100px" }}>Date Range :</div>
          <div style={{ minWidth: "300px", maxWidth: "40vw" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                calendars={1}
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={(newValue) => {
                  if (newValue) {
                    const formattedDate = newValue.format("YYYY-MM-DD");
                    const today = dayjs().format("YYYY-MM-DD"); // Define `today` here


                    if (formattedDate <= today) {
                      setSelectedDate(formattedDate);
                    } else {
                      alert("You cannot select a future date.");
                    }

                  }
                }}
              />
            </LocalizationProvider>


          </div>

        </div>



        <div className='m-3 d-flex justify-content-around align-items-center'>
          <div style={{ width: "100px" }}>Base Name :</div>
          <div style={{ minWidth: "250px", maxWidth: "30vw" }}>
            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth>
                <InputLabel id="base-select-label">Select Base</InputLabel>
                <Select
                  labelId="base-select-label"
                  id="base-select"
                  value={selectBase}
                  label="Select Base"
                  onChange={handleChange}
                >
                  {baseNames.map((name, index) => (
                    <MenuItem key={index} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

          </div>
        </div>
      </div>
      <div className='p-5 d-flex justify-content-around align-items-center flex-wrap'>

        {merge ? (
          <div>
            <div className="card m-3" style={{ width: "75vw", minWidth: "600px" }}>
              <div className="card-body">
                <h5 className="card-title">Opening & Closing Balance Compare</h5>

                <BarChart
                  height={300}
                  xAxis={[{ data: assetNames }]}
                  series={[
                    { label: 'Opening Balance', data: openingBalance, color: '#ff5733' },
                    { label: 'Closing Balance', data: closingBalance, color: '#33c4ff' }
                  ]}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", cursor: "pointer" }} onClick={() => setMerge(false)}>
                  <div className='p-2 btn btn-primary'>Split </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="card m-3" style={{ maxWidth: "75vw", minWidth: "350px", width: "600px" }}>
              <div className="card-body">
                <h5 className="card-title">Opening Balance</h5>
                <BarChart
                  height={300}
                  xAxis={[{ data: assetNames }]}
                  series={[{ label: 'Opening Balance', data: openingBalance, color: '#ff5733', valueFormatter: (val) => `${val}` }]}
                  skipAnimation={false}
                />
              </div>
            </div>
            <div onClick={() => setMerge(true)} style={{ cursor: "pointer" }}>
              <FontAwesomeIcon icon={faClone} size='2x' />
            </div>

            <div className="card m-3" style={{ maxWidth: "75vw", minWidth: "350px", width: "600px" }}>
              <div className="card-body">
                <h5 className="card-title">Closing Balance</h5>
                <BarChart
                  height={300}
                  xAxis={[{ data: assetNames }]}
                  series={[{ label: 'Closing Balance', data: closingBalance, color: '#33c4ff' }]}
                  skipAnimation={false}
                />
                {/* <BarChart
        height={300}
        xAxis={[{ data: assetNames }]}
        series={[
          { label: 'Opening Balance', data: openingBalance, color: '#ff5733' },
          { label: 'Closing Balance', data: closingBalance, color: '#33c4ff' }
        ]}
      /> */}

              </div>
            </div>
          </>
        )}

        <div className="card m-3" style={{ maxWidth: "75vw", minWidth: "350px", width: "600px" }}>
          <div className="card-body">
            <h5 className="card-title">Net Movement</h5>
            <BarChart
              height={300}
              xAxis={[{ data: assetNames }]}
              series={[
                { label: 'Net Movement', data: netMovement }
              ]}
              skipAnimation={false}
              yAxis={[{
                colorMap: {
                  type: 'piecewise',
                  thresholds: [0],
                  colors: ['red', 'green'],
                }
              }]}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;



