
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import dayjs from 'dayjs';
import BaseContext from '../Context/BaseContext.jsx';
import UserContext from '../Context/UserContext.jsx';
import axios from 'axios';
import BaseDataContext from '../Context/BaseDataContext.jsx';
import currentBaseContext from '../Context/CurrentBaseContect.jsx';

const Transfer = () => {
  const { base, setBase } = React.useContext(BaseContext);
  const { user, setUser } = React.useContext(UserContext)
  const { fetchBase, setFetchBase } = React.useContext(BaseDataContext);
  const [fromBase, setFromBase] = React.useState(user.base);
  const { selectBase, setSelectBase } = React.useContext(currentBaseContext)
  const [toBase, setToBase] = React.useState('');
  const [movement, setMovement] = React.useState('');


  const cards = [

    { image: "/AH64.jpg", arm_name: "Helicopter", specific_name: "AH-64 Apache Helicopter", quantity: 0 },
    { image: "/ch47.jpeg", arm_name: "Helicopter", specific_name: "CH-47 Chinook", quantity: 0 },
    { image: "/OH58.jpg", arm_name: "Helicopter", specific_name: "OH-58 Kiowa", quantity: 0 },
    { image: "/M4.jpg", arm_name: "Rifle", specific_name: "M4 Carbine", quantity: 0 },
    { image: "/BM82.jpg", arm_name: "Rifle", specific_name: "Barrett M82", quantity: 0 },
    { image: "/HK417.jpg", arm_name: "Rifle", specific_name: "HK417", quantity: 0 },
    { image: "/M4 Ammo.jpg", arm_name: "Ammo", specific_name: "M4 Ammo (60 rounds)", quantity: 0 },
    { image: "/BM82 Ammo.jpg", arm_name: "Ammo", specific_name: "Barrett M82 Ammo (60 rounds)", quantity: 0 },
    { image: "/HK417 Ammo.jpg", arm_name: "Ammo", specific_name: "HK417 Ammo (60 rounds)", quantity: 0 },
    { image: "/Grenades.jpg", arm_name: "Grenade", specific_name: "Grenades (Explosive with shrapnel spread)", quantity: 0 },
    { image: "/M1 Abrams.jpg", arm_name: "Tank", specific_name: "M1 Abrams (Heavy armor & firePower)", quantity: 0 },
    { image: "/Stingray tank.jpg", arm_name: "Tank", specific_name: "Stingray (Fast maneuverability)", quantity: 0 },
    { image: "/merkava tank.jpg", arm_name: "Tank", specific_name: "Merkava (Hybrid combat & troop protection)", quantity: 0 },
    { image: "/GBR.jpg", arm_name: "Radar", specific_name: "Ground-Based Radar (Detects aerial threats)", quantity: 0 },
    { image: "/NBR.jpg", arm_name: "Radar", specific_name: "Naval Radar System (Ship-based navigation & tracking)", quantity: 0 },
    { image: "/ABR.jpg", arm_name: "Radar", specific_name: "Airborne Radar (Mounted on aircraft for aerial surveillance)", quantity: 0 },
    { image: "/F22.jpg", arm_name: "Jet_Fighter", specific_name: "F-22 Raptor (Undetectable radar signature)", quantity: 0 },
    { image: "/F16.jpg", arm_name: "Jet_Fighter", specific_name: "F-16 Fighting Falcon (Balanced agility & firepower)", quantity: 0 },
    { image: "/mig31.jpg", arm_name: "Jet_Fighter", specific_name: "MiG-31 (High-speed enemy pursuit)", quantity: 0 },
    { image: "/nimitz.jpg", arm_name: "Aircraft_Carrier", specific_name: "Nimitz-class (Massive deployment capabilities)", quantity: 0 },
    { image: "/invincible.jpg", arm_name: "Aircraft_Carrier", specific_name: "Invincible-class (Smaller, more flexible operations)", quantity: 0 },
    { image: "/wasp.jpg", arm_name: "Aircraft_Carrier", specific_name: "Wasp-class (Optimized for rotary aircraft)", quantity: 0 },
    { image: "/ICMB.jpg", arm_name: "Missile_Launcher", specific_name: "ICMB Platforms (Long-range warfare)", quantity: 0 },
    { image: "/tamahawk.jpg", arm_name: "Missile_Launcher", specific_name: "Tomahawk-equipped systems (Precision strikes)", quantity: 0 },
    { image: "/patriot.jpg", arm_name: "Missile_Launcher", specific_name: "Patriot System (Air defense)", quantity: 0 },
    { image: "/virginia.jpg", arm_name: "Submarine", specific_name: "Virginia-class (Stealth & underwater combat)", quantity: 0 },
    { image: "/ohio.jpg", arm_name: "Submarine", specific_name: "Ohio-class (Strategic nuclear deterrence)", quantity: 0 },
    { image: "/nr1.jpg", arm_name: "Submarine", specific_name: "NR-1 (Covert intelligence gathering)", quantity: 0 },
    { image: "/kevlar.jpg", arm_name: "Body_Armor", specific_name: "Kevlar-based torso protection", quantity: 0 },
    { image: "/Exoskeleton.jpg", arm_name: "Body_Armor", specific_name: "Exoskeleton Armor - Enhances soldier endurance", quantity: 0 },
    { image: "/riot gear.jpg", arm_name: "Body_Armor", specific_name: "Riot Gear Armor - Shields against melee attack", quantity: 0 },
    { image: "/howitzer.jpg", arm_name: "Artillery_Cannon", specific_name: "Howitzer - Long-range fire support", quantity: 0 },
    { image: "/rocket Artillery.jpg", arm_name: "Artillery_Cannon", specific_name: "Rocket Artillery - Multiple rapid launches", quantity: 0 },
    { image: "/anti aircraft.jpg", arm_name: "Artillery_Cannon", specific_name: "Anti-Aircraft Artillery - Defense against airborne threat", quantity: 0 },
    { image: "/thermal goggles.jpg", arm_name: "Night_Vision_Goggles", specific_name: "Thermal Goggles - Detects heat signatures", quantity: 0 },
    { image: "/infrared goggles.jpg", arm_name: "Night_Vision_Goggles", specific_name: "Infrared Goggles - Enhances visibility in darkness", quantity: 0 },
    { image: "/mq9.jpg", arm_name: "Drone", specific_name: "MQ-9 Reaper (Surveillance & intelligence)", quantity: 0 },
    { image: "/xq58.jpg", arm_name: "Drone", specific_name: "XQ-58 Valkyrie (Armed autonomous strike unit)", quantity: 0 },
    { image: "/trs.jpg", arm_name: "Communication_System", specific_name: "Tactical Radio System - Encrypted unit-level communication", quantity: 0 },
    { image: "/SCS.jpg", arm_name: "Communication_System", specific_name: "Satellite Communication System - Global military relay", quantity: 0 },
    { image: "/mcn.jpg", arm_name: "Communication_System", specific_name: "Mobile Command Network - Battlefield coordination interface", quantity: 0 }


  ]

  const [quantity, setQuantity] = React.useState(Array(cards.length).fill(0));

  const transOutLimit = base.arms_data.filter((item) =>
    item.date === new Date().toISOString().split("T")[0]
  )
  const transOutItemLimit = transOutLimit.flatMap(item => item.arms);

  const handleChangeFrom = (event) => {
    setFromBase(event.target.value);
  };
  const handleChangeTo = (event) => {
    setToBase(event.target.value);
  };
  React.useEffect(() => {
    const baseObj = user.role === "admin" ? fetchBase.find(item => item.basename === fromBase) : fetchBase;
    if (baseObj !== base) {
      setBase(baseObj || null);
    }
  }, [fromBase])

  const handleSubmit = (e) => {
    e.preventDefault();

    if (fromBase && toBase && movement) {

      const transferItems = cards
        .map((item, index) => {
          if (quantity[index] > 0) {
            const { image, ...filteredItem } = item;
            return { ...filteredItem, quantity: quantity[index] };
          }
          return null;
        })
        .filter(item => item !== null);

      const newTransaction = async () => {
        const response = await axios.post("https://military-asset-be.onrender.com/base/newtransaction", {
          requesting_base: fromBase,
          receiving_base: toBase,
          movement_type: movement,
          initiator: user.username,
          item_details: transferItems

        });
        if (response.data.message === 'requested successfully') {
          setBase(response.data.base);
          setFetchBase(fetchBase.map((item) => {
            if (item.basename === base.basename) {
              return response.data.base
            }
            else {
              return item
            }
          }))
          setFromBase('');
          setToBase("");
          setMovement("");
          setQuantity(Array(cards.length).fill(0));
        }
      }

      newTransaction();

      console.log(transferItems);

    }
    else {

      if (!fromBase) {
        alert("Select From Base")
      }
      else if (!toBase) {
        alert("Select To Base")
      }
      else if (!movement) {
        alert("Select Movement")
      }
    }
  };



  const fromBaseNames = user.role === 'admin' ? ([
    'Fort Titan', 'Echo Command', 'Sentinel Base', 'Ironclad Depot', 'Vanguard Station',
    'Guardian Outpost', 'Shadow Ridge', 'Falcon Fortress', 'Phoenix Armory', 'Havoc Point',
    'Redhawk Barracks', 'Thunderhold Base', 'Stormwatch HQ', 'Silver Spear Depot', 'Raven Rock Command',
    'Warhound Keep', 'Crossfire Station', 'Blackstone Bunker', 'Delta Sentinel', 'Legion Hold',
    'Cerberus Outpost', 'Fort Resolute', 'Ironwing Command', 'Helix Forward Base', 'Striker Point'
  ]) : [user.base];

  const baseNames = [
    'Fort Titan', 'Echo Command', 'Sentinel Base', 'Ironclad Depot', 'Vanguard Station',
    'Guardian Outpost', 'Shadow Ridge', 'Falcon Fortress', 'Phoenix Armory', 'Havoc Point',
    'Redhawk Barracks', 'Thunderhold Base', 'Stormwatch HQ', 'Silver Spear Depot', 'Raven Rock Command',
    'Warhound Keep', 'Crossfire Station', 'Blackstone Bunker', 'Delta Sentinel', 'Legion Hold',
    'Cerberus Outpost', 'Fort Resolute', 'Ironwing Command', 'Helix Forward Base', 'Striker Point'
  ]

  return (
    <div>
      <form >
        <div className="mt-4 d-flex justify-content-around align-items-center">
          <div className='m-3 d-flex justify-content-around align-items-center'>
            <div style={{ width: "100px" }}>From Base :</div>
            <div style={{ minWidth: "250px", maxWidth: "30vw" }}>
              <Box sx={{ minWidth: 200 }}>
                <FormControl fullWidth>
                  <InputLabel id="base-select-label">Select Base</InputLabel>
                  <Select
                    labelId="base-select-label"
                    id="base-select"
                    value={fromBase}
                    label="Select Base"
                    onChange={handleChangeFrom}
                  >
                    {fromBaseNames.map((name, index) => (
                      name != toBase ?
                        (<MenuItem key={index} value={name}>
                          {name}
                        </MenuItem>) : null
                    ))}
                  </Select>
                </FormControl>
              </Box>

            </div>
          </div>
          <div className='m-3 d-flex justify-content-around align-items-center'>
            <div style={{ width: "100px" }}>To Base :</div>
            <div style={{ minWidth: "250px", maxWidth: "30vw" }}>
              <Box sx={{ minWidth: 200 }}>
                <FormControl fullWidth>
                  <InputLabel id="base-select-label">Select Base</InputLabel>
                  <Select
                    labelId="base-select-label"
                    id="base-select"
                    value={toBase}
                    label="Select Base"
                    onChange={handleChangeTo}
                  >
                    {baseNames.map((name, index) => (
                      name != fromBase ?
                        (<MenuItem key={index} value={name}>
                          {name}
                        </MenuItem>) : null
                    ))}
                  </Select>
                </FormControl>
              </Box>

            </div>
          </div>
        </div>
        <div className='d-flex justify-content-evenly align-items-center'>
          <div><label><input type="radio" name="transfer" value="transfer in" onChange={(e) => { setMovement(e.target.value); setQuantity(Array(cards.length).fill(0)) }} checked={movement === "transfer in"} required /> Transfer In</label></div>
          <div><label><input type="radio" name="transfer" value="transfer out" onChange={(e) => { setMovement(e.target.value); setQuantity(Array(cards.length).fill(0)) }} checked={movement === "transfer out"} required /> Transfer Out</label></div>

        </div>


        <div className="row gx-4 gx-lg-5 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 justify-content-center mt-5" style={{ width: "100vw" }}>
          {
            cards.map((value, index) => (

              <div className='col mb-5 d-flex justify-content-center' key={index} style={{ cursor: "pointer" }} >
                <div className="card" style={{ maxWidth: " 15rem", height: "25rem", boxShadow: "0 0 15px" }}  >
                  <img src={value.image} width={100} height={180} className=" p-4 card-img-top " alt="img" style={{ position: "relative" }} />

                  <div className="card-body">
                    <h5 className="card-title text-center" id="multiline-ellipsis">{value.specific_name}</h5>
                    {movement === "transfer out" ?
                      (<p className="card-text text-center" >  {transOutItemLimit[index]?.unassigned || 0} Left</p>
                      ) : null}
                    <div className="d-flex">
                      <div>Quantity for Transfer Out : </div>
                      <div className='ms-2 w-50' >

                        <input
                          className='form-control'
                          type="number"
                          name={`item_details[${index}].quantity`}
                          value={quantity[index]}
                          onChange={(e) => {
                            const newValue = Number(e.target.value);
                            setQuantity((prevQuantity) => {
                              const updatedQuantity = [...prevQuantity];
                              updatedQuantity[index] = Math.min(newValue, movement === "transfer out" ? transOutItemLimit[index]?.unassigned || 0 : 100);
                              return updatedQuantity;
                            });
                          }}
                          min="0"
                          max={movement === "transfer out" ? transOutItemLimit[index]?.unassigned || 0 : 1000000}

                        />

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }


        </div>
        <div className="d-flex justify-content-center align-items-center">
          <button type='submit' className='btn btn-warning w-75' onClick={handleSubmit}> Transfer Arms</button>
        </div>
      </form>

    </div>
  )
}

export default Transfer



